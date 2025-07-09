import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqpfhenbocfvltsztqjn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcGZoZW5ib2Nmdmx0c3p0cWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzEyMjMsImV4cCI6MjA2NzYwNzIyM30.Tp03GncHWh9Pxyg1qpTRbAxV8LH4aPMz0f4t1r8zKhs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
