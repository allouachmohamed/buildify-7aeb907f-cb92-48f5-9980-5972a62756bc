
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yprljlqqoholvrogcdfj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwcmxqbHFxb2hvbHZyb2djZGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjIxMTgsImV4cCI6MjA5MDUzODExOH0.WCuHthcDhGdfLmXeo8P2MjnA3SJk4mdqoU9Gnv_5Efs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);