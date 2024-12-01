'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function GoogleAnalyticsTrack() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if gtag is available (injected by Google Tag Manager or GA script)
    if (typeof window !== 'undefined' && window.gtag) {
      // Send page view
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_search: searchParams?.toString() || '',
      });

      // Automatically track search if there's a search parameter
      const searchTerm = searchParams?.get('q') || searchParams?.get('search');
      if (searchTerm) {
        window.gtag('event', 'search', {
          search: searchTerm
        });
      }
    }
  }, [pathname, searchParams]);

  return null;
}