// pages/_middleware.js
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';

// Define routing configuration for next-intl
const intlMiddleware = createMiddleware({
  locales: ['da', 'en'],
  localeDetection: false,
  defaultLocale: 'da',
  localePrefix: 'as-needed',
});

// The combined middleware function
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Exclude API routes from the internationalization middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Run the internationalization middleware
  const intlResponse = intlMiddleware(request);

  // Check if intlMiddleware resulted in a response (e.g., a redirect)
  if (intlResponse) {
    return intlResponse;
  }

  // Run custom session update logic
  const sessionResponse = await updateSession(request);

  // If sessionResponse exists, return it; otherwise, proceed to the next middleware or route handler
  return sessionResponse || NextResponse.next();
}

// Configuration for the matcher
export const config = {
  matcher: [
    '/', 
    '/(da|en)/:path*', 
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
