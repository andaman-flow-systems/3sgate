'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { BedDouble } from 'lucide-react';

export default function QuickAccess() {
  const { t } = useLanguage();

  const ICONS = [
    {
      href: '/shop',    label: t('qaShop'),       sub: t('qaShopSub'),       color: '#D4A017',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
    {
      href: '/rent',    label: t('qaDirectory'),  sub: t('qaDirectorySub'), color: '#D4A017',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
    },
    {
      href: '/stay',    label: t('qaStay'),       sub: t('qaStaySub'),       color: '#ec4899',
      icon: <BedDouble size={26} />,
    },
    {
      href: '/news',    label: t('qaNews'),       sub: t('qaNewsSub'),       color: '#3b82f6',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
          <line x1="10" y1="7" x2="18" y2="7"/><line x1="10" y1="11" x2="18" y2="11"/><line x1="10" y1="15" x2="18" y2="15"/>
        </svg>
      ),
    },
    {
      href: '/gallery', label: t('qaArt'),        sub: t('qaArtSub'),        color: '#a855f7',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/>
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
        </svg>
      ),
    },
    {
      href: '/donate',  label: t('qaDonate'),     sub: t('qaDonateSub'),     color: '#ef4444',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 21.593c-.525-.445-8.53-6.77-8.53-11.594C3.47 6.19 5.862 4 9 4c1.818 0 3.442.905 4.5 2.284C14.558 4.905 16.182 4 18 4c3.138 0 5.53 2.19 5.53 5.999 0 4.824-8.005 11.15-8.53 11.594h-3z"/>
        </svg>
      ),
    },
    {
      href: '/jobs',    label: t('qaJobs'),       sub: t('qaJobsSub'),       color: '#22c55e',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
    },
    {
      href: '/food',    label: t('qaFood'),       sub: t('qaFoodSub'),       color: '#f97316',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="quick-access-grid" style={{ marginTop: '12px' }}>
        {ICONS.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div
              className="quick-access-item"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '14px 6px 12px',
                background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = '#1a1a1a';
                el.style.borderColor = item.color;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = '#111111';
                el.style.borderColor = '#2a2a2a';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: item.color + '20', border: `2px solid ${item.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.2 }}>
                {item.label}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.2 }}>
                {item.sub}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
        }
        @media (max-width: 1100px) {
          .quick-access-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 600px) {
          .quick-access-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
          .quick-access-item { padding: 12px 4px 10px !important; }
        }
        @media (max-width: 400px) {
          .quick-access-grid { grid-template-columns: repeat(4, 1fr); gap: 4px; }
        }
      `}</style>
    </>
  );
}
