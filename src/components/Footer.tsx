'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { Mail, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer style={{
      background: '#0d0d0d',
      borderTop: '1px solid #1e1e1e',
      padding: '48px 0 24px',
      marginTop: '80px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <Logo size="md" />
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '14px', lineHeight: 1.7 }}>
              A trusted gateway that connects communities with opportunities, knowledge, businesses, and meaningful social impact.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {['facebook', 'twitter', 'instagram'].map((s) => (
                <a key={s} href="#" style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280', fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h5 style={{ color: '#D4A017', marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pages</h5>
            {[
              { href: '/shop', label: 'Online Shop' },
              { href: '/rent', label: 'Business Directory' },
              { href: '/news', label: 'News' },
              { href: '/gallery', label: 'Art Gallery' },
              { href: '/donate', label: 'Donations' },
              { href: '/jobs', label: 'Jobs' },
              { href: '/food', label: 'Food Guide' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                display: 'block', color: '#9ca3af', fontSize: '0.88rem',
                marginBottom: '8px', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
              >{l.label}</Link>
            ))}
          </div>

          {/* Community */}
          <div>
            <h5 style={{ color: '#3b82f6', marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Community</h5>
            {['Myanmar in Thailand', 'Myanmar Abroad', 'Refugee Support', 'Scholarships', 'Cultural Events'].map((item) => (
              <p key={item} style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px' }}>{item}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ color: '#22c55e', marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</h5>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={15} color="#6b7280" /> admin.3sgates2026@gmail.com
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={15} color="#6b7280" /> Bangkok, Thailand
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={15} color={"#6b7280"} /> www.3sgates.com
            </p>
          </div>
        </div>

        {/* Powered by AndamanFlow Systems */}
        <div style={{
          borderTop: '1px solid #1e1e1e',
          paddingTop: '24px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <a
            href="https://andamanflow.systems"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '14px',
              textDecoration: 'none',
              padding: '12px 28px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(14,165,233,0.04) 100%)',
              border: '1px solid rgba(56,189,248,0.15)',
              boxShadow: '0 0 24px rgba(56,189,248,0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(14,165,233,0.08) 100%)';
              e.currentTarget.style.border = '1px solid rgba(56,189,248,0.35)';
              e.currentTarget.style.boxShadow = '0 0 36px rgba(56,189,248,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(14,165,233,0.04) 100%)';
              e.currentTarget.style.border = '1px solid rgba(56,189,248,0.15)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(56,189,248,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ color: '#4b5563', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Powered by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/andamanflow-logo.png"
              alt="AndamanFlow Systems"
              style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }}
              onError={e => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
                const fallback = el.nextSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback text if logo fails */}
            <span style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              fontSize: '1rem',
              fontWeight: 800,
              fontFamily: 'Inter, sans-serif',
            }}>
              <span style={{ color: '#ffffff' }}>Andaman</span>
              <span style={{ color: '#38bdf8' }}>Flow</span>
              <span style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 400 }}>Systems</span>
            </span>
          </a>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1e1e1e',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>
            © {year} 3SGates. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service'].map((t) => (
              <a key={t} href="#" style={{ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
