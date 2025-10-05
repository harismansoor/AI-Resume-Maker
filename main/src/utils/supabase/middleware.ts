// src/utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Supabase client for Next.js Middleware.
 * Binds to the request/response cookie APIs.
 */
export function createMiddlewareClient(opts: {
  req: NextRequest;
  res: NextResponse;
}) {
  const { req, res } = opts;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars are missing in middleware");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // NextResponse cookies API
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });
}
