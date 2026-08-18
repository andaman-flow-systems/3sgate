'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbRentalsDB } from '@/lib/supabase-db';
import { rentalsDB, type RentalSpace } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, MapPin, Maximize2, ExternalLink, Search, X } from 'lucide-react';

export default function RentPage() {
  const { t } = useLanguage();
  const [spaces, setSpaces] = useState<RentalSpace[]>([]);
  const [filtered, setFiltered] = useState<RentalSpace[]>([]);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState<'all' | 'available' | 'rented'>('all');
  const [selectedSpace, setSelectedSpace] = useState<RentalSpace | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSpaces = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbRentalsDB.getAll();
        setSpaces(data);
        setFiltered(data);
      } else {
        const data = rentalsDB.getAll();
        setSpaces(data);
        setFiltered(data);
      }
    } catch {
      const data = rentalsDB.getAll();
      setSpaces(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSpaces(); }, [loadSpaces]);

  useEffect(() => {
    let result = spaces;
    if (availability === 'available') result = result.filter(s => s.isAvailable);
    if (availability === 'rented') result = result.filter(s => !s.isAvailable);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, availability, spaces]);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#0284c720',
              border: '1px solid #0284c750', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Building size={22} color="#0284c7" />
            </div>
            <h1 style={{ color: '#0284c7', fontSize: '2rem', fontWeight: 800 }}>{t('rentHeroTitle')}</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            {t('rentHeroSub')}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filters */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          flexWrap: 'wrap', marginBottom: '28px', justifyContent: 'space-between'
        }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={t('rentSearchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
                padding: '9px 14px 9px 36px', color: '#fff', fontSize: '0.88rem', width: '100%',
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'all', label: t('rentTabAll') },
              { id: 'available', label: t('rentTabAvailable') },
              { id: 'rented', label: t('rentTabRented') },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAvailability(tab.id as typeof availability)}
                style={{
                  padding: '8px 14px', borderRadius: '8px',
                  border: `1px solid ${availability === tab.id ? '#0284c7' : '#2a2a2a'}`,
                  background: availability === tab.id ? '#0284c720' : '#111111',
                  color: availability === tab.id ? '#0284c7' : '#9ca3af',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('loading')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filtered.map(space => (
              <div
                key={space.id}
                onClick={() => setSelectedSpace(space)}
                style={{
                  background: '#111111', border: '1px solid #2a2a2a', borderRadius: '14px',
                  overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#0284c7';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#2a2a2a';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ height: '180px', background: '#1a1a1a', position: 'relative' }}>
                  <img src={space.image} alt={space.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: space.isAvailable ? '#22c55e' : '#ef4444',
                    color: '#fff', padding: '4px 10px', borderRadius: '20px',
                    fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase'
                  }}>
                    {space.isAvailable ? t('available') : t('rented')}
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>{space.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#0284c7" /> {space.location} · <Maximize2 size={12} color="#6b7280" /> {space.size}
                  </p>

                  <p style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {space.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#0284c7', fontSize: '1.2rem', fontWeight: 800 }}>
                      ฿{space.price.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9ca3af' }}>{t('perMonth')}</span>
                    </span>
                    <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>{t('viewDetails')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('rentNoSpaces')}</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSpace && (
        <div className="modal-overlay" onClick={() => setSelectedSpace(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '260px', background: '#1a1a1a' }}>
              <img src={selectedSpace.image} alt={selectedSpace.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedSpace(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}>{selectedSpace.name}</h2>
                  <p style={{ color: '#0284c7', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={14} /> {selectedSpace.location} · {selectedSpace.size}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#0284c7', fontSize: '1.4rem', fontWeight: 800 }}>฿{selectedSpace.price.toLocaleString()}</span>
                  <span style={{ display: 'block', color: '#6b7280', fontSize: '0.75rem' }}>{t('perMonth')}</span>
                </div>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedSpace.description}
              </p>

              <a
                href={selectedSpace.ownerUrl || "https://www.facebook.com/share/1BZMe1KVPk/"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%', padding: '14px', borderRadius: '10px', background: '#0284c7', color: '#fff',
                  textAlign: 'center', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <ExternalLink size={18} /> {t('rentContactOwner')}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
