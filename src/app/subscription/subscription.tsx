"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Moon, Sun, Check, Calendar, Search, Palette, Edit3, Smartphone, Star } from 'lucide-react';

export default function Subscription() {
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
    <div className="subscription-page" style={{ background: 'var(--background)' }}>
      {/* Hero Section */}
      <section className="subscription-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Lifetime Premium Access</h1>
            <p className="hero-subtitle">One-time payment. Lifetime benefits. No recurring fees.</p>
            <div className="price-tag">
              <span className="currency">₹</span>
              <span className="amount">500</span>
              <span className="period">Lifetime</span>
            </div>
            <button className="btn btn-lg btn-primary">Subscribe Now</button>
           
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Premium Features Included</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                <Palette size={24} color="white" />
              </div>
              <h3>Dark & Light Theme</h3>
              <p>Switch seamlessly between dark and light modes for comfortable viewing in any environment or time of day.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                <Search size={24} color="white" />
              </div>
              <h3>Event Search</h3>
              <p>Quickly find any event with our powerful search functionality. Filter by date, title, or description.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}>
                <Calendar size={24} color="white" />
              </div>
              <h3>Hybrid Calendar View</h3>
              <p>Seamlessly switch between Parsi and Gregorian calendar systems with our intuitive dual calendar interface.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>
                <Edit3 size={24} color="white" />
              </div>
              <h3>Complete Event Management</h3>
              <p>Create, delete, edit, and modify events with ease. Full control over your schedule with intuitive tools.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>
                <Smartphone size={24} color="white" />
              </div>
              <h3>Multi-Device Sync</h3>
              <p>Access your calendar across all your devices with perfect synchronization. Your data follows you everywhere.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)' }}>
                <Star size={24} color="white" />
              </div>
              <h3>Premium UI Experience</h3>
              <p>Enjoy our intuitive, easy-to-use interface designed for optimal user experience and productivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Lifetime Subscription?</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="check-icon">
                <Check size={20} color="white" />
              </div>
              <div className="benefit-content">
                <h3>One-Time Payment</h3>
                <p>Pay once and enjoy all premium features forever. No monthly or annual fees.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="check-icon">
                <Check size={20} color="white" />
              </div>
              <div className="benefit-content">
                <h3>Future Updates Included</h3>
                <p>Get access to all future improvements and feature updates at no additional cost.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="check-icon">
                <Check size={20} color="white" />
              </div>
              <div className="benefit-content">
                <h3>No Hidden Costs</h3>
                <p>Transparent pricing with no surprise charges or in-app purchases.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>What does "lifetime subscription" mean?</h3>
              <p>A lifetime subscription means you pay once and have access to all premium features for as long as the Calendar Parsi application exists, with no additional charges.</p>
            </div>

            <div className="faq-item">
              <h3>Can I use my subscription on multiple devices?</h3>
              <p>Yes, your subscription is tied to your account, not your device. You can use Calendar Parsi on all your devices with the same account.</p>
            </div>

            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept various payment methods including credit/debit cards, UPI, net banking, and popular digital wallets.</p>
            </div>

            

            <div className="faq-item">
              <h3>Will I get future updates?</h3>
              <p>Absolutely! Your lifetime subscription includes all future updates to existing features and improvements to the application.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .subscription-page {
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
        
        .subscription-hero {
          padding: 80px 0;
          text-align: center;
          background: linear-gradient(135deg, var(--primary-blue-light), var(--primary-blue));
          color: white;
        }
        
        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        .hero-subtitle {
          font-size: 20px;
          margin-bottom: 32px;
          opacity: 0.9;
          color: var(--text-primary);
        }
        
        .hero-subtitle {
          font-size: 20px;
          margin-bottom: 32px;
          opacity: 0.9;
        }
        
        .price-tag {
          display: inline-flex;
          align-items: baseline;
          margin-bottom: 32px;
        }
        
        .price-tag {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
          background: transparent;
          border-radius: 12px;
          padding: 8px 24px;
          color: var(--text-primary);
        }
        .currency, .amount, .period {
          color: var(--text-primary);
        }
        .currency {
          font-size: 32px;
          font-weight: 600;
          margin-right: 4px;
          align-self: flex-end;
        }
        .amount {
          font-size: 72px;
          font-weight: 700;
          line-height: 1;
          margin-right: 4px;
        }
        .period {
          font-size: 20px;
          margin-left: 8px;
          opacity: 0.8;
          align-self: flex-end;
        }
          opacity: 0.8;
        }
        
        .guarantee {
          margin-top: 16px;
          font-size: 14px;
          opacity: 0.8;
        }
        
        .section-title {
          text-align: center;
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 48px;
          color: var(--text-primary);
        }
        
        .features-section {
          padding: 80px 0;
          background: var(--background);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        
        .feature-card {
          background: var(--surface);
          border-radius: 12px;
          padding: 32px 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        
        .feature-card h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        
        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .why-choose-section {
          padding: 80px 0;
          background: var(--surface);
        }
        
        .benefits-list {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .benefit-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .check-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
        }
        
        .benefit-content h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        
        .benefit-content p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .faq-section {
          padding: 80px 0;
          background: var(--background);
        }
        
        .faq-list {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .faq-item {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .faq-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .faq-item h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .faq-item p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark));
          color: white;
          text-align: center;
        }
        
        .cta-content {
          max-width: 700px;
          margin: 0 auto;
        }
        
        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .cta-content p {
          font-size: 18px;
          margin-bottom: 32px;
          opacity: 0.9;
        }
        
        .cta-note {
          margin-top: 16px;
          font-size: 14px;
          opacity: 0.8;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          border: none;
          outline: none;
        }
        
        .btn-lg {
          padding: 18px 40px;
          font-size: 22px;
          font-weight: 700;
          border-radius: 14px;
          letter-spacing: 0.5px;
          box-shadow: 0 6px 24px rgba(79,70,229,0.12);
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }

        .btn-primary {
          background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
          color: #fff;
          border: none;
          box-shadow: 0 2px 8px rgba(79,70,229,0.10);
        }

        .btn-primary:hover {
          background: linear-gradient(90deg, #7C3AED 0%, #4F46E5 100%);
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 32px rgba(79,70,229,0.18);
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
        
        @media (max-width: 992px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .hero-content h1 {
            font-size: 40px;
          }
          
          .amount {
            font-size: 60px;
          }
        }
        
        @media (max-width: 768px) {
          .subscription-hero {
            padding: 60px 0;
          }
          
          .hero-content h1 {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 18px;
          }
          
          .amount {
            font-size: 48px;
          }
          
          .section-title {
            font-size: 28px;
            margin-bottom: 36px;
          }
          
          .cta-content h2 {
            font-size: 28px;
          }
          
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        
        @media (max-width: 576px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .subscription-hero {
            padding: 40px 0;
          }
          
          .hero-content h1 {
            font-size: 28px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .amount {
            font-size: 40px;
          }
          
          .currency {
            font-size: 24px;
          }
          
          .period {
            font-size: 16px;
          }
          
          .btn-lg {
            padding: 12px 24px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}