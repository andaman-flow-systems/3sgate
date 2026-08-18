'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { sbStaysDB } from '@/lib/supabase-db';
import { staysDB, type StayListing, type AccommodationType } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage, type TranslationKey } from '@/contexts/LanguageContext';
import { BedDouble, MapPin, Star, ExternalLink, Search, SlidersHorizontal, X, Globe, MessageSquare, ChevronLeft, ChevronRight, Mail, Maximize2 } from 'lucide-react';

const ACCOMMODATION_TYPES: AccommodationType[] = [
  'Hotels', 'Apartments', 'Hostels', 'Guesthouses',
  'Shared Rooms', 'Villas & Houses', 'Camping',
  'Short-Term Rentals', 'Long-Term Rentals',
];

// Type badge color map
const TYPE_COLORS: Record<string, string> = {
  'Hotels':             '#D4A017',
  'Apartments':         '#3b82f6',
  'Hostels':            '#22c55e',
  'Guesthouses':        '#f97316',
  'Shared Rooms':       '#a855f7',
  'Villas & Houses':    '#ec4899',
  'Camping':            '#84cc16',
  'Short-Term Rentals': '#06b6d4',
  'Long-Term Rentals':  '#8b5cf6',
};

// Star display
function Stars({ value, size = 12 }: { value?: number; size?: number }) {
  if (!value) return null;
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: full  }).map((_, i) => <Star key={`f${i}`} size={size} color="#D4A017" fill="#D4A017" />)}
      {half && <Star size={size} color="#D4A017" fill="none" />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} size={size} color="#4b5563" fill="none" />)}
      <span style={{ color: '#D4A017', fontSize: '0.8rem', fontWeight: 700, marginLeft: '4px' }}>{value.toFixed(1)}</span>
    </span>
  );
}

