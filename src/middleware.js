// pages/_middleware.js
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['da', 'en'],
  localeDetection: false,
  defaultLocale: 'da'
});

export async function middleware(request) {
  // First, run the internationalization middleware
  const intlResponse = intlMiddleware(request);

  // If intlMiddleware returns a response, we need to check if it's a redirect or other early return
  if (intlResponse) {
    return intlResponse;
  }

  // Then, run the session update middleware
  const sessionResponse = await updateSession(request);

  // Return the response from session middleware
  return sessionResponse || NextResponse.next();
}

// Define a combined matcher
export const config = {
  matcher: [
    '/',
    '/(de|en)/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
