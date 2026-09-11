'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { productsDB, rentalsDB, newsDB, galleryDB, jobsDB, foodDB, staysDB, educationDB } from '@/lib/db';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'Shop' | 'Directory' | 'News' | 'Gallery' | 'Jobs' | 'Food' | 'Stay' | 'Education';
  href: string;
  image?: string;
  badgeColor: string;
  extra?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = useMemo(() => [
    { href: '/',          label: t('home') },
    { href: '/shop',      label: t('shop') },
    { href: '/rent',      label: t('businessDirectory') },
    { href: '/gallery',   label: t('gallery') },
    { href: '/donate',    label: t('donate') },
    { href: '/jobs',      label: t('jobs') },
    { href: '/food',      label: t('foodGuide') },
    { href: '/stay',      label: t('stay') },
    { href: '/education', label: t('education') },
  ], [t]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Compute live search results across all databases
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    try {
      productsDB.getAll().forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
          results.push({ id: `product-${p.id}`, title: p.name, subtitle: p.category, type: 'Shop', href: '/shop', image: p.image, badgeColor: '#D4A017', extra: `฿${p.price.toLocaleString()}` });
        }
      });
    } catch (_) {}

    try {
      rentalsDB.getAll().forEach(r => {
        if (r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
          results.push({ id: `rent-${r.id}`, title: r.name, subtitle: `${r.location} · ${r.size}`, type: 'Directory', href: '/rent', image: r.image, badgeColor: '#22c55e', extra: `฿${r.price.toLocaleString()}/mo` });
        }
      });
    } catch (_) {}

    try {
      newsDB.getAll().forEach(n => {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
          results.push({ id: `news-${n.id}`, title: n.title, subtitle: n.category.replace('-', ' '), type: 'News', href: '/news', image: n.image, badgeColor: '#3b82f6' });
        }
      });
    } catch (_) {}

    try {
      galleryDB.getAll().forEach(g => {
        if (g.title.toLowerCase().includes(q) || g.artist.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)) {
          results.push({ id: `art-${g.id}`, title: g.title, subtitle: `By ${g.artist} · ${g.category}`, type: 'Gallery', href: '/gallery', image: g.image, badgeColor: '#a855f7', extra: g.price ? `฿${g.price.toLocaleString()}` : undefined });
        }
      });
    } catch (_) {}

    try {
      jobsDB.getAll().forEach(j => {
        if (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)) {
          results.push({ id: `job-${j.id}`, title: j.title, subtitle: `${j.company} · ${j.location}`, type: 'Jobs', href: '/jobs', badgeColor: '#f97316', extra: j.salary });
        }
      });
    } catch (_) {}

    try {
      foodDB.getAll().forEach(f => {
        if (f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)) {
          results.push({ id: `food-${f.id}`, title: f.name, subtitle: `${f.category} · ${f.location}`, type: 'Food', href: '/food', image: f.image, badgeColor: '#ef4444', extra: f.priceRange });
        }
      });
    } catch (_) {}

    try {
      staysDB.getAll().forEach(s => {
        if (s.title.toLowerCase().includes(q) || s.companyName?.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)) {
          results.push({ id: `stay-${s.id}`, title: s.title, subtitle: `${s.companyName || s.accommodationType} · ${s.location}`, type: 'Stay', href: '/stay', image: s.images?.[0], badgeColor: '#ec4899', extra: s.price ? `฿${s.price.toLocaleString()}/night` : undefined });
        }
      });
    } catch (_) {}

    try {
      educationDB.getAll().forEach(e => {
        if (e.title.toLowerCase().includes(q) || e.institution.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) {
          results.push({ id: `edu-${e.id}`, title: e.title, subtitle: `${e.institution} · ${e.category}`, type: 'Education', href: '/education', image: e.images?.[0], badgeColor: '#06b6d4', extra: e.fee });
        }
      });
    } catch (_) {}

    return results;
  }, [searchQuery]);

  const handleSelectResult = (href: string) => {
    setIsFocused(false);
    setSearchQuery('');
    setMobileSearchOpen(false);
    router.push(href);
  };

  // ── Language Selector Dropdown ─────────────────────────────────────────────
  const LANGUAGE_OPTIONS: { code: Language; label: string; subLabel: string }[] = [
    { code: 'en', label: 'English', subLabel: 'English' },
    { code: 'th', label: 'ภาษาไทย', subLabel: 'Thai' },
    { code: 'mm', label: 'မြန်မာ', subLabel: 'Burmese' },
  ];

  const LanguageDropdown = ({
    compact = false,
    iconOnly = false,
    align = 'right',
  }: {
    compact?: boolean;
    iconOnly?: boolean;
    align?: 'left' | 'right';
  }) => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    const currentOption = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

    return (
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          id={iconOnly ? 'language-dropdown-icon-btn' : compact ? 'language-dropdown-mobile-btn' : 'language-dropdown-btn'}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Language selector. Current language: ${currentOption.label}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: iconOnly ? '0' : '7px',
            background: isOpen ? '#222222' : 'transparent',
            border: `1px solid ${isOpen ? '#D4A017' : '#2a2a2a'}`,
            color: '#D4A017',
            fontSize: compact ? '0.74rem' : '0.8rem',
            fontWeight: 600,
            padding: iconOnly ? '7px' : compact ? '6px 10px' : '7px 13px',
            width: iconOnly ? '36px' : undefined,
            height: iconOnly ? '36px' : undefined,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
            boxShadow: isOpen ? '0 0 12px rgba(212, 160, 23, 0.2)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = '#D4A017';
              e.currentTarget.style.background = '#222222';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = '#2a2a2a';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {/* Globe icon */}
          <svg
            width={iconOnly ? 18 : 14}
            height={iconOnly ? 18 : 14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4A017"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>

          {!iconOnly && (
            <>
              {/* Current language name */}
              <span style={{ color: '#D4A017', fontWeight: 700 }}>{currentOption.label}</span>

              {/* Down chevron with smooth rotation */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4A017"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  marginLeft: '2px',
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              ...(align === 'left' ? { left: 0 } : { right: 0 }),
              minWidth: '175px',
              background: 'rgba(20, 20, 20, 0.98)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #333333',
              borderRadius: '10px',
              padding: '6px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)',
              zIndex: 1005,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              transformOrigin: align === 'left' ? 'top left' : 'top right',
              animation: 'dropdownSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isSelected ? 'rgba(212, 160, 23, 0.12)' : 'transparent',
                    color: isSelected ? '#D4A017' : '#e5e7eb',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'left',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#222222';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#e5e7eb';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: isSelected ? 700 : 500 }}>{opt.label}</span>
                    {opt.code !== 'en' && (
                      <span style={{ fontSize: '0.72rem', color: isSelected ? '#D4A017aa' : '#6b7280' }}>
                        ({opt.subLabel})
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D4A017"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const SearchBar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div ref={isMobile ? mobileSearchRef : searchRef} style={{ flex: isMobile ? undefined : 1, maxWidth: isMobile ? undefined : '480px', position: 'relative', width: isMobile ? '100%' : undefined }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#1a1a1a',
        border: `1px solid ${isFocused ? '#D4A017' : '#2a2a2a'}`,
        borderRadius: '8px', padding: '0 14px', gap: '10px',
        transition: 'border-color 0.2s',
        boxShadow: isFocused ? '0 0 12px rgba(212,160,23,0.15)' : 'none',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isFocused ? '#D4A017' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder={t('searchPlaceholderGlobal')}
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => { setSearchQuery(e.target.value); setIsFocused(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsFocused(false);
            else if (e.key === 'Enter' && searchResults.length > 0) handleSelectResult(searchResults[0].href);
          }}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '0.88rem', width: '100%', padding: '10px 0', fontFamily: 'Inter, sans-serif' }}
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setIsFocused(false); }} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.85rem', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('close')}>✕</button>
        )}
      </div>

      {/* Dropdown */}
      {isFocused && searchQuery.trim().length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#121212', border: '1px solid #2a2a2a', borderRadius: '12px', boxShadow: '0 12px 32px rgba(0,0,0,0.8)', overflow: 'hidden', zIndex: 1000, maxHeight: '380px', overflowY: 'auto' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e1e1e', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('searchResultsLabel')} ({searchResults.length})</span>
            <span>{t('pressEnterToSelect')}</span>
          </div>
          {searchResults.length > 0 ? (
            <div>
              {searchResults.slice(0, 8).map((item) => (
                <div key={item.id} onClick={() => handleSelectResult(item.href)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #1a1a1a', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e1e1e')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: item.badgeColor, flexShrink: 0 }}>
                      {item.type[0]}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: item.badgeColor, background: `${item.badgeColor}18`, border: `1px solid ${item.badgeColor}30`, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{item.type}</span>
                      <span style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</p>
                  </div>
                  {item.extra && <span style={{ color: '#D4A017', fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 }}>{item.extra}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
              <p style={{ fontSize: '0.88rem', marginBottom: '4px' }}>{t('noMatchesFor')} &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (pathname?.startsWith('/3sgsec_madmin') || pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav style={{ position: 'relative', width: '100%', zIndex: 900, background: 'rgba(11,11,11,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>

          {/* Top row: logo + search + actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', gap: '12px' }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Logo size="md" />
            </Link>

            {/* Desktop Search bar */}
            <div className="nav-search" style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
              <SearchBar />
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

              {/* Language Selector — desktop */}
              <div className="nav-lang-btn">
                <LanguageDropdown align="right" />
              </div>

              {/* Mobile search icon */}
              <button
                className="mobile-search-btn"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#9ca3af', cursor: 'pointer', padding: '7px', borderRadius: '8px', display: 'none', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>

              {/* Facebook Contact Us */}
              <a
                href="https://www.facebook.com/share/1BZMe1KVPk/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-fb-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1877f2', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s, transform 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#1464d8'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#1877f2'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                <span className="nav-fb-text">{t('contactUs')}</span>
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mobile-menu-btn"
                style={{ display: 'none', background: mobileOpen ? '#1a1a1a' : 'transparent', border: '1px solid #2a2a2a', color: '#9ca3af', cursor: 'pointer', padding: '7px', borderRadius: '8px', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                )}
              </button>

              {/* Mobile language selector (icon-only, right of hamburger) */}
              <div className="mobile-lang-btn">
                <LanguageDropdown iconOnly align="right" />
              </div>
            </div>
          </div>

          {/* Desktop nav links row */}
          <div className="nav-desktop-links" style={{ gap: '2px', paddingBottom: '8px' }}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', color: isActive ? '#D4A017' : '#9ca3af', textDecoration: 'none', borderRadius: '6px', borderBottom: isActive ? '2px solid #D4A017' : '2px solid transparent', transition: 'color 0.2s, border-color 0.2s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#9ca3af'; }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile full-screen menu */}
        {mobileOpen && (
          <div style={{ background: '#0d0d0d', borderTop: '1px solid #1e1e1e', position: 'absolute', top: '100%', left: 0, right: 0, height: '100vh', paddingBottom: '120px', zIndex: 899, overflowY: 'auto', animation: 'slideDown 0.2s ease' }}>
            {/* Full-width Facebook contact button at top */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e1e' }}>
              <a
                href="https://www.facebook.com/share/1BZMe1KVPk/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#1877f2', color: '#fff', padding: '12px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', transition: 'background 0.2s' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                {t('contactUsFacebook')}
              </a>
            </div>

            {/* Nav links */}
            <nav style={{ padding: '8px 0' }}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', color: isActive ? '#D4A017' : '#d1d5db', fontSize: '1rem', fontWeight: isActive ? 700 : 500, textDecoration: 'none', borderBottom: '1px solid #1a1a1a', background: isActive ? '#D4A01710' : 'transparent', transition: 'background 0.15s' }}
                  >
                    <span>{link.label}</span>
                    {isActive && <span style={{ color: '#D4A017', fontSize: '0.8rem' }}>●</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Overlay behind mobile menu */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '100vh', zIndex: 898, background: 'rgba(0,0,0,0.5)' }}
          />
        )}

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0b0b0b', borderTop: '1px solid #1e1e1e', padding: '16px', zIndex: 899, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'slideDown 0.2s ease' }}>
            <SearchBar isMobile />
          </div>
        )}

        {/* Overlay behind mobile search */}
        {mobileSearchOpen && !mobileOpen && (
          <div
            onClick={() => setMobileSearchOpen(false)}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '100vh', zIndex: 898, background: 'rgba(0,0,0,0.5)' }}
          />
        )}
      </nav>

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropdownSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .mobile-lang-btn { display: none !important; }
        @media (max-width: 768px) {
          .nav-lang-btn { display: none !important; }
          .mobile-lang-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
