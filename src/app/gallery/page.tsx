'use client';

import { useState, useEffect } from 'react';
import { galleryDB, type ArtworkItem } from '@/lib/db';
import { Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [selected, setSelected] = useState<ArtworkItem | null>(null);

  useEffect(() => {
    setArtworks(galleryDB.getAll());
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #18052a 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#a855f720', border: '1px solid #a855f750', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Palette size={22} color="#a855f7" />
            </div>
            <h1 style={{ color: '#a855f7', fontSize: '2rem', fontWeight: 800 }}>{t('galleryHeroTitle')}</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            {t('galleryHeroSub')}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Masonry Grid */}
        <div className="gallery-masonry">
          {artworks.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelected(art)}
              style={{
                breakInside: 'avoid',
                marginBottom: '20px',
                background: '#111111',
                border: '1px solid #2a2a2a',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-4px)';
                el.style.borderColor = '#a855f7';
                el.style.boxShadow = '0 8px 30px rgba(168,85,247,0.15)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = '#2a2a2a';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={art.image}
                  alt={art.title}
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                />
                {art.forSale && art.price && (
                  <div style={{
                    position: 'absolute', bottom: '10px', right: '10px',
                    background: '#a855f7', color: '#fff',
                    padding: '4px 10px', borderRadius: '6px',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    ฿{art.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <span style={{ color: '#a855f7', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  {art.category}
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, margin: '4px 0' }}>
                  {art.title}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
                  {t('artist')}: {art.artist}
                </p>
              </div>
            </div>
          ))}
        </div>

        {artworks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('galleryNoArtworks')}</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
          style={{ padding: '40px' }}
        >
          <div
            className="modal"
            style={{ maxWidth: '800px', padding: 0, background: 'transparent', border: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'rgba(0,0,0,0.5)', border: '1px solid #444',
                  color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
                  cursor: 'pointer', fontSize: '1.2rem',
                }}
              >×</button>
            </div>
            <div className="lightbox-content" style={{
              background: '#111111', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid #2a2a2a',
            }}>
              <div style={{ flex: '1.5', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selected.image} alt={selected.title} style={{ maxHeight: '70vh', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: '1', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  {selected.category}
                </span>
                <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                  {selected.title}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px' }}>
                  {t('artist')}: <span style={{ color: '#fff', fontWeight: 600 }}>{selected.artist}</span>
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
                  {selected.description}
                </p>
                
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #2a2a2a' }}>
                  {selected.forSale && selected.price && (
                    <p style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>
                      ฿{selected.price.toLocaleString()}
                    </p>
                  )}
                  <a
                    href="https://www.facebook.com/share/1BZMe1KVPk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#1877f2',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif',
                      textDecoration: 'none',
                      transition: 'background 0.2s, transform 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = '#1464d8';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = '#1877f2';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                    {t('galleryBuyInquire')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
