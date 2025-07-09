"use client";

import HybridCalendar from "./components/HybridCalendar";
import Auth from "./components/Auth";
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

// Replace 'any' with a proper user type
interface User {
  id: string;
  email: string;
}

// Helper to map Supabase user to local User type
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

  if (loading) return <div style={{textAlign:'center',marginTop:80}}>Loading...</div>;
  if (!user) return <Auth onAuth={() => supabase.auth.getUser().then(({ data }) => { setUser(mapSupabaseUser(data?.user)); setLoading(false); })} />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <HybridCalendar user={user} />
    </div>
  );
}
