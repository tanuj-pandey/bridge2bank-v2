import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIAssistantService } from '../../services/ai-assistant.service';
import { FormWizardService } from '../../services/form-wizard.service';
import { SchemeService } from '../../services/scheme.service';
import { SchemeCardComponent } from '../scheme-card/scheme-card.component';
import { FormData, FormField } from '../../types/form-wizard.interface';

@Component({
  selector: 'app-webchat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="webchat-container" [class.expanded]="isExpanded">
      <!-- Chat Toggle Button -->
      <button 
        class="chat-toggle-btn"
        (click)="toggleChat()"
        [class.has-notification]="hasNewMessage && !isExpanded"
        type="button"
      >
        <span class="chat-icon" *ngIf="!isExpanded">💬</span>
        <span class="close-icon" *ngIf="isExpanded">×</span>
        <span class="notification-dot" *ngIf="hasNewMessage && !isExpanded"></span>
      </button>

      <!-- Chat Interface -->
      <div class="chat-interface" *ngIf="isExpanded">
        <div class="chat-header">
          <div class="assistant-info">
            <span class="assistant-avatar">🤖</span>
            <div class="assistant-details">
              <span class="assistant-name">Financial Products Assistant</span>
              <span class="assistant-status online">Online</span>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" (click)="clearChat()" title="Clear Chat" type="button">
              🗑️
            </button>
            <button class="action-btn" (click)="toggleChat()" title="Close" type="button">
              ×
            </button>
          </div>
        </div>
        <div id="google_translate_element"></div>
        <!-- Chat Content -->
        <div class="chat-content" #chatContent>
          <!-- Welcome Message -->
          <div class="welcome-section" *ngIf="!hasStartedConversation">
            <div class="welcome-message">
              <h3>Welcome!<br />I'm here to assist you to explain the financial products as per your requirement</h3>
              <p>I can help you in two ways:</p>
              <div class="welcome-options">
                <button class="option-btn" (click)="startSchemeFinder()" type="button">
                  <span class="option-icon">🎯</span>
                  <div class="option-content">
                    <span class="option-title">Let's find a financial product for you</span>
                    <span class="option-desc">Answer questions to get the information about specific financial products you are looking for</span>
                  </div>
                </button>
                <button class="option-btn" (click)="startFreeChat()" type="button">
                  <span class="option-icon">💬</span>
                  <div class="option-content">
                    <span class="option-title">Ask Questions</span>
                    <span class="option-desc">Chat with me about any financial products</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Scheme Finder Form -->
          <div class="scheme-finder-section" *ngIf="showSchemeFinder && !showResults">
            <div class="finder-header">
              <h4>Let's find the product details</h4>
              <button class="back-btn" (click)="backToWelcome()" type="button">← Back</button>
            </div>

            <!-- Progress Bar -->
            <div class="progress-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  [style.width.%]="wizardService.getProgressPercentage()"
                ></div>
              </div>
              <span class="progress-text">
                Step {{ wizardService.getCurrentStep()() + 1 }} of {{ wizardService.getTotalSteps() }}
              </span>
            </div>

            <!-- Current Step -->
            <div class="step-content">
              <h5 class="step-title">{{ currentStepData.title }}</h5>
              
              <div class="step-form">
                <div 
                  *ngFor="let field of getVisibleFields()" 
                  class="form-group"
                >
                  <label class="field-label">
                    {{ field.label }}
                    <span *ngIf="field.required" class="required">*</span>
                  </label>

                  <!-- Text/Number Input -->
                  <input
                    *ngIf="field.type === 'text' || field.type === 'number'"
                    [type]="field.type"
                    [placeholder]="field.placeholder || ''"
                    [(ngModel)]="stepFormData[field.id]"
                    class="form-input"
                  />

                  <!-- Select Dropdown -->
                  <select
                    *ngIf="field.type === 'select'"
                    [(ngModel)]="stepFormData[field.id]"
                    class="form-select"
                  >
                    <option value="">--Select One--</option>
                    <option 
                      *ngFor="let option of field.options" 
                      [value]="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>

                  <!-- Radio Buttons -->
                  <div *ngIf="field.type === 'radio'" class="radio-group">
                    <label 
                      *ngFor="let option of field.options" 
                      class="radio-option"
                      [class.selected]="stepFormData[field.id] === option.value"
                    >
                      <input
                        type="radio"
                        [name]="field.id"
                        [value]="option.value"
                        [(ngModel)]="stepFormData[field.id]"
                        class="radio-input"
                      />
                      <span class="radio-label">{{ option.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Navigation -->
                <div class="step-navigation">
                  <button 
                    *ngIf="!wizardService.isFirstStep()" 
                    class="nav-btn secondary"
                    (click)="previousStep()"
                    type="button"
                  >
                    ← Previous
                  </button>

                  <button 
                    class="nav-btn nav-btn-outline"
                    (click)="skipToResults()"
                    type="button"
                  >
                    Skip to Results
                  </button>
                  
                  <button 
                    class="nav-btn primary"
                    (click)="nextStep()"
                    [disabled]="!canProceed()"
                    type="button"
                  >
                    <span *ngIf="!wizardService.isLastStep()">Next →</span>
                    <span *ngIf="wizardService.isLastStep()">Find Product</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Scheme Results -->
          <div class="results-section" *ngIf="showResults">
            <div class="results-header">
              <h4>Recommended Products for You</h4>
              <button class="back-btn" (click)="backToForm()" type="button">← Back to Form</button>
            </div>

            <div class="loading-state" *ngIf="wizardService.getIsLoading()()">
              <div class="loading-spinner"></div>
              <p>Finding the best products for you...</p>
            </div>

            <!-- <div class="schemes-results" *ngIf="!wizardService.getIsLoading()()">
              <div 
                *ngFor="let match of schemeMatches().slice(0, 3)" 
                class="scheme-result"
              >
                <div class="match-info">
                  <span class="match-score">{{ match.matchScore }}% Match</span>
                  <span class="eligibility-status" [class]="'status-' + match.eligibilityStatus">
                    {{ getEligibilityText(match.eligibilityStatus) }}
                  </span>
                </div>
                <div class="scheme-card-mini">
                  <h6>{{ match.scheme.title }}</h6>
                  <p>{{ match.scheme.description }}</p>
                  <button class="view-details-btn" (click)="viewSchemeDetails(match.scheme)" type="button">
                    View Details
                  </button>
                </div>
              </div>

              <div *ngIf="schemeMatches().length === 0" class="no-results">
                <p>No schemes found matching your criteria.</p>
              </div>

              <button 
                *ngIf="schemeMatches().length > 3"
                class="view-all-btn"
                (click)="viewAllResults()"
                type="button"
              >
                View All {{ schemeMatches().length }} Results
              </button>
            </div> -->

            <div 
              *ngFor="let message of schemes(); trackBy: trackByMessage"
              class="message"
            >
              <div class="message-content">
                <div class="message-text" [innerHTML]="message.text"></div>
                <div class="message-schemes" *ngIf="message.schemes && message.schemes.length > 0">
                  <div class="schemes-grid">
                    <div 
                      *ngFor="let scheme of message.schemes.slice(0, 5)"
                      class="mini-scheme-card"
                      (click)="viewSchemeDetails(scheme, 'scheme')"
                    >
                      <h6 [innerHTML]="scheme.title"></h6>
                      <p [innerHTML]="scheme.description"></p>
                    </div>
                  </div>
                </div>
                <!-- <p><button (click)="showVideo()">Watch Video</button></p> -->
                <div class="message-time">
                  {{ message.timestamp | date:'short' }}
                  <span *ngIf="message.type === 'voice'" class="voice-indicator">🎤</span>
                </div>
              </div>
            </div>

            <div class="message bot-message" *ngIf="wizardService.getIsLoading()()">
              <div class="message-avatar">
                <span>🤖</span>
              </div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div class="results-actions">
              <button class="action-btn-secondary" (click)="startOver()" type="button">
                🔄 Start Over
              </button>
              <button class="action-btn-primary" (click)="setMessages(); startFreeChat()" type="button">
                💬 Ask Questions
              </button>
            </div>
          </div>

          <!-- Chat Messages -->
          <div class="chat-messages" *ngIf="showChatMessages" #messagesContainer>
            <div 
              *ngFor="let message of messages(); trackBy: trackByMessage"
              class="message"
              [class.user-message]="message.sender === 'user'"
              [class.bot-message]="message.sender === 'bot'"
              [class.voice-message]="message.type === 'voice'"
            >
              <div class="message-avatar">
                <span *ngIf="message.sender === 'user'">👤</span>
                <span *ngIf="message.sender === 'bot'">🤖</span>
              </div>
              <div class="message-content">
                <div class="message-text" [innerHTML]="message.text"></div>
                <div class="message-schemes" *ngIf="message.schemes && message.schemes.length > 0">
                  <div class="schemes-grid">
                    <div 
                      *ngFor="let scheme of message.schemes.slice(0, 5)"
                      class="mini-scheme-card"
                      (click)="viewSchemeDetails(scheme)"
                    >
                      <h6 [innerHTML]="scheme.title"></h6>
                      <p [innerHTML]="scheme.description"></p>
                    </div>
                  </div>
                </div>
                <!-- <p><button (click)="showVideo()">Watch Video</button></p> -->
                <div class="message-time">
                  {{ message.timestamp | date:'short' }}
                  <span *ngIf="message.type === 'voice'" class="voice-indicator">🎤</span>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div class="message bot-message" *ngIf="isTyping()">
              <div class="message-avatar">
                <span>🤖</span>
              </div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input" *ngIf="showChatInput">
          <div class="input-container">
            <input
              type="text"
              placeholder="Ask about financial schemes..."
              [(ngModel)]="inputMessage"
              (keyup.enter)="sendMessage()"
              class="message-input"
              [disabled]="isTyping()"
            />
            <button 
              class="voice-btn"
              [class.listening]="isListening()"
              (click)="toggleVoiceRecognition()"
              [disabled]="isTyping()"
              title="Voice Input"
              type="button"
            >
              <span *ngIf="!isListening()">🎤</span>
              <span *ngIf="isListening()" class="pulse">🔴</span>
            </button>
            <button 
              class="send-btn"
              (click)="sendMessage()"
              [disabled]="!inputMessage.trim() || isTyping()"
              type="button"
            >
              ➤
            </button>
          </div>
          
          <div class="quick-suggestions" *ngIf="showQuickSuggestions">
            <button 
              *ngFor="let suggestion of quickSuggestions"
              class="suggestion-btn"
              (click)="sendSuggestion(suggestion)"
              type="button"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="isVideo()" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Video</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
          <iframe width="100%" height="400px" src="https://www.youtube.com/embed/V360AygOv7A?si=Nf-aYp6Zkh8a9xXh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>
      </div>
  `,
  styles: [`

  /* Modal */
  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      max-height: 100vh;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #64748b;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .close-btn:hover {
      color: #1e293b;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-body p {
      margin-bottom: 1rem;
    }

    .modal-body h3 {
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 1.5rem 0 0.75rem 0;
    }

    .modal-body ul {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .modal-body li {
      margin-bottom: 0.5rem;
      color: #475569;
    }
    .webchat-container {
      position: fixed;
      bottom: 5px;
      right: 5px;
      z-index: -1;
      font-family: inherit;
    }

    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary-600);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xl);
      position: relative;
    }

    .chat-toggle-btn:hover {
      background: var(--primary-700);
      transform: scale(1.05);
    }

    .chat-toggle-btn.has-notification {
      animation: bounce 2s infinite;
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      background: var(--accent-500);
      border-radius: 50%;
      border: 2px solid white;
    }

    .close-icon {
      font-size: var(--font-size-2xl);
      font-weight: bold;
    }

    .webchat-container.expanded .chat-toggle-btn {
      display: none;
    }

    .chat-interface {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 450px;
      height: 100vh;
      background: white;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--neutral-200);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s ease-out;
    }

    .chat-header {
      background: var(--primary-600);
      color: white;
      padding: var(--space-4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .assistant-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .assistant-avatar {
      font-size: var(--font-size-xl);
    }

    .assistant-details {
      display: flex;
      flex-direction: column;
    }

    .assistant-name {
      font-weight: 600;
      font-size: var(--font-size-sm);
    }

    .assistant-status {
      font-size: var(--font-size-xs);
      opacity: 0.8;
    }

    .assistant-status.online::before {
      content: '●';
      color: var(--success-400);
      margin-right: var(--space-1);
    }

    .chat-actions {
      display: flex;
      gap: var(--space-2);
    }

    .action-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease;
      font-size: var(--font-size-base);
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .chat-content {
      flex: 1;
      overflow-y: auto;
      background: var(--neutral-50);
    }

    .welcome-section {
      padding: var(--space-6);
      text-align: center;
    }

    .welcome-message h3 {
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
      font-size: var(--font-size-lg);
    }

    .welcome-message p {
      color: var(--neutral-600);
      margin-bottom: var(--space-6);
    }

    .welcome-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .option-btn {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: white;
      border: 2px solid var(--neutral-200);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .option-btn:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
    }

    .option-icon {
      font-size: var(--font-size-2xl);
      flex-shrink: 0;
    }

    .option-content {
      display: flex;
      flex-direction: column;
    }

    .option-title {
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-1);
    }

    .option-desc {
      font-size: var(--font-size-sm);
      color: var(--neutral-600);
    }

    .scheme-finder-section,
    .results-section {
      padding: var(--space-4);
    }

    .finder-header,
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--neutral-200);
    }

    .finder-header h4,
    .results-header h4 {
      color: var(--neutral-900);
      margin: 0;
      font-size: var(--font-size-base);
    }

    .back-btn {
      background: none;
      border: none;
      color: var(--primary-600);
      cursor: pointer;
      font-size: var(--font-size-sm);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease;
    }

    .back-btn:hover {
      background: var(--primary-50);
    }

    .progress-container {
      margin-bottom: var(--space-4);
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--neutral-200);
      border-radius: var(--radius-sm);
      overflow: hidden;
      margin-bottom: var(--space-2);
    }

    .progress-fill {
      height: 100%;
      background: var(--success-500);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: var(--font-size-xs);
      color: var(--neutral-600);
    }

    .step-content {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }

    .step-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    .form-group {
      margin-bottom: var(--space-4);
    }

    .field-label {
      display: block;
      font-weight: 500;
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
      font-size: var(--font-size-xs);
    }

    .required {
      color: var(--accent-600);
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      transition: border-color 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .radio-option {
      display: flex;
      align-items: center;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--neutral-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .radio-option:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
    }

    .radio-option.selected {
      border-color: var(--success-500);
      background: var(--success-50);
    }

    .radio-input {
      margin-right: var(--space-2);
    }

    .radio-label {
      font-size: var(--font-size-sm);
      color: var(--neutral-700);
    }

    .step-navigation {
      display: flex;
      justify-content: space-between;
      margin-top: var(--space-4);
      padding-top: var(--space-3);
      border-top: 1px solid var(--neutral-200);
    }

    .nav-btn {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .nav-btn.primary {
      background: var(--success-600);
      color: white;
    }

    .nav-btn.primary:hover:not(:disabled) {
      background: var(--success-700);
    }

    .nav-btn.primary:disabled {
      background: var(--neutral-300);
      cursor: not-allowed;
    }

    .nav-btn.secondary {
      background: var(--neutral-100);
      color: var(--neutral-700);
      border: 1px solid var(--neutral-300);
    }

    .nav-btn.secondary:hover {
      background: var(--neutral-200);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-8);
      text-align: center;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--neutral-200);
      border-top: 3px solid var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-3);
    }

    .schemes-results {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .scheme-result {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-3);
      border: 1px solid var(--neutral-200);
    }

    .match-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .match-score {
      font-weight: 600;
      color: var(--primary-600);
      font-size: var(--font-size-xs);
    }

    .eligibility-status {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: 500;
    }

    .status-eligible {
      background: var(--success-100);
      color: var(--success-800);
    }

    .status-partially_eligible {
      background: var(--accent-100);
      color: var(--accent-800);
    }

    .status-not_eligible {
      background: var(--neutral-200);
      color: var(--neutral-700);
    }

    .scheme-card-mini h6 {
      color: var(--neutral-900);
      margin-bottom: var(--space-1);
      font-size: var(--font-size-sm);
    }

    .scheme-card-mini p {
      color: var(--neutral-600);
      font-size: var(--font-size-xs);
      margin-bottom: var(--space-2);
      line-height: 1.4;
    }

    .view-details-btn {
      background: var(--primary-100);
      color: var(--primary-700);
      border: none;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .view-details-btn:hover {
      background: var(--primary-200);
    }

    .view-all-btn {
      background: var(--primary-600);
      color: white;
      border: none;
      padding: var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin-top: var(--space-2);
    }

    .view-all-btn:hover {
      background: var(--primary-700);
    }

    .no-results {
      text-align: center;
      padding: var(--space-6);
      color: var(--neutral-600);
    }

    .results-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-4);
      padding-top: var(--space-3);
      border-top: 1px solid var(--neutral-200);
    }

    .action-btn-secondary,
    .action-btn-primary {
      flex: 1;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .action-btn-secondary {
      background: var(--neutral-100);
      color: var(--neutral-700);
    }

    .action-btn-secondary:hover {
      background: var(--neutral-200);
    }

    .action-btn-primary {
      background: var(--primary-600);
      color: white;
    }

    .action-btn-primary:hover {
      background: var(--primary-700);
    }

    .chat-messages {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .message {
      display: flex;
      gap: var(--space-2);
      animation: fadeIn 0.3s ease-in-out;
    }

    .user-message {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      flex-shrink: 0;
    }

    .user-message .message-avatar {
      background: var(--primary-100);
    }

    .bot-message .message-avatar {
      background: var(--neutral-200);
    }

    .message-content {
      max-width: 75%;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .user-message .message-content {
      align-items: flex-end;
    }

    .message-text {
      background: white;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      line-height: 1.4;
      box-shadow: var(--shadow-sm);
    }

    .user-message .message-text {
      background: var(--primary-600);
      color: white;
    }

    .message-schemes {
      margin-top: var(--space-2);
    }

    .schemes-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .mini-scheme-card {
      background: white;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      border: 1px solid var(--neutral-200);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mini-scheme-card:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
    }

    .mini-scheme-card h6 {
      font-size: var(--font-size-xs);
      margin-bottom: var(--space-1);
      color: var(--neutral-900);
    }

    .mini-scheme-card p {
      font-size: var(--font-size-xs);
      color: var(--neutral-600);
      margin: 0;
      line-height: 1.3;
    }

    .message-time {
      font-size: var(--font-size-xs);
      color: var(--neutral-500);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .typing-indicator {
      display: flex;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .typing-indicator span {
      width: 4px;
      height: 4px;
      background: var(--neutral-400);
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    .chat-input {
      background: white;
      border-top: 1px solid var(--neutral-200);
      padding: var(--space-3);
      flex-shrink: 0;
    }

    .input-container {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    .message-input {
      flex: 1;
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      transition: border-color 0.2s ease;
    }

    .message-input:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    .voice-btn,
    .send-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      transition: all 0.2s ease;
    }

    .voice-btn {
      background: var(--neutral-100);
      color: var(--neutral-600);
    }

    .voice-btn:hover {
      background: var(--neutral-200);
    }

    .voice-btn.listening {
      background: var(--accent-100);
      color: var(--accent-600);
    }

    .send-btn {
      background: var(--primary-600);
      color: white;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--primary-700);
    }

    .send-btn:disabled {
      background: var(--neutral-300);
      cursor: not-allowed;
    }

    .pulse {
      animation: pulse 1s infinite;
    }

    .quick-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      margin-top: var(--space-2);
    }

    .suggestion-btn {
      background: var(--neutral-100);
      color: var(--neutral-700);
      border: 1px solid var(--neutral-300);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .suggestion-btn:hover {
      background: var(--primary-100);
      color: var(--primary-700);
      border-color: var(--primary-300);
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -8px, 0);
      }
      70% {
        transform: translate3d(0, -4px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
      }
      30% {
        transform: translateY(-6px);
        opacity: 1;
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .webchat-container {
        bottom: var(--space-4);
        right: var(--space-4);
      }

      .chat-interface {
        width: calc(100vw - 2rem);
        height: calc(100vh - 6rem);
        bottom: 0;
        right: 0;
      }

      .message-content {
        max-width: 85%;
      }

      .option-btn {
        padding: var(--space-3);
      }

      .scheme-finder-section,
      .results-section {
        padding: var(--space-3);
      }
    }
  `]
})
export class WebchatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContent') chatContent!: ElementRef;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // UI State
  isExpanded = true; // Open by default
  hasNewMessage = false;
  hasStartedConversation = false;
  showSchemeFinder = false;
  showResults = false;
  showChatMessages = false;
  showChatInput = false;
  showQuickSuggestions = false;
  inputMessage = '';

  // Form State
  stepFormData: FormData = {};
  currentStepData = this.wizardService.getCurrentStepData();
  schemeMatches = this.wizardService.getSchemeMatches();
  schemes = this.wizardService.getSchemes();
  

  // AI Assistant State
  messages = this.aiService.getMessages();
  isListening = this.aiService.getIsListening();
  isTyping = this.aiService.getIsTyping();

  quickSuggestions = [
    "What schemes are available for farmers?",
    "I'm a student looking for scholarships",
    "Health insurance schemes",
    "Employment programs"
  ];

  isVideo = signal<boolean>(false);

  closeModal(): void {
    this.isVideo.set(false);
  }

  showVideo(): void {
    this.isVideo.set(true);
  }

  constructor(
    private aiService: AIAssistantService,
    public wizardService: FormWizardService,
    private schemeService: SchemeService
  ) {}

  ngOnInit(): void {
    // Initialize services
    this.wizardService.resetForm();
    this.updateCurrentStep();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  setMessages(): void {
    const schemes = this.wizardService.getSchemes()();
    this.aiService.setMessages(schemes);
  }

  toggleChat(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.hasNewMessage = false;
    }
  }

  startSchemeFinder(): void {
    this.hasStartedConversation = true;
    this.showSchemeFinder = true;
    this.showChatMessages = false;
    this.showChatInput = false;
    this.showQuickSuggestions = false;
  }

  startFreeChat(): void {
    this.hasStartedConversation = true;
    this.showSchemeFinder = false;
    this.showResults = false;
    this.showChatMessages = true;
    this.showChatInput = true;
    this.showQuickSuggestions = true;

  }

  backToWelcome(): void {
    this.hasStartedConversation = false;
    this.showSchemeFinder = false;
    this.showResults = false;
    this.showChatMessages = false;
    this.showChatInput = false;
    this.showQuickSuggestions = false;
    this.wizardService.resetForm();
    this.updateCurrentStep();
  }

  // Scheme Finder Methods
  updateCurrentStep(): void {
    this.currentStepData = this.wizardService.getCurrentStepData();
    this.stepFormData = {};
  }

  getVisibleFields(): FormField[] {
    const formData = {
      ...this.wizardService.getFormData(),
      ...this.stepFormData,
    };
    return this.currentStepData.fields.filter((field) =>
      this.wizardService.shouldShowField(field, formData)
    );
  }

  canProceed(): boolean {
    const visibleFields = this.getVisibleFields();
    const requiredFields = visibleFields.filter((field) => field.required);

    return requiredFields.every((field) => {
      const value = this.stepFormData[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  }

  nextStep(): void {
    const validation = this.wizardService.validateStep(this.stepFormData);
    if (!validation.isValid) {
      return;
    }

    this.wizardService.updateFormData(this.stepFormData);

    if (this.wizardService.isLastStep()) {
      this.findSchemes();
    } else {
      this.wizardService.nextStep();
      this.updateCurrentStep();
    }
  }

  previousStep(): void {
    this.wizardService.updateFormData(this.stepFormData);
    this.wizardService.previousStep();
    this.updateCurrentStep();
  }

  /*async findSchemes(): Promise<void> {
    this.showResults = true;
    this.showSchemeFinder = false;
    await this.wizardService.findMatchingSchemes();
  }*/

  async findSchemes(text: string = ''): Promise<void> {
    this.showResults = true;
    this.showSchemeFinder = false;
    await this.wizardService.findSchemes(text);
  }

  skipToResults(): void {
    this.wizardService.updateFormData(this.stepFormData);
    this.findSchemes();
  }

  backToForm(): void {
    this.showResults = false;
    this.showSchemeFinder = true;
  }

  startOver(): void {
    this.wizardService.resetForm();
    this.showResults = false;
    this.showSchemeFinder = true;
    this.updateCurrentStep();
  }

  getEligibilityText(status: string): string {
    switch (status) {
      case 'eligible': return '✓ Highly Eligible';
      case 'partially_eligible': return '⚠ Partially Eligible';
      case 'not_eligible': return '✗ Check Eligibility';
      default: return 'Unknown';
    }
  }

  viewSchemeDetails(scheme: any, type: 'scheme' | 'chat' = 'chat'): void {
    // Handle scheme details view
    console.log('View scheme details:', scheme);
    const inputText = scheme.title + ' and ' + scheme.description; 
    if (type === 'scheme') {
      this.findSchemes(inputText);
    }
    else {
      console.log("send sugesstion/message");
      this.sendSuggestion(inputText);
    }

  }

  viewAllResults(): void {
    // Handle view all results
    console.log('View all results');
  }

  // Chat Methods
  async sendMessage(): Promise<void> {
    if (this.inputMessage.trim()) {
      await this.aiService.sendMessage(this.inputMessage.trim());
      this.inputMessage = '';
    }
  }

  sendSuggestion(suggestion: string): void {
    this.inputMessage = suggestion;
    this.sendMessage();
  }

  toggleVoiceRecognition(): void {
    if (this.isListening()) {
      this.aiService.stopVoiceRecognition();
    } else {
      this.aiService.startVoiceRecognition();
    }
  }

  clearChat(): void {
    this.aiService.clearChat();
    this.backToWelcome();
  }

  trackByMessage(index: number, message: any): string {
    return message.id;
  }

  private scrollToBottom(): void {
    if (this.chatContent) {
      const element = this.chatContent.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}