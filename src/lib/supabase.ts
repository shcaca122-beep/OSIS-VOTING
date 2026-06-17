import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Buat client hanya jika kedua key ini tersedia (mencegah crash saat build)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);