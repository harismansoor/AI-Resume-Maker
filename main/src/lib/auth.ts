// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js';

export type AuthResult = { ok: true } | { ok: false; error: string };

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await sb().auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { ok: false, error: err.message ?? 'Unknown error' };
    if (typeof err === 'string') return { ok: false, error: err };
    return { ok: false, error: 'Unknown error' };
  }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await sb().auth.signUp({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { ok: false, error: err.message ?? 'Unknown error' };
    if (typeof err === 'string') return { ok: false, error: err };
    return { ok: false, error: 'Unknown error' };
  }
}

export async function signInWithOAuth(provider: 'google' | 'github', redirectTo?: string) {
  return sb().auth.signInWithOAuth({ provider, options: { redirectTo } });
}

export async function signOut() {
  return sb().auth.signOut();
}