// Helper: Normalize external URL & guarantee safety against admin links
function normalizeExternalUrl(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Strict check: Never allow internal admin links
  if (trimmed.includes('/admin') || trimmed.startsWith('/admin')) {
    return null;
  }

  // Prepend https:// if user didn't enter protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

// Derive redirect URL
function getRedirectUrl(stay: StayListing): string {
  const primary = normalizeExternalUrl(stay.externalUrl);
  if (primary) return primary;

  const website = normalizeExternalUrl(stay.websiteUrl);
  if (website) return website;

  const fb = normalizeExternalUrl(stay.facebookUrl);
  if (fb) return fb;

  return 'https://www.facebook.com/share/1BZMe1KVPk/';
}

// ─── Card Component ─────────────────────────────────────────────────────────────
function StayCard({
  stay,
  t,
  onSelect
}: {
  stay: StayListing;
  t: (k: TranslationKey) => string;
  onSelect: (stay: StayListing) => void;
}) {
  const color   = TYPE_COLORS[stay.accommodationType] ?? '#D4A017';
  const thumb   = stay.images?.[0];
  const redirect = getRedirectUrl(stay);

  return (
    <div
      id={`stay-card-${stay.id}`}
      onClick={() => onSelect(stay)}
      style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.25s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = color;
        el.style.transform = 'translateY(-5px)';
        el.style.boxShadow = `0 12px 32px ${color}22`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = '#2a2a2a';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: '200px', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
        {thumb ? (
          <img
            src={thumb}
            alt={stay.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1200, #0d0d0d)' }}>
            <BedDouble size={48} color="#3a3a3a" />
          </div>
        )}

        {/* Photo count indicator */}
        {(stay.images?.length ?? 0) > 1 && (
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <span>🖼</span> {stay.images!.length} {t('stayPhotos')}
          </div>
        )}

        {/* Type badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: `${color}dd`, color: '#000', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {stay.accommodationType}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 2px', lineHeight: 1.3 }}>{stay.title}</h3>
          {stay.companyName && (
            <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: 0 }}>{stay.companyName}</p>
          )}
        </div>

        {stay.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#9ca3af', fontSize: '0.82rem' }}>
            <MapPin size={13} color={color} />
            {stay.location}
          </div>
        )}

        {stay.rating !== undefined && stay.rating > 0 && (
          <Stars value={stay.rating} />
        )}

        {stay.description && (
          <p style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {stay.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {stay.price ? (
            <span style={{ color: color, fontSize: '1.1rem', fontWeight: 800 }}>
              ฿{stay.price.toLocaleString()}<span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 400 }}>{t('perNight')}</span>
            </span>
          ) : (
            <span style={{ color: '#4b5563', fontSize: '0.82rem' }}>—</span>
          )}
        </div>
        <span style={{ color: color, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {t('viewDetails')}
        </span>
      </div>
    </div>
  );
}

// ─── Detail Modal Component ─────────────────────────────────────────────────────
function StayDetailModal({
  stay,
  t,
  onClose
}: {
  stay: StayListing;
  t: (k: TranslationKey) => string;
  onClose: () => void;
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const color = TYPE_COLORS[stay.accommodationType] ?? '#D4A017';
  const images = stay.images && stay.images.length > 0 ? stay.images : [];
  const currentImg = images[activeImgIndex] || images[0];

  const primaryRedirect = normalizeExternalUrl(stay.externalUrl);
  const websiteUrl      = normalizeExternalUrl(stay.websiteUrl);
  const facebookUrl     = normalizeExternalUrl(stay.facebookUrl);

  const prevImg = () => {
    setActiveImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImg = () => {
    setActiveImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '740px',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '20px',
          background: '#111',
          border: '1px solid #2a2a2a',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Full-Size Image Viewer with Carousel / Multi-Image Support */}
        <div style={{ position: 'relative', height: '340px', background: '#0a0a0a', flexShrink: 0 }}>
          {currentImg ? (
            <img
              src={currentImg}
              alt={stay.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BedDouble size={64} color="#333" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', width: '38px', height: '38px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <X size={18} />
          </button>

          {/* Image Navigation Arrows (if > 1 image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImg}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Category Badge overlay */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: `${color}dd`, color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
            {stay.accommodationType}
          </div>

          {/* Image thumbnails bar (all 3 images switcher) */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.75)', padding: '6px 10px', borderRadius: '10px',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)'
            }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  style={{
                    width: '42px', height: '32px', borderRadius: '6px', overflow: 'hidden',
                    border: `2px solid ${activeImgIndex === idx ? color : 'transparent'}`,
                    cursor: 'pointer', opacity: activeImgIndex === idx ? 1 : 0.6,
                    transition: 'all 0.2s',
                  }}
                >
                  <img src={img} alt={`thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px' }}>
                {stay.title}
              </h2>
              {stay.companyName && (
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
                  {stay.companyName}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              {stay.price ? (
                <span style={{ color: color, fontSize: '1.6rem', fontWeight: 900 }}>
                  ฿{stay.price.toLocaleString()}<span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 400 }}>{t('perNight')}</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Quick info badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', background: '#161616', padding: '14px 18px', borderRadius: '12px', border: '1px solid #222' }}>
            {stay.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d1d5db', fontSize: '0.85rem' }}>
                <MapPin size={15} color={color} /> {stay.location}
              </div>
            )}
            {stay.size && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d1d5db', fontSize: '0.85rem' }}>
                <Maximize2 size={15} color="#6b7280" /> {stay.size}
              </div>
            )}
            {stay.rating !== undefined && stay.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stars value={stay.rating} size={14} />
              </div>
            )}
            {stay.contactEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.85rem' }}>
                <Mail size={15} color="#6b7280" /> {stay.contactEmail}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              About this Stay
            </h4>
            <p style={{ color: '#d1d5db', fontSize: '0.92rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
              {stay.description}
            </p>
          </div>

          {/* Action / External Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid #222' }}>
            {/* Primary External / Booking button */}
            {primaryRedirect && (
              <a
                href={primaryRedirect}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${color}, #eab308)`,
                  color: '#000',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 16px ${color}40`,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.01)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
              >
                <ExternalLink size={18} /> {t('visitWebsite')} / Book Direct ↗
              </a>
            )}

            {/* Official Website & Facebook row */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1c1c1c',
                    border: '1px solid #333',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Globe size={15} color="#3b82f6" /> Official Website
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1877f220',
                    border: '1px solid #1877f250',
                    color: '#60a5fa',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <MessageSquare size={15} color="#1877f2" /> Facebook Page
                </a>
              )}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#161616',
                border: '1px solid #2a2a2a',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function StayPage() {
  const { t } = useLanguage();
  const [stays, setStays]             = useState<StayListing[]>([]);
  const [selectedStay, setSelectedStay] = useState<StayListing | null>(null);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState<AccommodationType | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const loadStays = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbStaysDB.getAll();
        setStays(data);
      } else {
        setStays(staysDB.getAll());
      }
    } catch {
      setStays(staysDB.getAll());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStays(); }, [loadStays]);

  const filtered = useMemo(() => {
    let result = stays;
    if (typeFilter !== 'All') result = result.filter(s => s.accommodationType === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.companyName?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [stays, typeFilter, search]);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0d0a1f 0%, #0b0b0b 60%, #0a100d 100%)', borderBottom: '1px solid #2a2a2a', padding: '48px 0 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative glow */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #a855f720, #D4A01720)', border: '1px solid #a855f740', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BedDouble size={26} color="#a855f7" />
            </div>
            <div>
              <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>
                {t('stayPageTitle')}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ width: '24px', height: '2px', background: 'linear-gradient(90deg, #a855f7, #D4A017)', borderRadius: '2px' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4A017' }} />
              </div>
            </div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', maxWidth: '560px', lineHeight: 1.6, margin: '0 0 24px' }}>
            {t('stayPageSubtitle')}
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '460px' }}>
              <Search size={16} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="stay-search"
                type="text"
                placeholder={t('staySearchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '11px 14px 11px 40px', color: '#fff', fontSize: '0.9rem', width: '100%', fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#a855f7'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#333'; }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              id="stay-filter-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '7px', background: showFilters ? '#a855f720' : '#1a1a1a', border: `1px solid ${showFilters ? '#a855f7' : '#333'}`, color: showFilters ? '#a855f7' : '#9ca3af', borderRadius: '10px', padding: '11px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
            >
              <SlidersHorizontal size={15} />
              {t('filter')} {typeFilter !== 'All' && `· ${typeFilter}`}
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '14px 0', animation: 'slideDown 0.2s ease' }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: 600 }}>TYPE:</span>
              {['All', ...ACCOMMODATION_TYPES].map(type => {
                const isActive = typeFilter === type;
                const color = type === 'All' ? '#a855f7' : (TYPE_COLORS[type] ?? '#D4A017');
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type as AccommodationType | 'All')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? color : '#2a2a2a'}`,
                      background: isActive ? `${color}20` : '#111',
                      color: isActive ? color : '#9ca3af',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {type === 'All' ? t('stayAllTypes') : type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container section-sm">
        {/* Stats bar */}
        {!loading && stays.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>
              Showing <strong style={{ color: '#fff' }}>{filtered.length}</strong> of {stays.length} listings
              {typeFilter !== 'All' && <> · filtered by <span style={{ color: TYPE_COLORS[typeFilter] ?? '#D4A017' }}>{typeFilter}</span></>}
            </p>
            {(search || typeFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setTypeFilter('All'); }}
                style={{ background: 'transparent', border: '1px solid #333', color: '#9ca3af', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <X size={12} /> {t('clearFilters')}
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #1e1e1e', borderTop: '3px solid #a855f7', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('loading')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#6b7280' }}>
            <BedDouble size={52} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{t('stayNoListings')}</p>
            <p style={{ fontSize: '0.88rem' }}>{t('stayNoListingsHint')}</p>
          </div>
        ) : (
          /* Cards grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filtered.map(stay => (
              <StayCard
                key={stay.id}
                stay={stay}
                t={t}
                onSelect={setSelectedStay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedStay && (
        <StayDetailModal
          stay={selectedStay}
          t={t}
          onClose={() => setSelectedStay(null)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
