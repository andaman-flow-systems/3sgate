'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { sbEducationDB } from '@/lib/supabase-db';
import { educationDB, type EducationPost, type EducationCategory } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage, type TranslationKey } from '@/contexts/LanguageContext';
import {
  ArrowLeft, Heart, Compass, Scale, Send, ShieldCheck,
  School, BookOpen, Laptop, Settings, GraduationCap,
  Presentation, Mic, Calendar, Handshake, Search, X,
  MapPin, Star, ChevronLeft, ChevronRight, Mail, Globe,
  ExternalLink, Tag, SearchX, type LucideIcon
} from 'lucide-react';

// ─── Categories & Config ───────────────────────────────────────────────────────
const CATEGORIES: EducationCategory[] = [
  'Schools', 'Learning Centers',
  'Online Learning', 'Makerspaces',
  'Courses', 'Workshops',
  'Seminars / Talks', 'Events',
];

interface CatConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

const CAT_CONFIG: Record<EducationCategory, CatConfig> = {
  'Schools':          { icon: School,         color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  'Learning Centers': { icon: BookOpen,       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'Online Learning':  { icon: Laptop,         color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  'Makerspaces':      { icon: Settings,       color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  'Courses':          { icon: GraduationCap,  color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
  'Workshops':        { icon: Presentation,   color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  'Seminars / Talks': { icon: Mic,            color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
  'Events':           { icon: Calendar,       color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
};

const CAT_KEY_MAP: Record<EducationCategory, TranslationKey> = {
  'Schools': 'eduCatSchools',
  'Learning Centers': 'eduCatLearningCenters',
  'Online Learning': 'eduCatOnlineLearning',
  'Makerspaces': 'eduCatMakerspaces',
  'Courses': 'eduCatCourses',
  'Workshops': 'eduCatWorkshops',
  'Seminars / Talks': 'eduCatSeminarsTalks',
  'Events': 'eduCatEvents',
};

function getTransCategory(t: (k: TranslationKey) => string, cat: string): string {
  const key = (CAT_KEY_MAP as Record<string, TranslationKey>)[cat];
  return key ? t(key) : cat;
}

const DEFAULT_CFG: CatConfig = { icon: GraduationCap, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' };
function getCfg(cat: string): CatConfig {
  return (CAT_CONFIG as Record<string, CatConfig>)[cat] ?? DEFAULT_CFG;
}

function normalizeUrl(raw?: string): string | null {
  if (!raw) return null;
  const t = raw.trim();
  if (!t || t.includes('/3sgsec_madmin')) return null;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ rating, size = 13 }: { rating?: number; size?: number }) {
  const stars = rating ?? 0;
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(stars) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(stars) ? '#f59e0b' : '#4b5563'}
        />
      ))}
      {rating && (
        <span style={{ color: '#f59e0b', fontSize: `${size - 1}px`, fontWeight: 700, marginLeft: 3 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}

// ─── Image Gallery (Modal) ───────────────────────────────────────────────────
function ImageGallery({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const imgs = Array.isArray(images) ? images.filter(Boolean) : [];
  if (!imgs.length) return null;
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(imgs.length - 1, i + 1));

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: '260px', background: '#141414', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
        <img src={imgs[idx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, rgba(12,12,12,0.95) 0%, transparent 100%)' }} />

        {imgs.length > 1 && (
          <>
            <button onClick={prev} disabled={idx === 0} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '34px', height: '34px', color: '#fff', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} disabled={idx === imgs.length - 1} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '34px', height: '34px', color: '#fff', cursor: idx === imgs.length - 1 ? 'default' : 'pointer', opacity: idx === imgs.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={18} />
            </button>
            <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.72rem', padding: '3px 9px', borderRadius: '12px', fontWeight: 600 }}>
              {idx + 1} / {imgs.length}
            </div>
          </>
        )}
      </div>

      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', padding: '10px 0 0' }}>
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ flex: 1, height: '56px', border: `2px solid ${i === idx ? '#22d3ee' : 'transparent'}`, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'transparent' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Card Thumbnail ────────────────────────────────────────────────────────────
function CardThumbnail({ images, category }: { images?: string[]; category: string }) {
  const cfg = getCfg(category);
  const Icon = cfg.icon;
  const imgs = Array.isArray(images) ? images.filter(Boolean) : [];

  if (!imgs.length) {
    return (
      <div style={{ width: '100%', height: '175px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: `${cfg.color}18`, border: `1px solid ${cfg.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={26} color={cfg.color} strokeWidth={1.6} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden' }}>
      <img src={imgs[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {imgs.length > 1 && (
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '4px' }}>
          {imgs.slice(1, 3).map((img, i) => (
            <img key={i} src={img} alt="" style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '5px', border: '2px solid rgba(255,255,255,0.35)' }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Education Page ───────────────────────────────────────────────────────
export default function EducationPage() {
  const { t } = useLanguage();

  const [items, setItems] = useState<EducationPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<EducationPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbEducationDB.getAll();
        setItems(data.filter(i => i.status === 'published'));
      } else {
        setItems(educationDB.getPublished());
      }
    } catch {
      setItems(educationDB.getPublished());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Live real-time sync with Admin updates
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === '3sg_education' || e.key === '3sg_eduhub_v2') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadData]);

  // 100% Real data category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(c => { counts[c] = 0; });
    items.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    let r = items;
    if (selectedCategory !== 'All') r = r.filter(i => i.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      r = r.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.institution.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    }
    return r;
  }, [items, selectedCategory, searchQuery]);

  return (
    <div style={{ background: '#0a100d', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px 16px 80px' }}>

        {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 16px' }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', color: '#fff', textDecoration: 'none', transition: 'background 0.15s' }}
          >
            <ArrowLeft size={22} color="#fff" />
          </Link>
          <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {t('education')}
          </span>

          <button
            onClick={() => setLiked(!liked)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Like page"
          >
            <Heart size={20} color={liked ? '#ef4444' : '#fff'} fill={liked ? '#ef4444' : 'none'} style={{ transition: 'all 0.2s' }} />
          </button>
        </div>

        {/* ── 1. Hero Banner Card ──────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #092e26 0%, #0d3d34 50%, #07241e 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(34,211,238,0.18)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '210px',
          position: 'relative',
          padding: '24px 24px 0 24px',
          boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
        }}>
          {/* Subtle glow circle */}
          <div style={{ position: 'absolute', top: '-60px', left: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Left Text */}
          <div style={{ flex: 1, minWidth: '180px', paddingBottom: '24px', zIndex: 2 }}>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.35rem, 4vw, 1.8rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '10px', letterSpacing: '-0.01em' }}>
              {t('eduHeroTitle')}
            </h1>
            <p style={{ color: '#88a39d', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, maxWidth: '280px' }}>
              {t('eduHeroSub')}
            </p>
          </div>

          {/* Right Image (Smiling student with notebook & backpack) */}
          <div style={{ flexShrink: 0, alignSelf: 'flex-end', height: '210px', width: '170px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1 }}>
            <img
              src="/images/education/student-hero.jpg"
              alt="Education Student"
              style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'bottom' }}
            />
          </div>
        </div>

        {/* ── 2. 4 Feature Cards (Discover, Compare, Apply, Enroll) ─────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '14px' }}>
          {[
            { icon: Compass,     labelKey: 'eduDiscover' as TranslationKey, subKey: 'eduDiscoverSub' as TranslationKey, color: '#22d3ee' },
            { icon: Scale,       labelKey: 'eduCompare' as TranslationKey,  subKey: 'eduCompareSub' as TranslationKey,  color: '#f59e0b' },
            { icon: Send,        labelKey: 'eduApply' as TranslationKey,    subKey: 'eduApplySub' as TranslationKey,    color: '#38bdf8' },
            { icon: ShieldCheck, labelKey: 'eduEnroll' as TranslationKey,   subKey: 'eduEnrollSub' as TranslationKey,   color: '#4ade80' },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.labelKey}
                style={{
                  background: '#121816',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '16px 8px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icon size={24} color={f.color} strokeWidth={1.75} />
                </div>
                <div style={{ color: '#fff', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.04em', marginBottom: '3px' }}>
                  {t(f.labelKey)}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.64rem', lineHeight: 1.3 }}>
                  {t(f.subKey)}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3. Explore by Category (Exact 2-column grid from reference) ───────── */}
        <div style={{ marginTop: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
              {t('eduExploreByCategory')}
            </h2>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {t('eduAllListings')} ({items.length})
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {CATEGORIES.map(cat => {
              const cfg = CAT_CONFIG[cat];
              const Icon = cfg.icon;
              const count = categoryCounts[cat] ?? 0;
              const isActive = selectedCategory === cat;
              const translatedCatName = getTransCategory(t, cat);

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? 'All' : cat)}
                  style={{
                    background: isActive ? `${cfg.color}15` : '#121816',
                    border: `1px solid ${isActive ? cfg.color : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 0 18px ${cfg.color}25` : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = `${cfg.color}40`; e.currentTarget.style.background = '#151e1b'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#121816'; } }}
                >
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={26} color={cfg.color} strokeWidth={1.6} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {translatedCatName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '2px' }}>
                      {count} {count === 1 ? t('eduListingSingular') : t('eduListingPlural')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. Education Admission Partner Banner ─────────────────────────────── */}
        <div style={{
          marginTop: '22px',
          background: 'linear-gradient(135deg, #092e26 0%, #0d3d34 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(34,211,238,0.2)',
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
              {t('eduPartnerTitle')}
            </h3>
            <p style={{ color: '#88a39d', fontSize: '0.82rem', lineHeight: 1.5, margin: 0, maxWidth: '400px' }}>
              {t('eduPartnerSub')}
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Handshake size={44} strokeWidth={1.5} color="#22d3ee" />
          </div>
        </div>

        {/* ── 5. Listings Section (Where arrow points) ─────────────────────────── */}
        <div style={{ marginTop: '32px' }}>

          {/* Search bar + filter header */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} color="#22d3ee" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('eduSearchPlaceholder')}
                style={{ width: '100%', background: '#121816', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 38px 12px 42px', color: '#fff', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#22d3ee'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}>
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Active filter pills */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{t('eduFilter')}</span>
              {selectedCategory !== 'All' && (() => {
                const cfg = getCfg(selectedCategory);
                const Icon = cfg.icon;
                const transCat = getTransCategory(t, selectedCategory);
                return (
                  <span style={{ background: cfg.bg, border: `1px solid ${cfg.color}50`, color: cfg.color, borderRadius: '999px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={12} color={cfg.color} /> {transCat}
                    <button onClick={() => setSelectedCategory('All')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                  </span>
                );
              })()}
              {searchQuery && (
                <span style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee', borderRadius: '999px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              )}
              <span style={{ color: '#64748b', fontSize: '0.78rem', marginLeft: '4px' }}>
                {filteredItems.length} {filteredItems.length === 1 ? t('eduListingSingular') : t('eduListingPlural')}
              </span>
            </div>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} style={{ background: '#121816', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', height: '340px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#121816', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <SearchX size={24} color="#22d3ee" />
              </div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{t('eduNoListings')}</h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>{t('eduNoListingsSub')}</p>
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} style={{ marginTop: '14px', padding: '7px 18px', background: '#1c2622', border: '1px solid #2d3d37', borderRadius: '8px', color: '#22d3ee', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                {t('eduClearFilters')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
              {filteredItems.map(item => {
                const cfg = getCfg(item.category);
                const Icon = cfg.icon;
                const transCat = getTransCategory(t, item.category);

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    style={{ background: '#121816', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${cfg.color}50`; e.currentTarget.style.boxShadow = `0 12px 28px rgba(0,0,0,0.6), 0 0 0 1px ${cfg.color}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: 'relative' }}>
                      <CardThumbnail images={item.images ?? []} category={item.category} />
                      {/* Type badge */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(10,16,14,0.9)', backdropFilter: 'blur(6px)', border: `1px solid ${cfg.color}55`, color: cfg.color, padding: '3px 10px', borderRadius: '7px', fontSize: '0.67rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Icon size={12} color={cfg.color} /> {transCat}
                      </div>
                      {/* Rating */}
                      {item.rating && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(10,16,14,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(245,158,11,0.35)', padding: '3px 8px', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                          <span style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 800 }}>{item.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Org */}
                      <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.institution}
                      </div>

                      {/* Title */}
                      <h3 style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.7em' }}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                        {item.description}
                      </p>

                      {/* Info footer */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.75rem' }}>
                            <MapPin size={11} color="#64748b" /> {item.location}
                          </span>
                          <span style={{ color: '#22d3ee', fontSize: '0.76rem', fontWeight: 700 }}>
                            {item.fee} {item.currency ? `(${item.currency})` : ''}
                          </span>
                        </div>
                        {item.size && (
                          <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Tag size={10} color="#64748b" /> {item.size}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={e => { e.stopPropagation(); setActiveItem(item); }}
                        style={{ width: '100%', background: `linear-gradient(135deg, ${cfg.color}18 0%, ${cfg.color}08 100%)`, border: `1px solid ${cfg.color}40`, color: cfg.color, padding: '9px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = cfg.color; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${cfg.color}18 0%, ${cfg.color}08 100%)`; e.currentTarget.style.color = cfg.color; }}
                      >
                        {t('eduViewDetails')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      {activeItem && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.15s ease' }}
          onClick={() => setActiveItem(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#0e1512', border: '1px solid #22332c', borderRadius: '22px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.95)', position: 'relative', animation: 'slideUp 0.2s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Close */}
            <button onClick={() => setActiveItem(null)} style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 10, width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>

            {/* Gallery */}
            <div style={{ borderRadius: '22px 22px 0 0', overflow: 'hidden' }}>
              <ImageGallery images={activeItem.images ?? []} />
            </div>

            {/* Content */}
            <div style={{ padding: '22px 26px 26px' }}>
              {/* Type + Rating */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                {(() => {
                  const cfg = getCfg(activeItem.category);
                  const Icon = cfg.icon;
                  const transCat = getTransCategory(t, activeItem.category);
                  return (
                    <span style={{ background: cfg.bg, border: `1px solid ${cfg.color}55`, color: cfg.color, padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Icon size={12} color={cfg.color} /> {transCat}
                    </span>
                  );
                })()}
                {activeItem.rating && <StarRating rating={activeItem.rating} size={13} />}
                {activeItem.size && (
                  <span style={{ background: '#16201c', border: '1px solid #23332d', color: '#94a3b8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={11} color="#64748b" /> {activeItem.size}
                  </span>
                )}
              </div>

              {/* Title & Institution */}
              <h2 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '4px' }}>
                {activeItem.title}
              </h2>
              <p style={{ color: '#22d3ee', fontSize: '0.88rem', fontWeight: 600, marginBottom: '18px' }}>
                {activeItem.institution}
              </p>

              {/* Info Grid */}
              <div style={{ background: '#131c18', border: '1px solid #1f2e28', borderRadius: '12px', padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{t('eduLocation')}</span>
                  <span style={{ color: '#e2e8f0', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} color="#22d3ee" /> {activeItem.location}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{t('eduFee')}</span>
                  <span style={{ color: '#22d3ee', fontSize: '0.84rem', fontWeight: 700 }}>
                    {activeItem.fee} {activeItem.currency ? `(${activeItem.currency})` : ''}
                  </span>
                </div>
                {activeItem.deadline && (
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{t('eduDeadline')}</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.84rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} color="#f59e0b" /> {activeItem.deadline}
                    </span>
                  </div>
                )}
                {activeItem.contactEmail && (
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{t('eduContact')}</span>
                    <a href={`mailto:${activeItem.contactEmail}`} style={{ color: '#a78bfa', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={11} /> {activeItem.contactEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>{t('eduAbout')}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{activeItem.description}</p>
              </div>

              {/* Actions */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {normalizeUrl(activeItem.websiteUrl) && (
                  <a href={normalizeUrl(activeItem.websiteUrl)!} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '150px', background: '#22d3ee', color: '#091c17', padding: '11px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Globe size={15} /> {t('eduVisitWebsite')} <ExternalLink size={12} />
                  </a>
                )}
                {normalizeUrl(activeItem.facebookUrl) && (
                  <a href={normalizeUrl(activeItem.facebookUrl)!} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '140px', background: '#1877F2', color: '#fff', padding: '11px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                    {t('eduFacebookPage')}
                  </a>
                )}
                {activeItem.contactEmail && (
                  <a href={`mailto:${activeItem.contactEmail}`} style={{ background: '#18241f', border: '1px solid #293d35', color: '#94a3b8', padding: '11px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> {t('eduEmail')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
