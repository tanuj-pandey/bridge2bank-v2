import { Injectable, signal } from '@angular/core';
import {
  ChatMessage,
  UserProfile,
  EligibilityCheck,
  SchemeRecommendation,
} from '../types/ai-assistant.interface';
import { Scheme } from '../types/scheme.interface';
import { SchemeService } from './scheme.service';

declare const responsiveVoice: any;


@Injectable({
  providedIn: 'root',
})
export class AIAssistantService {
  private messages = signal<ChatMessage[]>([]);
  private isListening = signal<boolean>(false);
  private isTyping = signal<boolean>(false);
  private userProfile = signal<UserProfile>({});
  private recognition: any;
  private synthesis: any;
  private userId = this.generateUserId();
  private currentLanguage = 'en';

  // API configuration for future use
  private readonly API_BASE_URL = 'https://api.example.com'; // Replace with your API endpoint
  private API_TOKEN = ''; // Will be set when available

  constructor(private schemeService: SchemeService) {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.addWelcomeMessage();
  }

  getMessages() {
    return this.messages.asReadonly();
  }

  getIsListening() {
    return this.isListening.asReadonly();
  }

  getIsTyping() {
    return this.isTyping.asReadonly();
  }

  getUserProfile() {
    return this.userProfile.asReadonly();
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      const observer = new MutationObserver(() => {
        this.updateLanguage(this.detectGoogleLang());
      });
      observer.observe(document.documentElement, {attributes : true, attributeFilter: ['lang']});

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening.set(false);
        this.sendMessage(transcript, 'voice');
      };

      this.recognition.onerror = () => {
        this.isListening.set(false);
      };

