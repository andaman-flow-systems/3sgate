'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, ShoppingBag, Store, Newspaper, Image as ImageIcon,
  Heart, Briefcase, UtensilsCrossed, Users, Megaphone, Settings,
  Database, LogOut, ChevronRight, Menu, X, BedDouble
} from 'lucide-react';

const NAV = [
  { href: '/3sgsec_madmin',           label: 'Dashboard',          Icon: LayoutDashboard },
  { href: '/3sgsec_madmin/shop',      label: 'Shop',               Icon: ShoppingBag },
  { href: '/3sgsec_madmin/rent',      label: 'Business Directory', Icon: Store },
  { href: '/3sgsec_madmin/stay',      label: 'Stay',               Icon: BedDouble },
  { href: '/3sgsec_madmin/news',      label: 'News',               Icon: Newspaper },
  { href: '/3sgsec_madmin/gallery',   label: 'Gallery',            Icon: ImageIcon },
  { href: '/3sgsec_madmin/donate',    label: 'Donations',          Icon: Heart },
  { href: '/3sgsec_madmin/jobs',      label: 'Jobs',               Icon: Briefcase },
  { href: '/3sgsec_madmin/food',      label: 'Food Guide',         Icon: UtensilsCrossed },
  { href: '/3sgsec_madmin/banners',   label: 'Ads & Banners',      Icon: Megaphone },
  { href: '/3sgsec_madmin/users',     label: 'Users',              Icon: Users },
  { href: '/3sgsec_madmin/settings',  label: 'Settings',           Icon: Settings },
  { href: '/3sgsec_madmin/database',  label: 'Database',           Icon: Database },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

function SidebarContent({ onClose, isMobile }: { onClose?: () => void; isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div style={{
      width: '240px',
      background: '#0a0a0a',
      borderRight: '1px solid #1e1e1e',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Logo + close button on mobile */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" />
        {isMobile && onClose && (
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Admin badge */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #a855f7, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
      <nav style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }} onClick={isMobile ? onClose : undefined}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', background: isActive ? '#a855f7' : 'transparent', color: isActive ? '#fff' : '#9ca3af', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = '#1a1a1a'; (e.currentTarget as HTMLDivElement).style.color = '#fff'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = '#9ca3af'; } }}
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
          onClick={() => { logout(); window.location.href = '/3sgsec_madmin/login'; }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', background: 'transparent', border: '1px solid #2a2a2a', color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px', transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif' }}
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

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Sidebar ── (always visible ≥1025px) */}
      <div className="admin-sidebar" style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        <SidebarContent />
      </div>

      {/* ── Mobile toggle button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="admin-mobile-toggle"
        style={{
          position: 'fixed', top: '12px', left: '12px', zIndex: 200,
          background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#a855f7',
          borderRadius: '8px', padding: '8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Open admin menu"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 999,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        <SidebarContent isMobile onClose={() => setMobileOpen(false)} />
      </div>

      <style>{`
        /* Desktop: show sidebar, hide mobile toggle */
        @media (min-width: 1025px) {
          .admin-mobile-toggle { display: none !important; }
          .admin-sidebar { transform: none !important; }
        }
        /* Mobile: hide static sidebar, show toggle */
        @media (max-width: 1024px) {
          .admin-sidebar { display: none !important; }
        }
      `}</style>
    </>
  );
}
