"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function PrivacyPolicy() {
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className="legal-page" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              <Image src="/logo.png" alt="Calendar Parsi Logo" width={40} height={40} />
              <h1>Calendar Parsi</h1>
            </Link>
            <div className="header-actions">
              <button 
                className="theme-toggle" 
                onClick={toggleDarkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link href="/" className="btn btn-primary">Back to Home</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="legal-content">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Calendar Parsi. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our calendar application.</p>
            <p>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.</p>
          </section>

          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our application, including:</p>
            <ul>
              <li><strong>Personal Data:</strong> Email address, name (if provided), and authentication information required for account creation and maintenance.</li>
              <li><strong>Calendar Data:</strong> Events, dates, reminders, and other content you add to your calendar.</li>
              <li><strong>Usage Data:</strong> Information about how you use our application, including features accessed, time spent, and actions taken.</li>
              <li><strong>Device Information:</strong> Information about your device, operating system, browser type, and IP address.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security of your data.</p>
            <p><strong>Important Notice:</strong> While we take all reasonable measures to protect your data, we cannot be held responsible for data loss or corruption due to technical glitches, server issues, or other unforeseen circumstances. We recommend regularly exporting important calendar data as a backup.</p>
          </section>

          <section className="policy-section">
            <h2>5. User Responsibilities</h2>
            <p>As a user of Calendar Parsi, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security and confidentiality of your account credentials</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not attempt to probe, scan, or test the vulnerability of our system or network</li>
            </ul>
            <p><strong>Warning:</strong> Any attempt to attack our website, exploit vulnerabilities, or engage in malicious activities will result in immediate account termination, potential legal action, and a permanent ban from our services.</p>
          </section>

          <section className="policy-section">
            <h2>6. Intellectual Property</h2>
            <p>The Calendar Parsi application, including all content, features, and functionality, is owned by Calendar Parsi and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            <p><strong>Important:</strong> Unauthorized copying, modification, distribution, or any other use of our code, design elements, or other proprietary material will result in strict legal action.</p>
          </section>

          <section className="policy-section">
            <h2>7. Data Retention</h2>
            <p>We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected. You can request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section className="policy-section">
            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure of your data</li>
              <li>The right to restrict processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your data</li>
            </ul>
            <p>To exercise any of these rights, please contact us using the information provided below.</p>
          </section>

          <section className="policy-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.</p>
            <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
          </section>

          <section className="policy-section">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>By visiting our <Link href="/contactus">Contact Us</Link> page</li>
              <li>By sending feedback through our <Link href="/Feedback">Feedback</Link> form</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-bottom">
            <p className="footer-copyright">&copy; {new Date().getFullYear()} Hormaz Innovates All right reserved</p>
            <div className="footer-bottom-links">
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/cookies-policy">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .legal-page {
          font-family: 'Google Sans', 'Roboto', sans-serif;
          color: var(--text-primary);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .landing-header {
          padding: 16px 0;
          position: sticky;
          top: 0;
          background: var(--background);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          z-index: 100;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-primary);
        }
        
        .logo h1 {
          font-size: 20px;
          font-weight: 500;
          margin: 0;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .theme-toggle {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .theme-toggle:hover {
          background: var(--surface-variant);
        }
        
        .legal-content {
          padding: 40px 0 80px;
          min-height: calc(100vh - 200px);
        }
        
        .legal-content h1 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        
        .last-updated {
          color: var(--text-tertiary);
          font-size: 14px;
          margin-bottom: 32px;
        }
        
        .policy-section {
          margin-bottom: 32px;
        }
        
        .policy-section h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .policy-section p {
          margin-bottom: 16px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        
        .policy-section ul {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        
        .policy-section li {
          margin-bottom: 8px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        
        .policy-section strong {
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .landing-footer {
          padding: 24px 0;
          background: var(--surface);
          border-top: 1px solid var(--border-color);
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .footer-copyright {
          color: var(--text-tertiary);
          font-size: 14px;
          margin: 0;
        }
        
        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }
        
        .footer-bottom-links a {
          color: var(--text-tertiary);
          text-decoration: none;
          font-size: 14px;
          transition: var(--transition);
        }
        
        .footer-bottom-links a:hover {
          color: var(--primary-blue);
        }
        
        @media (max-width: 768px) {
          .legal-content h1 {
            font-size: 28px;
          }
          
          .policy-section h2 {
            font-size: 20px;
          }
          
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}