      this.recognition.onend = () => {
        this.isListening.set(false);
      };
    }
  }

  private detectGoogleLang(): string {
    const match = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z-]{2,5})/i);
    return match ? match[1] : 'en-IN';
  }

  private updateSpeechLanguage(): void {
    if (this.recognition) {
      const languageMap: { [key: string]: string } = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN',
        'bn': 'bn-IN'
      };
      this.recognition.lang = languageMap[this.currentLanguage] || 'en-IN';
    }
  }

  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      id: this.generateMessageId(),
      text: "Hello! I'm your AI assistant for government schemes. I can help you find schemes based on your eligibility, answer questions about specific schemes, or guide you through our personalized scheme finder. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    };
    this.messages.update((messages) => [...messages, welcomeMessage]);
  }

  private async processMessage(text: string, type: 'text' | 'voice' = 'text'): Promise<void> {
      // Fallback to local processing
      this.processMessageLocally(text);
  }

  async sendMessage(
    text: string,
    type: 'text' | 'voice' = 'text'
  ): Promise<void> {
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type,
    };
    this.messages.update((messages) => [...messages, userMessage]);

    // Show typing indicator
    this.isTyping.set(true);

    try {
      // Check if API is available
      if (this.API_TOKEN) {
        await this.sendToAPI(text, type);
      } else {
        // Use local processing
        await this.processMessage(text, type);
      }

      // Speak response if it was a voice input
      if (type === 'voice') {
        // Wait a bit for Botpress response, then speak it
        setTimeout(() => {
          const lastMessage = this.messages()[this.messages().length - 1];
          if (lastMessage && lastMessage.sender === 'bot' && lastMessage.text) {
            this.speakText(lastMessage.text);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: this.generateMessageId(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
      };
      this.messages.update((messages) => [...messages, errorMessage]);
    } finally {
      this.isTyping.set(false);
    }
  }

  private async sendToAPI(text: string, type: 'text' | 'voice'): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_TOKEN}`
        },
        body: JSON.stringify({
          message: text,
          type,
          userId: this.userId,
          language: this.currentLanguage
        })
      });
      
      const data = await response.json();
      this.handleAPIResponse(data);
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to local processing
      await this.processMessage(text, type);
    }
  }

  private handleAPIResponse(data: any): void {
    const botMessage: ChatMessage = {
      id: this.generateMessageId(),
      text: data.message || data.text,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      schemes: data.schemes || []
    };
    
    this.messages.update((messages) => [...messages, botMessage]);
    
    // Speak the response if voice is enabled
    if (data.enableVoice) {
      this.speakText(data.message || data.text);
    }
  }

  private async processMessageLocally(
    text: string
  ): Promise<void> {
    const lowerText = text.toLowerCase();
    const schemes = this.schemeService.getAllSchemes()();

    // Extract user profile information
    this.extractUserProfile(text);

    // Intent recognition
    if (
      this.containsKeywords(lowerText, [
        'farmer',
        'agriculture',
        'farming',
        'crop',
        'land',
      ])
    ) {
      const agricultureSchemes = schemes.filter(
        (s) => s.category.id === 'agriculture'
      );
      this.addBotMessage(
        `I found ${agricultureSchemes.length} agriculture schemes for you. Here are the most relevant ones:`,
        agricultureSchemes
      );
      return;
    }

    if (
      this.containsKeywords(lowerText, [
        'student',
        'education',
        'scholarship',
        'study',
        'school',
        'college',
      ])
    ) {
      const educationSchemes = schemes.filter(
        (s) => s.category.id === 'education'
      );
      this.addBotMessage(
        `I found ${educationSchemes.length} education schemes and scholarships for you:`,
        educationSchemes
      );
      return;
    }

    if (
      this.containsKeywords(lowerText, [
        'health',
        'medical',
        'hospital',
        'treatment',
        'insurance',
      ])
    ) {
      const healthSchemes = schemes.filter((s) => s.category.id === 'health');
      this.addBotMessage(
        `Here are ${healthSchemes.length} health schemes that might help you:`,
        healthSchemes
      );
      return;
    }

    if (
      this.containsKeywords(lowerText, [
        'job',
        'employment',
        'work',
        'skill',
        'training',
      ])
    ) {
      const employmentSchemes = schemes.filter(
        (s) => s.category.id === 'employment'
      );
      this.addBotMessage(
        `I found ${employmentSchemes.length} employment and skill development schemes:`,
        employmentSchemes
      );
      return;
    }

    if (
      this.containsKeywords(lowerText, [
        'woman',
        'women',
        'girl',
        'child',
        'mother',
      ])
    ) {
      const womenChildSchemes = schemes.filter(
        (s) => s.category.id === 'women-child'
      );
      this.addBotMessage(
        `Here are ${womenChildSchemes.length} schemes for women and children:`,
        womenChildSchemes
      );
      return;
    }

    // Check for eligibility-based queries
    if (
      this.containsKeywords(lowerText, [
        'eligible',
        'qualify',
        'can i apply',
        'am i eligible',
      ])
    ) {
      const recommendations = this.getPersonalizedRecommendations();
      this.addBotMessage(
        `Based on the information you've shared, here are some schemes you might be eligible for:`,
        recommendations.map((r) => r.scheme)
      );
      return;
    }

    // Default response
    this.addBotMessage(
      'I can help you find government schemes based on your needs. You can ask me about:\n\n• Agriculture and farming schemes\n• Education scholarships\n• Health insurance programs\n• Employment and skill development\n• Women and child welfare schemes\n\nWhat type of scheme are you looking for?'
    );
  }

  private addBotMessage(text: string, schemes?: Scheme[]): void {
    const botMessage: ChatMessage = {
      id: this.generateMessageId(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      schemes,
    };
    
    this.messages.update((messages) => [...messages, botMessage]);
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }

  private extractUserProfile(text: string): void {
    const lowerText = text.toLowerCase();
    const currentProfile = this.userProfile();
    const updates: Partial<UserProfile> = {};

    // Extract age
    const ageMatch = text.match(
      /(\d+)\s*years?\s*old|age\s*(\d+)|i\s*am\s*(\d+)/i
    );
    if (ageMatch) {
      updates.age = parseInt(ageMatch[1] || ageMatch[2] || ageMatch[3]);
    }

    // Extract occupation
    if (lowerText.includes('farmer') || lowerText.includes('farming')) {
      updates.occupation = 'farmer';
    } else if (lowerText.includes('student')) {
      updates.occupation = 'student';
    } else if (lowerText.includes('unemployed')) {
      updates.occupation = 'unemployed';
    }

    // Extract gender
    if (lowerText.includes('woman') || lowerText.includes('female')) {
      updates.gender = 'female';
    } else if (lowerText.includes('man') || lowerText.includes('male')) {
      updates.gender = 'male';
    }

    // Extract state
    const states = this.schemeService.getStates();
    const mentionedState = states.find((state) =>
      lowerText.includes(state.toLowerCase())
    );
    if (mentionedState) {
      updates.state = mentionedState;
    }

    // Update profile if we found new information
    if (Object.keys(updates).length > 0) {
      this.userProfile.update((profile) => ({ ...profile, ...updates }));
    }
  }

  private getPersonalizedRecommendations(): SchemeRecommendation[] {
    const profile = this.userProfile();
    const schemes = this.schemeService.getAllSchemes()();
    const recommendations: SchemeRecommendation[] = [];

    schemes.forEach((scheme) => {
      const eligibility = this.checkEligibility(scheme, profile);
      if (eligibility.eligible || eligibility.score > 0.3) {
        recommendations.push({
          scheme,
          eligibilityScore: eligibility.score,
          matchingCriteria: eligibility.reasons,
          benefits: scheme.benefits,
        });
      }
    });

    return recommendations
      .sort((a, b) => b.eligibilityScore - a.eligibilityScore)
      .slice(0, 5);
  }

  private checkEligibility(
    scheme: Scheme,
    profile: UserProfile
  ): EligibilityCheck {
    let score = 0;
    const reasons: string[] = [];
    const maxScore = 10;

    // Check occupation match
    if (profile.occupation) {
      if (
        scheme.category.id === 'agriculture' &&
        profile.occupation === 'farmer'
      ) {
        score += 3;
        reasons.push('You are a farmer and this is an agriculture scheme');
      }
      if (
        scheme.category.id === 'education' &&
        profile.occupation === 'student'
      ) {
        score += 3;
        reasons.push('You are a student and this is an education scheme');
      }
      if (
        scheme.category.id === 'employment' &&
        profile.occupation === 'unemployed'
      ) {
        score += 3;
        reasons.push(
          'You are unemployed and this scheme provides employment opportunities'
        );
      }
    }

    // Check gender match
    if (profile.gender === 'female' && scheme.category.id === 'women-child') {
      score += 2;
      reasons.push('This scheme is specifically for women');
    }

    // Check age-based eligibility
    if (profile.age) {
      if (
        profile.age >= 18 &&
        profile.age <= 35 &&
        scheme.id === 'skill-india'
      ) {
        score += 2;
        reasons.push('Your age matches the scheme requirements');
      }
    }

    // General eligibility boost
    if (reasons.length === 0) {
      score += 1;
      reasons.push('This scheme has general eligibility criteria');
    }

    return {
      schemeId: scheme.id,
      eligible: score >= 3,
      score: score / maxScore,
      reasons,
    };
  }

  startVoiceRecognition(): void {
    // Use browser speech recognition
    if (this.recognition && !this.isListening()) {
      this.isListening.set(true);
      this.updateSpeechLanguage();
      this.recognition.start();
    }
  }

  stopVoiceRecognition(): void {
    // Stop browser speech recognition
    if (this.recognition && this.isListening()) {
      this.recognition.stop();
    }
    
    this.isListening.set(false);
  }

  speakText(text: string): void {
    if (typeof responsiveVoice === 'undefined') {
      console.error('ResponsiveVoice.js is not loaded');
      return;
    }
  
    // Detect current language
    const detectedLang = this.detectGoogleLang().split('-')[0]; // e.g., 'hi'
    this.currentLanguage = detectedLang;
  
    // Map to ResponsiveVoice voices
    const voiceMap: { [key: string]: string } = {
      'en': 'UK English Female',
      'hi': 'Hindi Female',
      'mr': 'Marathi Female',
      'gu': 'Gujarati Female',
      'bn': 'Bangla Female',
    };
  
    const voiceName = voiceMap[this.currentLanguage] || 'UK English Female';
  
    responsiveVoice.speak(text, voiceName, {
      rate: 1,
      pitch: 1,
      volume: 1,
      onstart: () => console.log(`Speaking started in ${voiceName}...`),
      onend: () => console.log('Speaking ended.'),
      onerror: (e: any) => console.error('Error in ResponsiveVoice:', e),
    });
  }
  
  

  clearChat(): void {
    this.messages.set([]);
    this.userProfile.set({});
    this.addWelcomeMessage();
  }

  // Method to update language from external sources
  updateLanguage(language: string): void {
    this.currentLanguage = language;
    this.updateSpeechLanguage();
  }

  generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Method to set API token when available
  setAPIToken(token: string): void {
    this.API_TOKEN = token;
  }
}
