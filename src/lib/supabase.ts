/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Using provided credentials as fallback for preview environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cenjcriyxbwhmbwcwter.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbmpjcml5eGJ3aG1id2N3dGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MTg4NjUsImV4cCI6MjA4NzQ5NDg2NX0.Kta0gKtIDKbhFujENWxvACO8QjRZ-LSikzDDJLlMVY8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
