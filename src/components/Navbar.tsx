'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { productsDB, rentalsDB, newsDB, galleryDB, jobsDB, foodDB } from '@/lib/db';

const NAV_LINKS = [
  { href: '/',         label: 'HOME' },
  { href: '/shop',     label: 'SHOP' },
  { href: '/rent',     label: 'BUSINESS DIRECTORY' },
  { href: '/gallery',  label: 'GALLERY' },
  { href: '/donate',   label: 'DONATE' },
  { href: '/jobs',     label: 'JOBS' },
  { href: '/food',     label: 'FOOD GUIDE' },
];

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'Shop' | 'Directory' | 'News' | 'Gallery' | 'Jobs' | 'Food';
  href: string;
  image?: string;
  badgeColor: string;
  extra?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search results across all databases
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 1. Products
    try {
      productsDB.getAll().forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
          results.push({
            id: `product-${p.id}`,
            title: p.name,
            subtitle: p.category,
            type: 'Shop',
            href: '/shop',
            image: p.image,
            badgeColor: '#D4A017',
            extra: `฿${p.price.toLocaleString()}`,
          });
        }
      });
    } catch (_) {}

    // 2. Business Directory / Rentals
    try {
      rentalsDB.getAll().forEach(r => {
        if (r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
          results.push({
            id: `rent-${r.id}`,
            title: r.name,
            subtitle: `${r.location} · ${r.size}`,
            type: 'Directory',
            href: '/rent',
            image: r.image,
            badgeColor: '#22c55e',
            extra: `฿${r.price.toLocaleString()}/mo`,
          });
        }
      });
    } catch (_) {}

    // 3. News
    try {
      newsDB.getAll().forEach(n => {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
          results.push({
            id: `news-${n.id}`,
            title: n.title,
            subtitle: n.category.replace('-', ' '),
            type: 'News',
            href: '/news',
            image: n.image,
            badgeColor: '#3b82f6',
          });
        }
      });
    } catch (_) {}

    // 4. Art Gallery
    try {
      galleryDB.getAll().forEach(g => {
        if (g.title.toLowerCase().includes(q) || g.artist.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)) {
          results.push({
            id: `art-${g.id}`,
            title: g.title,
            subtitle: `By ${g.artist} · ${g.category}`,
            type: 'Gallery',
            href: '/gallery',
            image: g.image,
            badgeColor: '#a855f7',
            extra: g.price ? `฿${g.price.toLocaleString()}` : undefined,
          });
        }
      });
    } catch (_) {}

    // 5. Jobs
    try {
      jobsDB.getAll().forEach(j => {
        if (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)) {
          results.push({
            id: `job-${j.id}`,
            title: j.title,
            subtitle: `${j.company} · ${j.location}`,
            type: 'Jobs',
            href: '/jobs',
            badgeColor: '#f97316',
            extra: j.salary,
          });
        }
      });
    } catch (_) {}

    // 6. Food Guide
    try {
      foodDB.getAll().forEach(f => {
        if (f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)) {
          results.push({
            id: `food-${f.id}`,
            title: f.name,
            subtitle: `${f.category} · ${f.location}`,
            type: 'Food',
            href: '/food',
            image: f.image,
            badgeColor: '#ef4444',
            extra: f.priceRange,
          });
        }
      });
    } catch (_) {}

    return results;
  }, [searchQuery]);

  const handleSelectResult = (href: string) => {
    setIsFocused(false);
    setSearchQuery('');
    router.push(href);
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: '52px', // below ad banner
        left: 0,
        right: 0,
        zIndex: 900,
        background: 'rgba(11,11,11,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #2a2a2a',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
        }}>
          {/* Top row: logo + search + actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            gap: '16px',
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Logo size="md" />
            </Link>

            {/* Search bar – center */}
            <div ref={searchRef} style={{
              flex: 1,
              maxWidth: '480px',
              position: 'relative',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#1a1a1a',
                border: `1px solid ${isFocused ? '#D4A017' : '#2a2a2a'}`,
                borderRadius: '8px',
                padding: '0 14px',
                gap: '10px',
                transition: 'border-color 0.2s',
                boxShadow: isFocused ? '0 0 12px rgba(212,160,23,0.15)' : 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isFocused ? '#D4A017' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search products, directory, news, jobs..."
                  value={searchQuery}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsFocused(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsFocused(false);
                    } else if (e.key === 'Enter' && searchResults.length > 0) {
                      handleSelectResult(searchResults[0].href);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    width: '100%',
                    padding: '10px 0',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsFocused(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: '2px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Live Results Dropdown */}
              {isFocused && searchQuery.trim().length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#121212',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                  overflow: 'hidden',
                  zIndex: 1000,
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}>
                  <div style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid #1e1e1e',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>Search Results ({searchResults.length})</span>
                    <span>Press Enter to select</span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div>
                      {searchResults.slice(0, 8).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item.href)}
                          style={{
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #1a1a1a',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1e1e1e')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              background: '#1e1e1e',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: item.badgeColor,
                              flexShrink: 0,
                            }}>
                              {item.type[0]}
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                color: item.badgeColor,
                                background: `${item.badgeColor}18`,
                                border: `1px solid ${item.badgeColor}30`,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                              }}>
                                {item.type}
                              </span>
                              <span style={{
                                color: '#ffffff',
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {item.title}
                              </span>
                            </div>
                            <p style={{
                              color: '#6b7280',
                              fontSize: '0.78rem',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {item.subtitle}
                            </p>
                          </div>

                          {item.extra && (
                            <span style={{
                              color: '#D4A017',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}>
                              {item.extra}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                      <p style={{ fontSize: '0.88rem', marginBottom: '4px' }}>No matches found for "{searchQuery}"</p>
                      <span style={{ fontSize: '0.75rem' }}>Try searching for products, directory listings, or news</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              {/* Useful Action: Facebook Contact Us */}
              <a
                href="https://www.facebook.com/share/1JAoQ7KMHx/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#1877f2',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '7px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#1464d8';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.03)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#1877f2';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Contact Us
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  display: 'none',
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '6px',
                }}
                className="mobile-menu-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom row: nav links */}
          <div style={{
            display: 'flex',
            gap: '4px',
            paddingBottom: '8px',
          }}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    color: isActive ? '#D4A017' : '#9ca3af',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    borderBottom: isActive ? '2px solid #D4A017' : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#9ca3af';
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            background: '#111111',
            borderTop: '1px solid #2a2a2a',
            padding: '12px 24px',
          }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  color: pathname === link.href ? '#D4A017' : '#9ca3af',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1px solid #2a2a2a',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
