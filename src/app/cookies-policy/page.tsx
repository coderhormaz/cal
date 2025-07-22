"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function CookiesPolicy() {
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
            <br /><p style={{ textAlign: "center"}}>
              Cookies set by the website owner (in this case, Calendar Parsi) are called &quot;first-party cookies&quot;. Cookies set by parties other than the website owner are called &quot;third-party cookies&quot;. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
            </p>
      {/* Content */}
      <main className="legal-content">
        <div className="container">
          <h1>Cookies Policy</h1>
            <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website and application to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our website. Third parties may serve cookies through our website for advertising, analytics, and other purposes.</p>
          
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>This Cookies Policy explains how Calendar Parsi (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies to recognize you when you visit our website and application. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
          </section>

          <section className="policy-section">
            <h2>2. What Are Cookies?</h2>
            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
            <p>Cookies set by the website owner (in this case, Calendar Parsi) are called &quot;first-party cookies&quot;. Cookies set by parties other than the website owner are called &quot;third-party cookies&quot;. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).</p>
          </section>

          <section className="policy-section">
            <h2>3. Why Do We Use Cookies?</h2>
            <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website and application to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our website. Third parties may serve cookies through our website for advertising, analytics, and other purposes.</p>
            <p>The specific types of first and third-party cookies served through our website and the purposes they perform are described below:</p>
            
            <h3>Essential Cookies</h3>
            <p>You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser&apos;s help menu for more information.</p>
            
            <h3>Performance and Functionality Cookies</h3>
            <p>These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</p>
            
            <h3>Analytics and Customization Cookies</h3>
            <p>These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</p>
            
            <h3>Advertising Cookies</h3>
            <p>These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.</p>
          </section>

          <section className="policy-section">
            <h2>4. How Can You Control Cookies?</h2>
            <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by following the instructions provided in our cookie banner when you first visit our website.</p>
            <p>You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser help menu for more information.</p>
          </section>

          <section className="policy-section">
            <h2>5. Cookies We Use</h2>
            <p>The following table provides more information about the cookies we use and why:</p>
            
            <div className="cookies-table">
              <div className="cookies-table-row header">
                <div className="cookies-table-cell">Name</div>
                <div className="cookies-table-cell">Purpose</div>
                <div className="cookies-table-cell">Duration</div>
                <div className="cookies-table-cell">Type</div>
              </div>
              
              <div className="cookies-table-row">
                <div className="cookies-table-cell">auth_token</div>
                <div className="cookies-table-cell">Used to maintain user login sessions</div>
                <div className="cookies-table-cell">30 days</div>
                <div className="cookies-table-cell">Essential</div>
              </div>
              
              <div className="cookies-table-row">
                <div className="cookies-table-cell">theme_preference</div>
                <div className="cookies-table-cell">Stores user&#39;s dark/light mode preference</div>
                <div className="cookies-table-cell">1 year</div>
                <div className="cookies-table-cell">Functionality</div>
              </div>
              
              <div className="cookies-table-row">
                <div className="cookies-table-cell">_ga</div>
                <div className="cookies-table-cell">Used to distinguish users for Google Analytics</div>
                <div className="cookies-table-cell">2 years</div>
                <div className="cookies-table-cell">Analytics</div>
              </div>
              
              <div className="cookies-table-row">
                <div className="cookies-table-cell">_gid</div>
                <div className="cookies-table-cell">Used to distinguish users for Google Analytics</div>
                <div className="cookies-table-cell">24 hours</div>
                <div className="cookies-table-cell">Analytics</div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Updates to This Cookies Policy</h2>
            <p>We may update this Cookies Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookies Policy regularly to stay informed about our use of cookies and related technologies.</p>
            <p>The date at the top of this Cookies Policy indicates when it was last updated.</p>
          </section>

          <section className="policy-section">
            <h2>7. Contact Us</h2>
            <p>If you have any questions about our use of cookies or other technologies, please contact us:</p>
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
        
        .policy-section h3 {
          font-size: 20px;
          font-weight: 500;
          margin: 24px 0 12px;
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
        
        .policy-section a {
          color: var(--primary-blue);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .policy-section a:hover {
          text-decoration: underline;
        }
        
        .cookies-table {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          margin: 24px 0;
        }
        
        .cookies-table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr;
          border-bottom: 1px solid var(--border-color);
        }
        
        .cookies-table-row:last-child {
          border-bottom: none;
        }
        
        .cookies-table-row.header {
          background: var(--surface);
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .cookies-table-cell {
          padding: 12px 16px;
          border-right: 1px solid var(--border-color);
          line-height: 1.4;
        }
        
        .cookies-table-cell:last-child {
          border-right: none;
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
          
          .policy-section h3 {
            font-size: 18px;
          }
          
          .cookies-table-row {
            grid-template-columns: 1fr;
          }
          
          .cookies-table-cell {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
          
          .cookies-table-row:last-child .cookies-table-cell:last-child {
            border-bottom: none;
          }
          
          .cookies-table-row.header {
            display: none;
          }
          
          .cookies-table-cell:before {
            content: attr(data-label);
            font-weight: 500;
            display: block;
            margin-bottom: 4px;
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