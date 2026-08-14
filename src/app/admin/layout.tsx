'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthChecked(true);
      return;
    }
    
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setAuthChecked(true);
    }
  }, [pathname, router]);

  if (!authChecked) return <div style={{ height: '100vh', background: '#0B0B0B' }} />;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0B0B' }}>
      <Sidebar />
      {/* Main content — margin-left only on desktop (1025px+) */}
      <div
        className="admin-main"
        style={{ flex: 1, padding: '24px', minWidth: 0, overflowX: 'hidden' }}
      >
        <header style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <h1
            className="admin-panel-title"
            style={{ color: '#a855f7', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            ADMIN PANEL
          </h1>
        </header>
        {children}
      </div>

      <style>{`
        @media (min-width: 1025px) {
          .admin-main { margin-left: 240px !important; }
        }
        @media (max-width: 1024px) {
          .admin-main { margin-left: 0 !important; padding-top: 56px !important; }
        }
      `}</style>
    </div>
  );
}
