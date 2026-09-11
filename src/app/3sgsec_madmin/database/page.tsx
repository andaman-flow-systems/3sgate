'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Database, RotateCcw, Cloud, CheckCircle, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface TableMeta {
  key: string;
  label: string;
  supabaseTable?: string;
}

const TABLES: TableMeta[] = [
  { key: '3sg_products',  label: 'Products',                supabaseTable: 'products' },
  { key: '3sg_rentals',   label: 'Rental Spaces',           supabaseTable: 'rentals' },
  { key: '3sg_stays',     label: 'Accommodation (Stays)',   supabaseTable: 'stays' },
  { key: '3sg_education', label: 'Education & Scholarships',supabaseTable: 'education' },
  { key: '3sg_news',      label: 'News Posts',              supabaseTable: 'news' },
  { key: '3sg_gallery',   label: 'Gallery Artworks',        supabaseTable: 'gallery' },
  { key: '3sg_donations', label: 'Donation Records',        supabaseTable: 'donations' },
  { key: '3sg_jobs',      label: 'Job Listings',            supabaseTable: 'jobs' },
  { key: '3sg_food',      label: 'Food Places',             supabaseTable: 'food_places' },
  { key: '3sg_banners',   label: 'Banners',                 supabaseTable: 'banners' },
  { key: '3sg_users',     label: 'Admin Users' },
  { key: '3sg_settings',  label: 'Site Settings' },
  { key: '3sg_stats',     label: 'Visitor Stats' },
  { key: '3sg_seeded',    label: 'Seed Status' },
];

export default function AdminDatabase() {
  const [cleared, setCleared] = useState(false);
  const [cloudCounts, setCloudCounts] = useState<Record<string, number | null>>({});
  const [loadingCloud, setLoadingCloud] = useState(false);
  const configured = isSupabaseConfigured();

  const loadCloudCounts = useCallback(async () => {
    if (!configured) return;
    setLoadingCloud(true);
    const counts: Record<string, number | null> = {};
    for (const t of TABLES) {
      if (!t.supabaseTable) continue;
      try {
        const { count, error } = await supabase
          .from(t.supabaseTable)
          .select('*', { count: 'exact', head: true });
        counts[t.supabaseTable] = error ? null : (count ?? 0);
      } catch {
        counts[t.supabaseTable] = null;
      }
    }
    setCloudCounts(counts);
    setLoadingCloud(false);
  }, [configured]);

  useEffect(() => {
    loadCloudCounts();
  }, [loadCloudCounts]);

  const getLocalCount = (key: string): number => {
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

  const handleClearAllLocal = () => {
    if (typeof window === 'undefined') return;
    if (confirm('WARNING: This will clear local browser cache. Are you sure?')) {
      TABLES.forEach(t => localStorage.removeItem(t.key));
      alert('Local browser storage cleared.');
    }
  };

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Database Overview</h2>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '4px' }}>
            Live status of your database storage and record counts.
          </p>
        </div>
        <button
          onClick={loadCloudCounts}
          disabled={loadingCloud}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#e5e7eb',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 500,
          }}
        >
          <RefreshCw size={14} className={loadingCloud ? 'spin' : ''} />
          Refresh Counts
        </button>
      </div>

      {/* Cloud Status Card */}
      <div style={{
        background: configured ? '#16a34a15' : '#eab30815',
        border: `1px solid ${configured ? '#16a34a50' : '#eab30850'}`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cloud size={24} color={configured ? '#22c55e' : '#eab308'} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                {configured ? 'Supabase Cloud Database Connected' : 'Supabase Not Configured'}
              </span>
              {configured && <CheckCircle size={15} color="#22c55e" />}
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '2px 0 0' }}>
              {configured
                ? 'The public website and admin panel read/write directly to Supabase cloud.'
                : 'Using local browser storage as fallback.'}
            </p>
          </div>
        </div>
        <div style={{
          background: configured ? '#16a34a30' : '#eab30830',
          color: configured ? '#4ade80' : '#fde047',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {configured ? 'LIVE CLOUD ACTIVE' : 'LOCAL FALLBACK'}
        </div>
      </div>

      {cleared && (
        <div style={{ background: '#22c55e15', border: '1px solid #22c55e', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#22c55e', fontSize: '0.9rem' }}>
          Seed flag cleared. Fresh default data loads on next page visit.
        </div>
      )}

      {/* Collections table */}
      <div className="admin-table-wrap" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={16} color="#9ca3af" />
          <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Collections & Row Counts</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#171717', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'left' }}>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a' }}>Collection</th>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a' }}>Target</th>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>
                Supabase (Cloud)
              </th>
              <th style={{ padding: '12px 20px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>
                Local (Browser)
              </th>
            </tr>
          </thead>
          <tbody>
            {TABLES.map(t => {
              const cloudCount = t.supabaseTable ? cloudCounts[t.supabaseTable] : undefined;
              const localCount = getLocalCount(t.key);
              return (
                <tr key={t.key} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 500 }}>{t.label}</td>
                  <td style={{ padding: '14px 20px', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {t.supabaseTable ? `table: ${t.supabaseTable}` : t.key}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {t.supabaseTable ? (
                      cloudCount !== undefined && cloudCount !== null ? (
                        <span style={{ color: '#22c55e', fontWeight: 700 }}>{cloudCount}</span>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{loadingCloud ? '...' : '-'}</span>
                      )
                    ) : (
                      <span style={{ color: '#4b5563', fontSize: '0.8rem' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span style={{ color: '#a855f7', fontWeight: 600 }}>{localCount}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ background: '#111111', border: '1px solid #ef444430', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#1a0a0a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={16} color="#ef4444" />
          <h3 style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 600 }}>Local Storage Management</h3>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 500, marginBottom: '2px' }}>Reset Local Seed Flag</p>
              <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Clears the seed flag in your local browser storage cache.</p>
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
              <p style={{ color: '#fff', fontWeight: 500, marginBottom: '2px' }}>Clear Local Browser Storage</p>
              <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Clears local browser cache for this browser only. Cloud Supabase data remains intact.</p>
            </div>
            <button
              onClick={handleClearAllLocal}
              style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Clear Local Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
