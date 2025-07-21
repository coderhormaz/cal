"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function TermsOfService() {
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
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using Calendar Parsi, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section className="policy-section">
            <h2>2. Description of Service</h2>
            <p>Calendar Parsi is a hybrid calendar application that combines Parsi and Gregorian calendar systems, allowing users to manage events, set reminders, and organize their schedules.</p>
            <p>Our service includes the following features:</p>
            <ul>
              <li><strong>Dark and Light Theme:</strong> Customizable interface with both dark and light modes for comfortable viewing in any environment.</li>
              <li><strong>Event Search:</strong> Powerful search functionality to quickly find specific events and appointments.</li>
              <li><strong>Hybrid Calendar View:</strong> Seamlessly switch between Parsi and Gregorian calendar systems.</li>
              <li><strong>Event Management:</strong> Create, delete, edit, and modify events with ease.</li>
              <li><strong>Premium User Interface:</strong> Intuitive, easy-to-use interface designed for optimal user experience.</li>
              <li><strong>Multi-Device Sync:</strong> Access your calendar across multiple devices with synchronized data.</li>
              <li><strong>Religious Calendar:</strong> Important Parsi religious dates and festivals.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Subscription and Payment</h2>
            <p>Calendar Parsi offers a lifetime subscription model for a one-time payment of 500 rupees. This subscription includes:</p>
            <ul>
              <li>Lifetime access to all current features listed above</li>
              <li>Future updates and improvements to existing features</li>
              <li>Customer support</li>
            </ul>
            <p><strong>Payment Terms:</strong></p>
            <ul>
              <li>All payments are processed securely through our payment processors.</li>
              <li>The lifetime subscription fee is non-refundable unless required by law.</li>
              <li>We reserve the right to change subscription pricing for new customers. However, once you purchase a lifetime subscription, you will not be charged again for the included features.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. User Accounts</h2>
            <p>To use certain features of the Service, you may be required to create an account. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p>We reserve the right to terminate accounts that violate these Terms of Service.</p>
          </section>

          <section className="policy-section">
            <h2>5. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Attempt to probe, scan, or test the vulnerability of our system or network</li>
              <li>Harvest or collect information about other users without their consent</li>
            </ul>
            <p><strong>Warning:</strong> Any attempt to attack our website, exploit vulnerabilities, or engage in malicious activities will result in immediate account termination, potential legal action, and a permanent ban from our services.</p>
          </section>

          <section className="policy-section">
            <h2>6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by Calendar Parsi and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            <p><strong>Prohibited Actions:</strong></p>
            <ul>
              <li>Copying, modifying, or distributing our code, design elements, or other proprietary material</li>
              <li>Reverse engineering or attempting to extract the source code of our software</li>
              <li>Removing any copyright or other proprietary notices from our materials</li>
            </ul>
            <p><strong>Important:</strong> Unauthorized use of our intellectual property will result in strict legal action. This includes stealing our code, copying our design, or replicating our service without permission.</p>
          </section>

          <section className="policy-section">
            <h2>7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Calendar Parsi shall not be liable for:</p>
            <ul>
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Data loss or corruption due to technical glitches, server issues, or other unforeseen circumstances</li>
            </ul>
            <p><strong>Important Notice:</strong> While we take all reasonable measures to protect your data, we cannot be held responsible for data loss or corruption due to technical glitches, server issues, or other unforeseen circumstances. We recommend regularly exporting important calendar data as a backup.</p>
          </section>

          <section className="policy-section">
            <h2>8. Modifications to the Service</h2>
            <p>We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
          </section>

          <section className="policy-section">
            <h2>9. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws applicable in India, without regard to its conflict of law provisions.</p>
            <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
          </section>

          <section className="policy-section">
            <h2>10. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page and updating the "Last Updated" date.</p>
            <p>Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
          </section>

          <section className="policy-section">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
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
            <p className="footer-copyright">&copy; {new Date().getFullYear()} Calendar Parsi. All rights reserved.</p>
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