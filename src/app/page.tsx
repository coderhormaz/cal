"use client";

import HybridCalendar from "./components/HybridCalendar";
import Auth from "./components/Auth";
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

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

  if (!user) {
    return <Auth onAuth={() => supabase.auth.getUser().then(({ data }) => { setUser(mapSupabaseUser(data?.user)); setLoading(false); })} />;
  }

  return <HybridCalendar user={user} />;
}