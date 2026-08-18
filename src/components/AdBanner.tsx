'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { bannersDB, type Banner } from '@/lib/db';

const colorMap: Record<string, { bg: string; glow: string; text: string; badge: string; dot: string }> = {
  gold: {
    bg:    'linear-gradient(90deg, #1a1100 0%, #2d1f00 30%, #3a2800 50%, #2d1f00 70%, #1a1100 100%)',
    glow:  'rgba(212,160,23,0.15)',
    text:  '#f5c518',
    badge: 'rgba(212,160,23,0.18)',
    dot:   '#f5c518',
  },
  blue: {
    bg:    'linear-gradient(90deg, #050f1f 0%, #0a1f3d 30%, #0d2850 50%, #0a1f3d 70%, #050f1f 100%)',
    glow:  'rgba(96,165,250,0.15)',
    text:  '#60a5fa',
    badge: 'rgba(96,165,250,0.18)',
    dot:   '#60a5fa',
  },
  red: {
    bg:    'linear-gradient(90deg, #1a0505 0%, #2d0a0a 30%, #3a0d0d 50%, #2d0a0a 70%, #1a0505 100%)',
    glow:  'rgba(248,113,113,0.15)',
    text:  '#f87171',
    badge: 'rgba(248,113,113,0.18)',
    dot:   '#f87171',
  },
  green: {
    bg:    'linear-gradient(90deg, #05140a 0%, #0a2412 30%, #0d3018 50%, #0a2412 70%, #05140a 100%)',
    glow:  'rgba(74,222,128,0.15)',
    text:  '#4ade80',
    badge: 'rgba(74,222,128,0.18)',
    dot:   '#4ade80',
  },
  purple: {
    bg:    'linear-gradient(90deg, #100718 0%, #1c0d2d 30%, #240f3a 50%, #1c0d2d 70%, #100718 100%)',
    glow:  'rgba(192,132,252,0.15)',
    text:  '#c084fc',
    badge: 'rgba(192,132,252,0.18)',
    dot:   '#c084fc',
  },
};

const typeLabel: Record<string, string> = {
  announcement: '📢 ANNOUNCEMENT',
  promo:        '🔥 SPECIAL OFFER',
  event:        '🎉 EVENT',
  news:         '📰 NEWS',
  alert:        '⚠️ ALERT',
};

export const BANNER_HEIGHT = 52;

export default function AdBanner() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent]  = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const active = bannersDB.getActive();
    setBanners(active);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % banners.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (pathname?.startsWith('/3sgsec_madmin') || pathname?.startsWith('/admin') || banners.length === 0 || dismissed) return null;

  const banner = banners[current];
  const theme  = colorMap[banner.color] ?? colorMap.gold;
  const label  = typeLabel[banner.type] ?? '📢 ANNOUNCEMENT';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      zIndex: 999,
      height: `${BANNER_HEIGHT}px`,
      background: theme.bg,
      boxShadow: `0 2px 20px ${theme.glow}, inset 0 -1px 0 rgba(255,255,255,0.06)`,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>

      {/* Left badge */}
      <div style={{
        flexShrink: 0,
        padding: '0 16px 0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRight: `1px solid ${theme.glow}`,
        height: '100%',
      }}>
        {/* Pulse dot */}
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            display: 'block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: theme.dot,
            boxShadow: `0 0 8px ${theme.dot}`,
            animation: 'adPulse 1.8s ease-in-out infinite',
          }} />
        </span>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: theme.text,
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          background: theme.badge,
          padding: '3px 8px',
          borderRadius: '4px',
          border: `1px solid ${theme.text}30`,
        }}>
          {label}
        </span>
      </div>

      {/* Scrolling text */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div
          key={banner.id + current}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            animation: animating
              ? 'bannerFadeOut 0.3s ease forwards'
              : 'bannerFadeIn 0.4s ease forwards',
            paddingLeft: '24px',
          }}
        >
          {banner.link ? (
            <a
              href={banner.link}
              style={{
                color: theme.text,
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: `0 0 16px ${theme.glow}`,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {banner.text}
              <span style={{ marginLeft: '10px', opacity: 0.6, fontSize: '0.8rem' }}>→ Click to learn more</span>
            </a>
          ) : (
            <span style={{
              color: theme.text,
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              textShadow: `0 0 16px ${theme.glow}`,
            }}>
              {banner.text}
            </span>
          )}
        </div>
      </div>

      {/* Right: dots + close */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 16px',
        borderLeft: `1px solid ${theme.glow}`,
        height: '100%',
      }}>
        {/* Dot indicators */}
        {banners.length > 1 && (
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  background: i === current ? theme.dot : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  boxShadow: i === current ? `0 0 6px ${theme.dot}` : 'none',
                }}
              />
            ))}
          </div>
        )}

        {/* Close / dismiss */}
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.45)',
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            lineHeight: 1,
            transition: 'all 0.2s',
            padding: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)';
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes adPulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 6px currentColor; }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes bannerFadeIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bannerFadeOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-16px); }
        }
      `}</style>
    </div>
  );
}
