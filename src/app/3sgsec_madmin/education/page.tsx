'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbEducationDB } from '@/lib/supabase-db';
import { educationDB, type EducationPost, type EducationCategory } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  GraduationCap, Plus, Edit2, Trash2, Search, X, Check,
  Copy, Database, AlertCircle, Loader, CheckCircle, MapPin,
  Star, Globe, Mail, School, BookOpen, Laptop, Cpu, Users,
  Mic, Calendar, type LucideIcon,
} from 'lucide-react';
import MultiImageUploadInput from '@/components/admin/MultiImageUploadInput';

// ─── Category Config ───────────────────────────────────────────────────────────
const CATEGORIES: EducationCategory[] = [
  'Schools', 'Learning Centers', 'Online Learning', 'Makerspaces',
  'Courses', 'Workshops', 'Seminars / Talks', 'Events',
];

const CAT_ICON_MAP: Record<EducationCategory, LucideIcon> = {
  'Schools':          School,
  'Learning Centers': BookOpen,
  'Online Learning':  Laptop,
  'Makerspaces':      Cpu,
  'Courses':          GraduationCap,
  'Workshops':        Users,
  'Seminars / Talks': Mic,
  'Events':           Calendar,
};

// ─── SQL Setup Banner ──────────────────────────────────────────────────────────
const SQL_CREATE_TABLE = `-- EduHub Education Directory Table
DROP TABLE IF EXISTS education;
CREATE TABLE IF NOT EXISTS education (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  institution text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Schools',
  images text NOT NULL DEFAULT '[]',
  description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  contact_email text,
  website_url text,
  facebook_url text,
  size text,
  fee text NOT NULL DEFAULT 'Free',
  currency text DEFAULT 'THB',
  rating numeric(2,1),
  deadline text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Anon write education" ON education FOR ALL USING (true);`;

function SqlSetupBanner({ onDismiss }: { onDismiss?: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: 'linear-gradient(135deg, #0d1f1a 0%, #0a2419 100%)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: '12px', padding: '20px 24px', marginBottom: '28px', display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
      <Database size={22} color="#22d3ee" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <p style={{ color: '#22d3ee', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
            EduHub — Supabase Table Setup (Run once in SQL Editor)
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { navigator.clipboard.writeText(SQL_CREATE_TABLE); setCopied(true); setTimeout(() => setCopied(false), 2500); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: copied ? '#22c55e' : '#22d3ee', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied ✓' : 'Copy SQL'}
            </button>
            {onDismiss && (
              <button onClick={onDismiss} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #333', color: '#9ca3af', borderRadius: '6px', padding: '6px 10px', fontSize: '0.78rem', cursor: 'pointer' }}>
                Hide ✕
              </button>
            )}
          </div>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 10px' }}>
          Open <strong>Supabase Dashboard → SQL Editor → New query</strong>, paste the code and click <strong>Run</strong>.
        </p>
        <pre style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '12px', color: '#a78bfa', fontSize: '0.7rem', overflowX: 'auto', lineHeight: 1.5, margin: 0 }}>{SQL_CREATE_TABLE}</pre>
      </div>
    </div>
  );
}

// ─── Star Picker ───────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
        >
          <Star
            size={22}
            fill={i <= (hover || value) ? '#f59e0b' : 'none'}
            stroke={i <= (hover || value) ? '#f59e0b' : '#374151'}
          />
        </button>
      ))}
      {value > 0 && (
        <span style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700, marginLeft: '4px' }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// ─── Form Field Helper ─────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', background: '#181818', border: '1px solid #2e2e2e',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.88rem', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px',
};

