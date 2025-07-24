import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-main">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <div class="footer-logo">
                <span class="logo-icon">🏛️</span>
                <div class="logo-text">
                  <span class="logo-title">MyScheme</span>
                  <span class="logo-subtitle">financial of India</span>
                </div>
              </div>
              <p class="footer-description">
                Empowering citizens with easy access to financial schemes, 
                subsidies, and benefits across India.
              </p>
            </div>
            
            <div class="footer-section">
              <h4 class="footer-heading">Quick Links</h4>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">All Schemes</a></li>
                <li><a href="#" class="footer-link">Categories</a></li>
                <li><a href="#" class="footer-link">Check Eligibility</a></li>
                <li><a href="#" class="footer-link">Application Status</a></li>
                <li><a href="#" class="footer-link">FAQ</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4 class="footer-heading">Popular Categories</h4>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">Education Schemes</a></li>
                <li><a href="#" class="footer-link">Health Benefits</a></li>
                <li><a href="#" class="footer-link">Agriculture Support</a></li>
                <li><a href="#" class="footer-link">Employment Programs</a></li>
                <li><a href="#" class="footer-link">Social Security</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4 class="footer-heading">Support</h4>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">Help Center</a></li>
                <li><a href="#" class="footer-link">Contact Us</a></li>
                <li><a href="#" class="footer-link">Feedback</a></li>
                <li><a href="#" class="footer-link">Report Issue</a></li>
                <li><a href="#" class="footer-link">Digital India</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4 class="footer-heading">Connect</h4>
              <div class="social-links">
                <a href="#" class="social-link" title="Twitter">🐦</a>
                <a href="#" class="social-link" title="Facebook">📘</a>
                <a href="#" class="social-link" title="YouTube">📺</a>
                <a href="#" class="social-link" title="Instagram">📸</a>
              </div>
              <div class="helpline">
                <strong>Helpline:</strong><br>
                <a href="tel:1800-111-950" class="helpline-number">1800-111-950</a>
                <span class="helpline-time">(24x7 Toll Free)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-content">
            <div class="footer-legal">
              <a href="#" class="legal-link">Privacy Policy</a>
              <a href="#" class="legal-link">Terms of Service</a>
              <a href="#" class="legal-link">Accessibility</a>
              <a href="#" class="legal-link">RTI</a>
            </div>
            <div class="footer-copyright">
              <p>© {{ currentYear }} financial of India. All rights reserved.</p>
              <p class="website-policy">
                This is a citizen-centric portal for financial schemes information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--neutral-900);
      color: var(--neutral-300);
      margin-top: auto;
    }

    .footer-main {
      padding: var(--space-16) 0 var(--space-12);
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: var(--space-8);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .logo-icon {
      font-size: var(--font-size-2xl);
      color: var(--primary-400);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: white;
      line-height: 1;
    }

    .logo-subtitle {
      font-size: var(--font-size-xs);
      color: var(--neutral-400);
      font-weight: 400;
    }

    .footer-description {
      color: var(--neutral-400);
      line-height: var(--line-height-relaxed);
      font-size: var(--font-size-sm);
    }

    .footer-heading {
      color: white;
      font-size: var(--font-size-base);
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    .footer-links {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .footer-link {
      color: var(--neutral-400);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: color 0.2s ease;
      padding: var(--space-1) 0;
    }

    .footer-link:hover {
      color: var(--primary-400);
    }

    .social-links {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--neutral-800);
      border-radius: var(--radius-lg);
      text-decoration: none;
      font-size: var(--font-size-lg);
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background: var(--primary-600);
      transform: translateY(-2px);
    }

    .helpline {
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
    }

    .helpline-number {
      color: var(--primary-400);
      text-decoration: none;
      font-weight: 600;
      font-size: var(--font-size-lg);
    }

    .helpline-time {
      display: block;
      color: var(--neutral-400);
      font-size: var(--font-size-xs);
      margin-top: var(--space-1);
    }

    .footer-bottom {
      background: var(--neutral-800);
      padding: var(--space-6) 0;
      border-top: 1px solid var(--neutral-700);
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-6);
    }

    .footer-legal {
      display: flex;
      gap: var(--space-6);
    }

    .legal-link {
      color: var(--neutral-400);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: color 0.2s ease;
    }

    .legal-link:hover {
      color: var(--primary-400);
    }

    .footer-copyright {
      text-align: right;
    }

    .footer-copyright p {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--neutral-400);
    }

    .website-policy {
      font-size: var(--font-size-xs) !important;
      margin-top: var(--space-1) !important;
    }

    @media (max-width: 1024px) {
      .footer-content {
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--space-6);
      }

      .footer-section:first-child {
        grid-column: span 3;
        margin-bottom: var(--space-4);
      }
    }

    @media (max-width: 768px) {
      .footer-main {
        padding: var(--space-12) 0 var(--space-8);
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }

      .footer-section:first-child {
        grid-column: span 1;
        margin-bottom: 0;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
        gap: var(--space-4);
      }

      .footer-legal {
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-4);
      }

      .footer-copyright {
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}