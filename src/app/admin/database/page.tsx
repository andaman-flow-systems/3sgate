'use client';

import { useState } from 'react';
import { AlertTriangle, Database, RotateCcw } from 'lucide-react';

const KEYS = [
  '3sg_products', '3sg_rentals', '3sg_news', '3sg_gallery',
  '3sg_donations', '3sg_jobs', '3sg_food', '3sg_banners',
  '3sg_users', '3sg_settings', '3sg_stats', '3sg_seeded',
];

const KEY_LABELS: Record<string, string> = {
  '3sg_products': 'Products',
  '3sg_rentals': 'Rental Spaces',
  '3sg_news': 'News Posts',
  '3sg_gallery': 'Gallery Artworks',
  '3sg_donations': 'Donation Records',
  '3sg_jobs': 'Job Listings',
  '3sg_food': 'Food Places',
  '3sg_banners': 'Banners',
  '3sg_users': 'Admin Users',
  '3sg_settings': 'Site Settings',
  '3sg_stats': 'Visitor Stats',
  '3sg_seeded': 'Seed Status',
};

export default function AdminDatabase() {
  const [cleared, setCleared] = useState(false);

  const getCount = (key: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 1;
    } catch { return 0; }
  };

  const handleClearSeed = () => {
    if (typeof window === 'undefined') return;
    if (confirm('This will reset the seed flag so fresh data is loaded on next visit. Continue?')) {
      localStorage.removeItem('3sg_seeded');
      setCleared(true);
    }
  };

  const handleClearAll = () => {
    if (typeof window === 'undefined') return;
    if (confirm('WARNING: This will delete ALL data from the database. This cannot be undone. Are you absolutely sure?')) {
      KEYS.forEach(k => localStorage.removeItem(k));
      alert('All data cleared. Refresh the page to re-seed with default data.');
    }
  };

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Database Overview</h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '4px' }}>
          View and manage the local browser database (localStorage).
        </p>
      </div>

      {cleared && (
        <div style={{ background: '#22c55e15', border: '1px solid #22c55e', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#22c55e', fontSize: '0.9rem' }}>
          Seed flag cleared. Refresh the page to reload default data.
        </div>
      )}

      {/* Collections table */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={16} color="#9ca3af" />
          <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Collections</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#171717', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'left' }}>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a' }}>Collection</th>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a' }}>Storage Key</th>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Records</th>
            </tr>
          </thead>
          <tbody>
            {KEYS.map(k => (
              <tr key={k} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 500 }}>{KEY_LABELS[k]}</td>
                <td style={{ padding: '14px 20px', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.82rem' }}>{k}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ color: '#a855f7', fontWeight: 700 }}>{getCount(k)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ background: '#111111', border: '1px solid #ef444430', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#1a0a0a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={16} color="#ef4444" />
          <h3 style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 600 }}>Danger Zone</h3>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 500, marginBottom: '2px' }}>Reset to Default Data</p>
              <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Clears the seed flag. Fresh default data loads on next page visit.</p>
            </div>
            <button
              onClick={handleClearSeed}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D4A01720', border: '1px solid #D4A017', color: '#D4A017', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset Seed
            </button>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 500, marginBottom: '2px' }}>Delete All Data</p>
              <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Permanently deletes every record in every collection. Cannot be undone.</p>
            </div>
            <button
              onClick={handleClearAll}
              style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
