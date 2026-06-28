import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge function base URL
export const EDGE_FUNCTION_URL = `${supabaseUrl}/functions/v1/eduvoice-ai`;

export async function fetchFromEdge(endpoint: string, options?: RequestInit) {
  const url = `${EDGE_FUNCTION_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed (${response.status})`);
  }
  return response.json();
}
