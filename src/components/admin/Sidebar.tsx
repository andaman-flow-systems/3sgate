'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, ShoppingBag, Store, Newspaper, Image as ImageIcon,
  Heart, Briefcase, UtensilsCrossed, Users, Megaphone, Settings,
  Database, LogOut, ChevronRight
} from 'lucide-react';

const NAV = [
  { href: '/admin',           label: 'Dashboard',     Icon: LayoutDashboard },
  { href: '/admin/shop',      label: 'Shop',          Icon: ShoppingBag },
  { href: '/admin/rent',      label: 'Business Directory', Icon: Store },
  { href: '/admin/news',      label: 'News',          Icon: Newspaper },
  { href: '/admin/gallery',   label: 'Gallery',       Icon: ImageIcon },
  { href: '/admin/donate',    label: 'Donations',     Icon: Heart },
  { href: '/admin/jobs',      label: 'Jobs',          Icon: Briefcase },
  { href: '/admin/food',      label: 'Food Guide',    Icon: UtensilsCrossed },
  { href: '/admin/banners',   label: 'Ads & Banners', Icon: Megaphone },
  { href: '/admin/users',     label: 'Users',         Icon: Users },
  { href: '/admin/settings',  label: 'Settings',      Icon: Settings },
  { href: '/admin/database',  label: 'Database',      Icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div style={{
      width: '240px',
      background: '#0a0a0a',
      borderRight: '1px solid #1e1e1e',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e1e1e' }}>
        <Logo size="sm" />
      </div>

      {/* Admin badge */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Settings size={16} color="#fff" />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.2 }}>Administrator</p>
            <p style={{ color: '#22c55e', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Super Admin
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
                background: isActive ? '#a855f7' : 'transparent',
                color: isActive ? '#fff' : '#9ca3af',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLDivElement).style.background = '#1a1a1a';
                  (e.currentTarget as HTMLDivElement).style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.color = '#9ca3af';
                }
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400 }}>{label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid #1e1e1e' }}>
        <button
          onClick={() => { logout(); window.location.href = '/admin/login'; }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '9px 12px', background: 'transparent',
            border: '1px solid #2a2a2a', color: '#ef4444', fontSize: '0.85rem',
            fontWeight: 500, cursor: 'pointer', borderRadius: '8px',
            transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a0a0a'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
