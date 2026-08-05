'use client';

import { useState, useEffect } from 'react';
import { foodDB, type FoodPlace } from '@/lib/db';
import { UtensilsCrossed, Star, MapPin, Clock, Phone, Banknote } from 'lucide-react';

export default function FoodPage() {
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPlaces(foodDB.getAll());
  }, []);

  const filtered = places.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #051a0c 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#22c55e20', border: '1px solid #22c55e50', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={22} color="#22c55e" />
            </div>
            <h1 style={{ color: '#22c55e', fontSize: '2rem', fontWeight: 800 }}>Food Guide</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Discover the best Myanmar restaurants, cafes, and food stalls.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Search */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map(place => (
            <div key={place.id} style={{
              background: '#111111',
              border: '1px solid #2a2a2a',
              borderRadius: '14px',
              overflow: 'hidden',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#22c55e';
              el.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#2a2a2a';
              el.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                  color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Star size={13} color="#f5c518" fill="#f5c518" /> {place.rating}
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {place.category}
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '4px 0 8px' }}>
                  {place.name}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
                  {place.description}
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #2a2a2a' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#6b7280" /> {place.address}
                  </p>
                  {place.openHours && (
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="#6b7280" /> {place.openHours}
                    </p>
                  )}
                  {place.phone && (
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} color="#6b7280" /> {place.phone}
                    </p>
                  )}
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Banknote size={14} color="#6b7280" /> Price Range: {place.priceRange}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
            <p>No places found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
