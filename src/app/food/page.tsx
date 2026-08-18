'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbFoodDB } from '@/lib/supabase-db';
import { foodDB, type FoodPlace } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Utensils, MapPin, Star, Phone, Clock, Search, X, PhoneCall } from 'lucide-react';

const CATEGORIES = ['All', 'Thai Cuisine', 'Seafood & BBQ', 'Street Food', 'Shan & Northern', 'Myanmar Cuisine', 'Asian & Japanese', 'Cafés & Drinks', 'Desserts & Bakery'];

export default function FoodPage() {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [filtered, setFiltered] = useState<FoodPlace[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<FoodPlace | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFood = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbFoodDB.getAll();
        setPlaces(data);
        setFiltered(data);
      } else {
        const data = foodDB.getAll();
        setPlaces(data);
        setFiltered(data);
      }
    } catch {
      const data = foodDB.getAll();
      setPlaces(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFood(); }, [loadFood]);

  useEffect(() => {
    let result = places;
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [category, search, places]);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1000 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#f59e0b20',
              border: '1px solid #f59e0b50', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Utensils size={22} color="#f59e0b" />
            </div>
            <h1 style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 800 }}>{t('foodHeroTitle')}</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            {t('foodHeroSub')}
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
              placeholder={t('foodSearchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
                padding: '9px 14px 9px 36px', color: '#fff', fontSize: '0.88rem', width: '100%',
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 12px', borderRadius: '8px',
                  border: `1px solid ${category === cat ? '#f59e0b' : '#2a2a2a'}`,
                  background: category === cat ? '#f59e0b20' : '#111111',
                  color: category === cat ? '#f59e0b' : '#9ca3af',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {cat === 'All' ? t('foodAllCategories') : cat}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filtered.map(place => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                style={{
                  background: '#111111', border: '1px solid #2a2a2a', borderRadius: '14px',
                  overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#f59e0b';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#2a2a2a';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ height: '170px', background: '#1a1a1a', position: 'relative' }}>
                  <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(0,0,0,0.75)', color: '#fbbf24',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #fbbf2440'
                  }}>
                    <Star size={12} fill="#fbbf24" color="#fbbf24" /> {place.rating}
                  </div>
                </div>

                <div style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600, background: '#f59e0b15', padding: '2px 8px', borderRadius: '4px' }}>
                    {place.category}
                  </span>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, margin: '8px 0 4px' }}>{place.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#f59e0b" /> {place.location} · <span style={{ color: '#22c55e', fontWeight: 700 }}>{place.priceRange}</span>
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {place.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('foodNoPlaces')}</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '240px', background: '#1a1a1a' }}>
              <img src={selectedPlace.image} alt={selectedPlace.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedPlace(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}>{selectedPlace.name}</h2>
                  <p style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>{selectedPlace.category} · {selectedPlace.location}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fbbf2420', color: '#fbbf24', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" /> {selectedPlace.rating}
                </div>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedPlace.description}
              </p>

              <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '0.85rem' }}>
                  <MapPin size={16} color="#f59e0b" /> {selectedPlace.address}
                </div>
                {selectedPlace.openHours && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '0.85rem' }}>
                    <Clock size={16} color="#f59e0b" /> {t('foodOpenHours')}: {selectedPlace.openHours}
                  </div>
                )}
                {selectedPlace.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Phone size={16} /> {t('foodPhone')}: {selectedPlace.phone}
                  </div>
                )}
              </div>

              {selectedPlace.phone ? (
                <a
                  href={`tel:${selectedPlace.phone}`}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '10px', background: '#22c55e', color: '#fff',
                    textAlign: 'center', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <PhoneCall size={18} /> {t('foodCallNow')} ({selectedPlace.phone})
                </a>
              ) : (
                <button
                  onClick={() => setSelectedPlace(null)}
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', cursor: 'pointer' }}
                >
                  {t('close')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
