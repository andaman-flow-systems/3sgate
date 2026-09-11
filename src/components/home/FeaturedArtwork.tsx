'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sbGalleryDB } from '@/lib/supabase-db';
import { galleryDB, type ArtworkItem } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturedArtwork() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ArtworkItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (isSupabaseConfigured()) {
          const data = await sbGalleryDB.getAll();
          setItems(data.slice(0, 4));
        } else {
          setItems(galleryDB.getAll().slice(0, 4));
        }
      } catch {
        if (!isSupabaseConfigured()) {
          setItems(galleryDB.getAll().slice(0, 4));
        } else {
          setItems([]);
        }
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="section-header">
        <span className="section-title" style={{ color: '#a855f7' }}>{t('featuredArtwork')}</span>
        <Link href="/gallery" className="view-all">{t('viewAll')}</Link>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '28px 0', textAlign: 'center', color: '#6b7280', fontSize: '0.82rem' }}>
          {t('galleryNoArtworks')}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          {items.map((art) => (
            <Link key={art.id} href="/gallery" style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#111111',
                border: '1px solid #2a2a2a',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#a855f7';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#2a2a2a';
                el.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ height: '80px', overflow: 'hidden' }}>
                  <img
                    src={art.image}
                    alt={art.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '8px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                    {art.title}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: '#6b7280' }}>
                    {t('artist')}: {art.artist}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
