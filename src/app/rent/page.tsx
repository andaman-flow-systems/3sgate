'use client';

import { useState, useEffect } from 'react';
import { rentalsDB, type RentalSpace } from '@/lib/db';
import { Building2, ClipboardList, MapPin, Lock, ExternalLink } from 'lucide-react';

export default function RentPage() {
  const [spaces, setSpaces] = useState<RentalSpace[]>([]);

  useEffect(() => {
    setSpaces(rentalsDB.getAll());
  }, []);

  const available = spaces.filter(s => s.isAvailable);
  const rented = spaces.filter(s => !s.isAvailable);

  return (
    <div>
      {/* Page Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1200 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#D4A01720', border: '1px solid #D4A01750', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color="#D4A017" />
            </div>
            <h1 style={{ color: '#D4A017', fontSize: '2rem', fontWeight: 800 }}>Business Directory</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Discover verified shop rentals, local businesses, and community services. Click any listing or "Contact Owner" to connect directly with the owner.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Notice */}
        <div style={{
          background: '#1a1000',
          border: '1px solid #D4A01730',
          borderLeft: '4px solid #D4A017',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}>
          <ClipboardList size={20} color="#D4A017" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#D4A017', marginBottom: '4px', fontSize: '0.92rem' }}>Direct Owner Contacts</h4>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>
              All listings published by administrators connect you <strong style={{ color: '#fff' }}>directly to the business owner's profile</strong> without intermediaries.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '32px',
        }}>
          {[
            { label: 'Total Listings', value: spaces.length, color: '#D4A017' },
            { label: 'Available Spaces', value: available.length, color: '#22c55e' },
            { label: 'Occupied / Rented', value: rented.length, color: '#38bdf8' },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#111111', border: '1px solid #2a2a2a',
              borderRadius: '12px', padding: '20px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {spaces.map((space) => {
            const targetLink = space.ownerUrl || 'https://www.facebook.com/share/1JAoQ7KMHx/';
            return (
              <div
                key={space.id}
                style={{
                  background: '#111111',
                  border: `1px solid ${space.isAvailable ? '#22c55e40' : '#2a2a2a'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <a
                  href={targetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block', height: '160px', overflow: 'hidden', position: 'relative' }}
                >
                  <img src={space.image} alt={space.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: space.isAvailable ? '#22c55e' : '#3b82f6',
                    color: '#fff', padding: '3px 10px', borderRadius: '6px',
                    fontSize: '0.72rem', fontWeight: 700,
                  }}>
                    {space.isAvailable ? 'AVAILABLE' : 'RENTED'}
                  </div>
                </a>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <a
                      href={targetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
                        {space.name}
                      </h3>
                    </a>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#6b7280" /> {space.location} · {space.size}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '14px' }}>
                      {space.description}
                    </p>
                    {!space.isAvailable && space.renterName && (
                      <p style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} color="#6b7280" /> Occupied by: <span style={{ color: '#9ca3af' }}>{space.renterName}</span>
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', pt: '12px', borderTop: '1px solid #1a1a1a' }}>
                    <span style={{ color: '#D4A017', fontSize: '1rem', fontWeight: 700 }}>
                      ฿{space.price.toLocaleString()}/mo
                    </span>
                    <a
                      href={targetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#22c55e',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'Inter,sans-serif',
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <ExternalLink size={13} color="#000" />
                      Contact Owner
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
