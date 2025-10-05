import { NextResponse, type NextRequest } from 'next/server';  // Keep/update this
import { updateSession } from '@/utils/supabase/middleware';  // Keep this
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // First, run the existing session update (this refreshes cookies/session).
  let response = await updateSession(request);

  // Now, create a Supabase client using the updated response, passing URL and key directly.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get the session (this tells us if the user is logged in).
  const { data: { session } } = await supabase.auth.getSession();

  // Protect /dashboard: If no session, redirect to /login.
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));  // Redirect if not logged in.
    }
  }

  // Bonus: If already logged in, redirect away from /login to /dashboard.
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;  // If all good, proceed.
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};