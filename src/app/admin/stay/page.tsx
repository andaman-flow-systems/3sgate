'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbStaysDB } from '@/lib/supabase-db';
import { staysDB, type StayListing, type AccommodationType } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { BedDouble, AlertCircle, Loader, CheckCircle, X, Star, MapPin, ExternalLink, Copy, Check, Database } from 'lucide-react';
import MultiImageUploadInput from '@/components/admin/MultiImageUploadInput';

const ACCOMMODATION_TYPES: AccommodationType[] = [
  'Hotels', 'Apartments', 'Hostels', 'Guesthouses',
  'Shared Rooms', 'Villas & Houses', 'Camping',
  'Short-Term Rentals', 'Long-Term Rentals',
];

const SQL_CREATE_TABLE = `CREATE TABLE IF NOT EXISTS stays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  company_name text NOT NULL DEFAULT '',
  accommodation_type text NOT NULL DEFAULT 'Hotels',
  images text[] DEFAULT '{}',
  location text NOT NULL DEFAULT '',
  contact_email text,
  description text NOT NULL DEFAULT '',
  size text,
  price numeric,
  rating numeric,
  external_url text,
  website_url text,
  facebook_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stays" ON stays FOR SELECT USING (true);
CREATE POLICY "Anon write stays" ON stays FOR ALL USING (true);`;

// ─── SQL Setup Banner ───────────────────────────────────────────────────────────
function SqlSetupBanner({ showAlways = false }: { showAlways?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(SQL_CREATE_TABLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a0f00 0%, #291800 100%)',
      border: '1px solid #f59e0b',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '28px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      <Database size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
          <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
            Create the &quot;stays&quot; Table in Supabase
          </p>
          <button
            onClick={copySql}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: copied ? '#22c55e' : '#f59e0b',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'SQL Copied ✓' : 'Copy SQL Query'}
          </button>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 12px' }}>
          To save listings permanently in the cloud, open your <strong>Supabase Project → SQL Editor → New query</strong>, paste the code below and click <strong>Run</strong>. (Local storage is currently active as a temporary fallback).
        </p>
        <pre style={{
          background: '#0d0d0d',
          border: '1px solid #2a2a2a',
          borderRadius: '8px',
          padding: '12px',
          color: '#a78bfa',
          fontSize: '0.72rem',
          overflowX: 'auto',
          lineHeight: 1.5,
          margin: 0,
        }}>{SQL_CREATE_TABLE}</pre>
      </div>
    </div>
  );
}

