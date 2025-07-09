"use client";

import HybridCalendar from "./components/HybridCalendar";
import Auth from "./components/Auth";
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  if (loading) return <div style={{textAlign:'center',marginTop:80}}>Loading...</div>;
  if (!user) return <Auth onAuth={() => supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))} />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <HybridCalendar user={user} />
    </div>
  );
}
