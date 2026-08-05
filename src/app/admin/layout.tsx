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
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#a855f7', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ADMIN PANEL
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