// ─── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminEducation() {
  const [items, setItems] = useState<EducationPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<EducationPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [images, setImages] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [showBanner, setShowBanner] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    try { if (localStorage.getItem('3sg_hide_edu_banner') === 'true') setShowBanner(false); } catch {}
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    try { localStorage.setItem('3sg_hide_edu_banner', 'true'); } catch {}
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (configured) { setItems(await sbEducationDB.getAll()); }
      else { setItems(educationDB.getAll()); }
    } catch (err) {
      setError((err as Error).message);
      setItems(educationDB.getAll());
    } finally { setLoading(false); }
  }, [configured]);

  useEffect(() => { loadData(); }, [loadData]);

  const openAdd = () => { setImages([]); setRating(0); setIsAdding(true); };
  const openEdit = (item: EducationPost) => { setImages(item.images ?? []); setRating(item.rating ?? 0); setIsEditing(item); };
  const closeModal = () => { setIsAdding(false); setIsEditing(null); setImages([]); setRating(0); setError(null); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education listing?')) return;
    try {
      if (configured) await sbEducationDB.delete(id); else educationDB.delete(id);
      showToast('Listing deleted'); loadData();
    } catch (err) { setError((err as Error).message); }
  };

  const handleToggleStatus = async (item: EducationPost) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      if (configured) await sbEducationDB.update(item.id, { status: newStatus });
      else educationDB.update(item.id, { status: newStatus });
      showToast(`Status → ${newStatus}`); loadData();
    } catch (err) { setError((err as Error).message); }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSaving(true); setError(null);
    const fd = new FormData(e.currentTarget);

    const postData: Omit<EducationPost, 'id' | 'createdAt'> = {
      title:        (fd.get('title') as string).trim(),
      institution:  (fd.get('institution') as string).trim(),
      category:     fd.get('category') as EducationCategory,
      images:       images.filter(Boolean).slice(0, 3),
      description:  (fd.get('description') as string).trim(),
      location:     (fd.get('location') as string).trim() || 'Online',
      contactEmail: (fd.get('contactEmail') as string).trim() || undefined,
      websiteUrl:   (fd.get('websiteUrl') as string).trim() || undefined,
      facebookUrl:  (fd.get('facebookUrl') as string).trim() || undefined,
      size:         (fd.get('size') as string).trim() || undefined,
      fee:          (fd.get('fee') as string).trim() || 'Free',
      currency:     (fd.get('currency') as EducationPost['currency']) || 'THB',
      rating:       rating > 0 ? rating : undefined,
      deadline:     (fd.get('deadline') as string).trim() || undefined,
      status:       (fd.get('status') as EducationPost['status']) || 'published',
    };

    if (!postData.title || !postData.institution) {
      setError('Title and Organization Name are required.'); setSaving(false); return;
    }

    try {
      if (isEditing) {
        if (configured) await sbEducationDB.update(isEditing.id, postData); else educationDB.update(isEditing.id, postData);
        showToast('Listing updated ✓');
      } else {
        if (configured) await sbEducationDB.create(postData); else educationDB.create(postData);
        showToast('Listing created ✓');
      }
      closeModal(); loadData();
    } catch (err) { setError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleSeedData = async () => {
    if (!confirm('Populate 8 sample EduHub listings?')) return;
    setSaving(true);
    try {
      const samples: Omit<EducationPost, 'id' | 'createdAt'>[] = [
        { title: 'Chiang Mai International School', institution: 'CMIS International Education', category: 'Schools', images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80'], description: 'Fully accredited IB international school, K–12.', location: 'Chiang Mai, Thailand', fee: '฿280,000', currency: 'THB', rating: 4.8, size: 'Large', status: 'published' },
        { title: 'TechBridge Full-Stack & AI Bootcamp', institution: 'TechBridge Digital Academy', category: 'Online Learning', images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'], description: '16-week online coding bootcamp covering React, Next.js & AI.', location: 'Online', fee: 'Free / Sponsored', currency: 'USD', rating: 4.7, size: 'International', status: 'published' },
        { title: 'ASEAN Language Center', institution: 'ASEAN Language & Culture Center', category: 'Learning Centers', images: ['https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80'], description: 'Thai & English business communication courses.', location: 'Chiang Mai & Online', fee: '฿1,500', currency: 'THB', rating: 4.6, size: 'Medium', status: 'published' },
        { title: 'Culinary Arts Certification', institution: 'Mahanakhon Hospitality Institute', category: 'Courses', images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80'], description: '3-month culinary arts & hospitality training.', location: 'Bangkok, Thailand', fee: '฿3,500', currency: 'THB', rating: 4.5, size: 'Local', status: 'published' },
        { title: 'Digital Marketing Workshop', institution: 'Creator & Enterprise Network', category: 'Workshops', images: ['https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80'], description: 'Weekend workshop on TikTok & Facebook marketing.', location: 'Online', fee: 'Free', currency: 'THB', rating: 4.9, size: 'Small', status: 'published' },
        { title: 'AI & Future Tech Seminar Series', institution: 'ASEAN Tech Talks Foundation', category: 'Seminars / Talks', images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'], description: 'Monthly seminars on AI, robotics & blockchain.', location: 'Bangkok & Online', fee: 'Free', currency: 'USD', rating: 4.7, size: 'International', status: 'published' },
        { title: 'Lanna Makerspace Lab', institution: 'Lanna Creative Hub', category: 'Makerspaces', images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'], description: 'Open makerspace with 3D printers, laser cutters & robotics.', location: 'Chiang Mai, Thailand', fee: '฿500', currency: 'THB', rating: 4.8, size: 'Local', status: 'published' },
        { title: 'Regional Education & Skills Expo 2026', institution: 'Southeast Asia Education Council', category: 'Events', images: ['https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=600&q=80'], description: 'Annual education fair with 200+ institutions.', location: 'Bangkok, Thailand', fee: 'Free Entry', currency: 'THB', rating: 4.9, size: 'International', status: 'published' },
      ];
      for (const s of samples) {
        if (configured) await sbEducationDB.create(s); else educationDB.create(s);
      }
      showToast('8 sample listings added ✓'); loadData();
    } catch (err) { setError((err as Error).message); }
    finally { setSaving(false); }
  };

  const filteredItems = items.filter(item => {
    const matchCat = selectedCat === 'All' || item.category === selectedCat;
    const q = search.toLowerCase().trim();
    return matchCat && (!q || item.title.toLowerCase().includes(q) || item.institution.toLowerCase().includes(q) || item.location.toLowerCase().includes(q));
  });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#22c55e', color: '#000', fontWeight: 700, padding: '12px 20px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* SQL Banner */}
      {showBanner && <SqlSetupBanner onDismiss={dismissBanner} />}

      {/* Error */}
      {error && !isAdding && !isEditing && (
        <div style={{ background: '#ef444415', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={24} color="#22d3ee" /> EduHub — Education Directory
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            Manage education listings: schools, courses, workshops, events and more.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {items.length === 0 && (
            <button onClick={handleSeedData} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', border: '1px solid #22d3ee', color: '#22d3ee', borderRadius: '10px', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
              Load Sample Data
            </button>
          )}
          <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)', color: '#000', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,211,238,0.3)' }}>
            <Plus size={16} /> Add Listing
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, padding: '8px 12px 8px 34px', background: '#181818', border: '1px solid #2e2e2e' }} />
        </div>
        <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} style={{ background: '#181818', border: '1px solid #2e2e2e', borderRadius: '8px', padding: '8px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
          <option value="All">All Types ({items.length})</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c} ({items.filter(i => i.category === c).length})</option>
          ))}
        </select>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: items.length, color: '#22d3ee' },
          { label: 'Published', value: items.filter(i => i.status === 'published').length, color: '#22c55e' },
          { label: 'Draft', value: items.filter(i => i.status === 'draft').length, color: '#f59e0b' },
          { label: 'Types', value: CATEGORIES.filter(c => items.some(i => i.category === c)).length, color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#161616', color: '#9ca3af', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #262626' }}>Listing</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #262626' }}>Type</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #262626' }}>Location & Fee</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #262626' }}>Rating</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #262626' }}>Status</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #262626', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px', display: 'block' }} />
                Loading listings...
              </td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No listings found.</td></tr>
            ) : (
              filteredItems.map(item => {
                const CatIcon = (CAT_ICON_MAP as Record<string, LucideIcon>)[item.category] ?? GraduationCap;
                return (
                <tr key={item.id} style={{ borderBottom: '1px solid #1c1c1c', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = '#141414')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {/* Listing */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt="" style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: '#1c1c1c', border: '1px solid #282828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CatIcon size={20} color="#22d3ee" />
                        </div>
                      )}
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>{item.title}</div>
                        <div style={{ color: '#22d3ee', fontSize: '0.75rem' }}>{item.institution}</div>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#1a1a1a', color: '#e2e8f0', border: '1px solid #2a2a2a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <CatIcon size={13} color="#22d3ee" /> {item.category}
                    </span>
                  </td>
                  {/* Location & Fee */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ color: '#d1d5db', fontSize: '0.82rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#6b7280" /> {item.location || 'Online'}
                    </div>
                    <div style={{ color: '#22d3ee', fontSize: '0.75rem', fontWeight: 600 }}>
                      {item.fee} {item.currency ? `(${item.currency})` : ''}
                    </div>
                  </td>
                  {/* Rating */}
                  <td style={{ padding: '14px 16px' }}>
                    {item.rating ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700 }}>
                        <Star size={13} fill="#f59e0b" stroke="#f59e0b" /> {item.rating.toFixed(1)}
                      </span>
                    ) : <span style={{ color: '#4b5563', fontSize: '0.78rem' }}>—</span>}
                  </td>
                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => handleToggleStatus(item)} style={{ background: item.status === 'published' ? '#22c55e18' : '#eab30818', color: item.status === 'published' ? '#22c55e' : '#eab308', border: `1px solid ${item.status === 'published' ? '#22c55e40' : '#eab30840'}`, borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                      {item.status}
                    </button>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => openEdit(item)} style={{ background: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                        <Edit2 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: '#ef444415', border: '1px solid #ef444440', color: '#ef4444', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {(isAdding || isEditing) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '16px', maxWidth: '720px', width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', padding: '28px' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={20} color="#22d3ee" />
                {isEditing ? 'Edit Listing' : 'Add New Listing'}
              </h3>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
            </div>

            {error && (
              <div style={{ background: '#ef444415', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Row: Title + Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input type="text" name="title" required defaultValue={isEditing?.title || ''} placeholder="e.g. Chiang Mai International School" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Type *</label>
                    <select name="category" defaultValue={isEditing?.category || 'Schools'} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Organization Name */}
                <div>
                  <label style={labelStyle}>Company / Organization Name *</label>
                  <input type="text" name="institution" required defaultValue={isEditing?.institution || ''} placeholder="e.g. CMIS International Education" style={inputStyle} />
                </div>

                {/* Images (up to 3) */}
                <div>
                  <label style={labelStyle}>Images (up to 3 — drag &amp; drop or URL)</label>
                  <MultiImageUploadInput values={images} onChange={setImages} />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea name="description" rows={4} defaultValue={isEditing?.description || ''} placeholder="Describe this education organization, course, event or service..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>

                {/* Row: Location + Size */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Location</label>
                    <input type="text" name="location" defaultValue={isEditing?.location || ''} placeholder="e.g. Bangkok, Thailand" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Size / Category (free text)</label>
                    <input type="text" name="size" defaultValue={isEditing?.size || ''} placeholder="Small / Medium / International / Local" style={inputStyle} />
                  </div>
                </div>

                {/* Row: Fee + Currency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>Price / Fee</label>
                    <input type="text" name="fee" defaultValue={isEditing?.fee || ''} placeholder="e.g. ฿3,500 or Free" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Currency</label>
                    <select name="currency" defaultValue={isEditing?.currency || 'THB'} style={{ ...inputStyle, minWidth: '90px', cursor: 'pointer' }}>
                      <option value="THB">฿ THB</option>
                      <option value="USD">$ USD</option>
                      <option value="MMK">K MMK</option>
                    </select>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label style={labelStyle}>Rating (1–5 stars)</label>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                {/* Contact Email */}
                <div>
                  <label style={labelStyle}><Mail size={13} style={{ display: 'inline', marginRight: 4 }} />Contact Email</label>
                  <input type="email" name="contactEmail" defaultValue={isEditing?.contactEmail || ''} placeholder="contact@organization.com" style={inputStyle} />
                </div>

                {/* Website URL */}
                <div>
                  <label style={labelStyle}><Globe size={13} style={{ display: 'inline', marginRight: 4 }} />Website / Page URL</label>
                  <input type="text" name="websiteUrl" defaultValue={isEditing?.websiteUrl || ''} placeholder="https://www.example.com" style={inputStyle} />
                </div>

                {/* Facebook URL */}
                <div>
                  <label style={labelStyle}>Facebook Page URL</label>
                  <input type="text" name="facebookUrl" defaultValue={isEditing?.facebookUrl || ''} placeholder="https://facebook.com/..." style={inputStyle} />
                </div>

                {/* Row: Deadline + Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Deadline (optional)</label>
                    <input type="text" name="deadline" defaultValue={isEditing?.deadline || ''} placeholder="e.g. 30 June 2026" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select name="status" defaultValue={isEditing?.status || 'published'} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="published">✅ Published</option>
                      <option value="draft">⏸️ Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                  <button type="button" onClick={closeModal} style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#9ca3af', borderRadius: '10px', padding: '12px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} style={{ flex: 2, background: saving ? '#0e7490' : 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)', color: '#000', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 800, fontSize: '0.92rem', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(34,211,238,0.25)' }}>
                    {saving ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    {saving ? 'Saving...' : (isEditing ? '💾 Update Listing' : '✨ Create Listing')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
