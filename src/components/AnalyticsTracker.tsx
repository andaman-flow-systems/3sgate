'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { statsDB } from '@/lib/db';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Record page view on initial load and route changes (excluding admin panel routes to avoid skewing public analytics)
    if (!pathname.startsWith('/admin')) {
      statsDB.recordPageView();
    }
  }, [pathname]);

  return null;
}
