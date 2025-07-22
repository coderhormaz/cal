// ...existing code...
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Moon, Sun, ArrowRight } from 'lucide-react';
import HybridCalendar from "./components/HybridCalendar";
import MobileCalendar from "./components/MobileCalendar";
import Auth from "./components/Auth";
import Subscription from "./subscription/subscription";
import './mobile-calendar.css';

interface User {
  id: string;
  email: string;
}

function mapSupabaseUser(supabaseUser: { id: string; email?: string } | null): User | null {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
  };
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showApp, setShowApp] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(mapSupabaseUser(data?.user));
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-variant)'
      }}>
        <div className="d-flex align-items-center gap-3">
          <div className="loading-spinner"></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (showApp) {
    if (!user) {
      return <Auth onAuth={() => supabase.auth.getUser().then(({ data }) => { setUser(mapSupabaseUser(data?.user)); setLoading(false); })} />;
    }
    return isMobile ? <MobileCalendar user={user} /> : <HybridCalendar user={user} />;
  }

  // Landing page content
  return (
    <div className="landing-page" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Image src="/logo.png" alt="Calendar Parsi Logo" width={40} height={40} />
              <h1>Calendar Parsi</h1>
            </div>
            <div className="header-actions">
             
              <button 
                className="theme-toggle" 
                onClick={toggleDarkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowApp(true)}
              >
                {user ? 'Open App' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Your Premium Parsi Calendar Solution</h1>
              <p>Track important dates, events, and celebrations with our professional calendar application designed specifically for the Parsi community.</p>
              <div className="hero-actions">
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => setShowApp(true)}
                >
                  Get Started <ArrowRight size={16} />
                </button>
                <a href="#features" className="btn btn-outline btn-lg">Explore Features</a>
              
              </div>
            </div>
            <div className="hero-image">
              <div className="calendar-preview">
                <Image 
                  src="/window.svg" 
                  alt="Calendar Preview" 
                  width={500} 
                  height={300} 
                  className="preview-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id='features'>  <Subscription />
      </div>

      {/* How to Use Section */}
      <section className="how-to-use-section">
        <div className="container">
          <div className="section-header">
            <h2>How to Use</h2>
            <p>Get started with Calendar Parsi in just a few simple steps</p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up with your email address to create your personal calendar account.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Add Your Events</h3>
              <p>Click on any date to add personal events, birthdays, anniversaries, and more.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Set Reminders</h3>
              <p>Never miss an important date by setting custom reminders for your events.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Export & Backup</h3>
              <p>Save your important dates and events with our easy export feature for safekeeping and sharing.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
             {/* Company Info */}
             <div className="footer-column">
               <div className="footer-logo">
                 <Image src="/logo.png" alt="Calendar Parsi Logo" width={40} height={40} />
                 <span>Calendar Parsi</span>
               </div>
               <p className="footer-tagline">Your premium Parsi calendar solution for tracking important dates and events.</p>
             </div>
             
             {/* Quick Links */}
             <div className="footer-column">
               <h3 className="footer-heading">Quick Links</h3>
               <ul className="footer-menu">
                 <li><a href="#features">Features</a></li>
                 <li><a href="#" onClick={() => setShowApp(true)}>{user ? 'Open App' : 'Sign In'}</a></li>
                 <li><a href="#" onClick={(e) => { e.preventDefault(); toggleDarkMode(); }}>
                   {darkMode ? 'Light Mode' : 'Dark Mode'}
                 </a></li>
               </ul>
             </div>
             
             {/* Support */}
             <div className="footer-column">
               <h3 className="footer-heading">Support</h3>
               <ul className="footer-menu">
                 <li><Link href="/contactus">Contact Us</Link></li>
                 <li><Link href="/Feedback">Feedback</Link></li>
                 <li><Link href="/subscription">Subscription</Link></li>
               </ul>
             </div>
           </div>
          
          <div className="footer-divider"></div>
          
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
        .landing-page {
          font-family: 'Google Sans', 'Roboto', sans-serif;
          color: var(--text-primary);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        /* Header Styles */
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
        
        /* Hero Section */
        .hero-section {
          padding: 80px 0;
          background: var(--surface-variant);
        }
        
        .hero-content {
          display: flex;
          align-items: center;
          gap: 48px;
        }
        
        .hero-text {
          flex: 1;
        }
        
        .hero-text h1 {
          font-size: 48px;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 24px;
          background: linear-gradient(90deg, var(--primary-blue), #34c759);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-text p {
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        
        .calendar-preview {
          position: relative;
          max-width: 100%;
          box-shadow: var(--shadow-medium);
          border-radius: var(--border-radius-large);
          overflow: hidden;
        }
        
        .preview-image {
          width: 100%;
          height: auto;
          display: block;
        }
        
        /* Features Section */
        .features-section {
          padding: 80px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .section-header h2 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .section-header p {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }
        
        .feature-card {
          background: var(--surface);
          border-radius: var(--border-radius-large);
          padding: 32px 24px;
          box-shadow: var(--shadow-light);
          transition: var(--transition);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-medium);
        }
        
        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: var(--secondary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--primary-blue);
        }
        
        .feature-card h3 {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        /* How to Use Section */
        .how-to-use-section {
          padding: 80px 0;
          background: var(--surface-variant);
        }
        
        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
          margin-top: 48px;
        }
        
        .step-card {
          background: var(--surface);
          border-radius: var(--border-radius-large);
          padding: 32px 24px;
          box-shadow: var(--shadow-light);
          position: relative;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 24px;
        }
        
        .step-card h3 {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .step-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        /* CTA Section */
        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--primary-blue), #34c759);
          color: white;
        }
        
        .cta-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .cta-content h2 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .cta-content p {
          font-size: 18px;
          margin-bottom: 32px;
          opacity: 0.9;
        }
        
        /* Footer */
        .landing-footer {
          padding: 64px 0 32px;
          background: var(--surface);
          border-top: 1px solid var(--border-color);
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
          margin-bottom: 48px;
        }
        
        .footer-column {
          display: flex;
          flex-direction: column;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 16px;
        }
        
        .footer-tagline {
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.5;
        }
        

        
        .footer-heading {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--text-primary);
        }
        
        .footer-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-menu li {
          margin-bottom: 12px;
        }
        
        .footer-menu a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition);
          font-size: 14px;
          display: inline-block;
        }
        
        .footer-menu a:hover {
          color: var(--primary-blue);
          transform: translateX(2px);
        }
        

        
        .footer-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0 0 24px;
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
        
        /* Responsive */
        @media (max-width: 992px) {
          .hero-content {
            flex-direction: column;
          }
          
          .hero-text h1 {
            font-size: 36px;
          }
        }
        
        @media (max-width: 768px) {
          .features-grid,
          .steps-container {
            grid-template-columns: 1fr;
          }
          
          .hero-text h1 {
            font-size: 32px;
          }
          
          .section-header h2 {
            font-size: 28px;
          }
          
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          

        }
        
        /* Button Styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--border-radius);
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          text-decoration: none;
          cursor: pointer;
          transition: var(--transition);
          border: 1px solid transparent;
        }
        
        .btn-lg {
          padding: 12px 24px;
          font-size: 16px;
        }
        
        .btn-primary {
          background: var(--primary-blue);
          color: white;
        }
        
        .btn-primary:hover {
          background: var(--primary-blue-hover);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        
        .btn-outline:hover {
          background: var(--surface-variant);
        }
      `}</style>
    </div>
  );
}