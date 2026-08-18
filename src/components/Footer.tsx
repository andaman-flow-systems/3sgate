'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { Mail, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();
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
              {t('siteDescription')}
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
            <h5 style={{ color: '#D4A017', marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t('footerPages')}
            </h5>
            {[
              { href: '/shop', label: t('footerOnlineShop') },
              { href: '/rent', label: t('footerBusinessDirectory') },
              { href: '/stay', label: t('footerStay') },
              { href: '/news', label: t('footerNews') },
              { href: '/gallery', label: t('footerArtGallery') },
              { href: '/donate', label: t('footerDonations') },
              { href: '/jobs', label: t('footerJobs') },
              { href: '/food', label: t('footerFoodGuide') },
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
            <h5 style={{ color: '#3b82f6', marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t('footerCommunity')}
            </h5>
            {[
              t('footerMyanmarInThailand'),
              t('footerMyanmarAbroad'),
              t('footerRefugeeSupport'),
              t('footerScholarships'),
              t('footerCulturalEvents'),
            ].map((item) => (
              <p key={item} style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px' }}>{item}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ color: '#22c55e', marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t('footerContact')}
            </h5>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={15} color="#6b7280" /> admin.3sgates2026@gmail.com
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={15} color="#6b7280" /> Bangkok, Thailand
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={15} color="#6b7280" /> www.3sgates.com
            </p>
          </div>
        </div>

        {/* Powered by AndamanFlow Systems */}
        <div style={{
          borderTop: '1px solid #1e1e1e',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            © {year} 3SGates. {t('footerAllRightsReserved')}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>
            {t('footerPoweredBy')}
          </p>
        </div>
      </div>
    </footer>
  );
}
