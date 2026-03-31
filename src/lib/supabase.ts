import { createClient } from '@supabase/supabase-js';

// Supabase configuration - these values are safe for client-side use
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yprljlqqoholvrogcdfj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
};
