'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { statsDB } from '@/lib/db';
import { sbStatsDB } from '@/lib/supabase-db';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Exclude admin panel routes to avoid skewing public analytics
    if (pathname.startsWith('/admin')) {
      return;
    }

    // Avoid double counting same path in rapid re-renders
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    // Check if new session/visitor for today
    const isNewVisitor = typeof window !== 'undefined' && !sessionStorage.getItem('3s_visited_today');
    if (typeof window !== 'undefined' && isNewVisitor) {
      sessionStorage.setItem('3s_visited_today', 'true');
    }

    // Record locally as fallback
    statsDB.recordPageView();

    // Record globally in Supabase
    if (isSupabaseConfigured()) {
      sbStatsDB.recordPageView(isNewVisitor);
    }
  }, [pathname]);

  return null;
}