// ─── Star Rating Display ────────────────────────────────────────────────────────
function StarRating({ value }: { value?: number }) {
  if (!value) return <span style={{ color: '#4b5563', fontSize: '0.78rem' }}>—</span>;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      <Star size={13} color="#D4A017" fill="#D4A017" />
      <span style={{ color: '#D4A017', fontSize: '0.82rem', fontWeight: 700 }}>{value.toFixed(1)}</span>
    </span>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export default function AdminStay() {
  const [stays, setStays]         = useState<StayListing[]>([]);
  const [isEditing, setIsEditing] = useState<StayListing | null>(null);
  const [isAdding, setIsAdding]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [images, setImages]       = useState<string[]>([]);
  const [tableMissing, setTableMissing] = useState(false);

  const configured = isSupabaseConfigured();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const loadStays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (configured) {
        const data = await sbStaysDB.getAll();
        setStays(data);
        setTableMissing(false);
      } else {
        setStays(staysDB.getAll());
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('schema cache') || msg.includes('stays')) {
        setTableMissing(true);
      }
      // Fallback to local DB so page never crashes
      setStays(staysDB.getAll());
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => { loadStays(); }, [loadStays]);

  const openAdd = () => { setImages([]); setIsAdding(true); setError(null); };
  const openEdit = (s: StayListing) => { setImages(s.images ?? []); setIsEditing(s); setError(null); };
  const closeModal = () => { setIsAdding(false); setIsEditing(null); setImages([]); setError(null); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try {
      if (configured && !tableMissing) {
        await sbStaysDB.delete(id);
      } else {
        staysDB.delete(id);
      }
      showToast('Listing deleted ✓');
      loadStays();
    } catch (err: any) {
      staysDB.delete(id);
      showToast('Listing deleted (local) ✓');
      loadStays();
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const f = new FormData(e.currentTarget);

    const validImages = images.filter(Boolean);

    const formatUrl = (raw: string | null): string | undefined => {
      if (!raw) return undefined;
      const t = raw.trim();
      if (!t) return undefined;
      if (!/^https?:\/\//i.test(t)) return `https://${t}`;
      return t;
    };

    const rawExt = (f.get('externalUrl') as string).trim();
    const rawWeb = (f.get('websiteUrl') as string).trim();
    const rawFb  = (f.get('facebookUrl') as string).trim();

    if (rawExt.includes('/admin') || rawWeb.includes('/admin') || rawFb.includes('/admin')) {
      setError('External URLs cannot point to the admin panel (/admin). Please provide a real booking link, website, or Facebook page.');
      setSaving(false);
      return;
    }

    const payload: Omit<StayListing, 'id' | 'createdAt'> = {
      title:              (f.get('title') as string).trim(),
      companyName:        (f.get('companyName') as string).trim(),
      accommodationType:  f.get('accommodationType') as AccommodationType,
      images:             validImages,
      location:           (f.get('location') as string).trim(),
      contactEmail:       (f.get('contactEmail') as string).trim() || undefined,
      description:        (f.get('description') as string).trim(),
      size:               (f.get('size') as string).trim() || undefined,
      price:              f.get('price') ? Number(f.get('price')) : undefined,
      rating:             f.get('rating') ? Number(f.get('rating')) : undefined,
      externalUrl:        formatUrl(rawExt),
      websiteUrl:         formatUrl(rawWeb),
      facebookUrl:        formatUrl(rawFb),
    };

    if (!payload.title) { setError('Title is required.'); setSaving(false); return; }

    try {
      if (configured && !tableMissing) {
        if (isEditing) {
          await sbStaysDB.update(isEditing.id, payload);
          showToast('Listing updated in Supabase ✓');
        } else {
          await sbStaysDB.create(payload);
          showToast('Listing created in Supabase ✓');
        }
      } else {
        // Fallback to local storage
        if (isEditing) {
          staysDB.update(isEditing.id, payload);
          showToast('Listing updated locally ✓');
        } else {
          staysDB.create(payload);
          showToast('Listing created locally ✓');
        }
      }
      closeModal();
      loadStays();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('schema cache') || msg.includes('stays')) {
        setTableMissing(true);
        // Save to local storage as fallback so user work is never lost
        if (isEditing) {
          staysDB.update(isEditing.id, payload);
          showToast('Saved locally (Run SQL to enable cloud sync) ✓');
        } else {
          staysDB.create(payload);
          showToast('Saved locally (Run SQL to enable cloud sync) ✓');
        }
        closeModal();
        loadStays();
      } else {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#16a34a', color: '#fff', padding: '12px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 24px #00000080', animation: 'fadeIn 0.2s ease' }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Manage Stay Listings</h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured
              ? `${stays.length} listing${stays.length !== 1 ? 's' : ''} ${tableMissing ? '(Local Mode - Run SQL to sync to cloud)' : 'in Supabase cloud database'}`
              : 'Connect Supabase to enable cloud storage'}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-purple" disabled={loading}>
          + Add Listing
        </button>
      </div>

      {/* SQL Setup Banner if table missing or Supabase not configured */}
      {(tableMissing || !configured) && <SqlSetupBanner />}

      {/* Error banner */}
      {error && !isAdding && !isEditing && (
        <div style={{ background: '#2a0a0a', border: '1px solid #ef4444', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#ef4444', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader size={32} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading stay listings…</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          {stays.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
              <BedDouble size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p>No listings yet. Click <strong style={{ color: '#a78bfa' }}>+ Add Listing</strong> to get started.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Image</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Title</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Type</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Location</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Price</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Rating</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stays.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '14px 16px' }}>
                      {s.images?.[0] ? (
                        <img src={s.images[0]} alt={s.title} style={{ width: '52px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #2a2a2a' }} />
                      ) : (
                        <div style={{ width: '52px', height: '40px', borderRadius: '6px', border: '1px solid #2a2a2a', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BedDouble size={18} color="#4b5563" />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{s.title}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>{s.companyName}</p>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#D4A01718', border: '1px solid #D4A01740', color: '#D4A017', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        {s.accommodationType}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {s.location || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#a78bfa', fontWeight: 600, fontSize: '0.88rem' }}>
                      {s.price ? `฿${s.price.toLocaleString()}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StarRating value={s.rating} />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {s.externalUrl && (
                          <a href={s.externalUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#111', border: '1px solid #333', color: '#6b7280', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }} title="Open external link">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button onClick={() => openEdit(s)} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                        <button onClick={() => handleDelete(s.id)} style={{ background: '#ef444415', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>{isEditing ? 'Edit Listing' : 'Add Stay Listing'}</h2>
              <button type="button" onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '24px' }}>
              {tableMissing ? 'Saved to local database (Run SQL to sync to cloud)' : 'Saved directly to Supabase cloud database'}
            </p>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Title + Company */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Title *</label>
                  <input name="title" defaultValue={isEditing?.title} className="input" required placeholder="e.g. Sunset Beach Villa" />
                </div>
                <div className="form-group">
                  <label className="label">Company Name *</label>
                  <input name="companyName" defaultValue={isEditing?.companyName} className="input" required placeholder="e.g. Ocean Resorts Co." />
                </div>
              </div>

              {/* Accommodation Type */}
              <div className="form-group">
                <label className="label">Accommodation Type *</label>
                <select name="accommodationType" defaultValue={isEditing?.accommodationType ?? 'Hotels'} className="input" required style={{ appearance: 'auto' }}>
                  {ACCOMMODATION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Images — Multi upload (max 3) */}
              <MultiImageUploadInput values={images} onChange={setImages} />

              {/* Location + Contact Email */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Location</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" placeholder="e.g. Yangon, Myanmar" />
                </div>
                <div className="form-group">
                  <label className="label">Contact Email</label>
                  <input name="contactEmail" type="email" defaultValue={isEditing?.contactEmail} className="input" placeholder="contact@example.com" />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="label">Description *</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={4} required placeholder="Describe the accommodation…" />
              </div>

              {/* Size / Category + Price + Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="label">Size / Category</label>
                  <input name="size" defaultValue={isEditing?.size} className="input" placeholder="e.g. Studio, 2BR" />
                </div>
                <div className="form-group">
                  <label className="label">Price (฿ THB)</label>
                  <input name="price" type="number" step="1" min="0" defaultValue={isEditing?.price} className="input" placeholder="e.g. 1200" />
                </div>
                <div className="form-group">
                  <label className="label">Rating (0–5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={isEditing?.rating} className="input" placeholder="e.g. 4.5" />
                </div>
              </div>

              {/* External URLs */}
              <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
                  🔗 External Links — users clicking the card will be redirected to the first URL provided
                </p>
                <div className="form-group">
                  <label className="label">External / Booking URL (primary redirect)</label>
                  <input name="externalUrl" defaultValue={isEditing?.externalUrl} className="input" placeholder="https://booking.example.com/property" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="label">Official Website URL</label>
                    <input name="websiteUrl" defaultValue={isEditing?.websiteUrl} className="input" placeholder="https://www.example.com" />
                  </div>
                  <div className="form-group">
                    <label className="label">Facebook Page URL</label>
                    <input name="facebookUrl" defaultValue={isEditing?.facebookUrl} className="input" placeholder="https://facebook.com/yourpage" />
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving…' : isEditing ? 'Update Listing' : 'Add Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
