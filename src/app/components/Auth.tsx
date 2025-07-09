'use client';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Auth({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    setLoading(false);
    if (result.error) setError(result.error.message);
    else onAuth();
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center" style={{ background: 'var(--surface-variant)' }}>
      <div className="fade-in" style={{ 
        maxWidth: '400px', 
        width: '100%',
        margin: '0 16px'
      }}>
        <div className="card">
          <div className="card-body" style={{ padding: '32px' }}>
            {/* Logo/Header */}
            <div className="text-center mb-4">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: 'var(--primary-blue)', 
                borderRadius: '12px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                📅
              </div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                margin: '0 0 8px 0'
              }}>
                {isLogin ? 'Sign in to Calendar' : 'Create your account'}
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '14px',
                margin: 0
              }}>
                {isLogin ? 'Welcome back! Please sign in to continue.' : 'Get started with your personal calendar.'}
              </p>
            </div>

            <form onSubmit={handleAuth}>
              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              {error && (
                <div style={{ 
                  color: 'var(--error)', 
                  fontSize: '14px',
                  padding: '12px 16px',
                  backgroundColor: '#fce8e6',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '16px',
                  border: '1px solid #f28b82'
                }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary"
                style={{ 
                  width: '100%',
                  marginBottom: '16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {loading ? (
                  <span className="d-flex align-items-center gap-2">
                    <span className="loading-spinner"></span>
                    Please wait...
                  </span>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="btn btn-text"
                style={{ fontSize: '14px' }}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}