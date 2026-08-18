'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbBannersDB } from '@/lib/supabase-db';
import { bannersDB, type Banner } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react';

const COLOR_OPTIONS = [
  { value: 'gold',   label: 'Gold' },
  { value: 'blue',   label: 'Blue' },
  { value: 'red',    label: 'Red' },
  { value: 'green',  label: 'Green' },
  { value: 'purple', label: 'Purple' },
];

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isEditing, setIsEditing] = useState<Banner | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (configured) {
        const data = await sbBannersDB.getAll();
        setBanners(data);
      } else {
        setBanners(bannersDB.getAll());
      }
    } catch (err) {
      setError((err as Error).message);
      setBanners(bannersDB.getAll());
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      if (configured) {
        await sbBannersDB.update(id, { isActive: !current });
      } else {
        bannersDB.update(id, { isActive: !current });
      }
      showToast(`Banner ${!current ? 'activated' : 'deactivated'}`);
      loadBanners();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      if (configured) {
        await sbBannersDB.delete(id);
      } else {
        bannersDB.delete(id);
      }
      showToast('Banner deleted');
      loadBanners();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data: Omit<Banner, 'id' | 'createdAt'> = {
      text: formData.get('text') as string,
      link: (formData.get('link') as string) || undefined,
      type: formData.get('type') as 'announcement' | 'promo' | 'ad',
      color: formData.get('color') as string,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      if (isEditing) {
        if (configured) {
          await sbBannersDB.update(isEditing.id, data);
        } else {
          bannersDB.update(isEditing.id, data);
        }
        showToast('Banner updated ✓');
      } else {
        if (configured) {
          await sbBannersDB.create(data);
        } else {
          bannersDB.create(data);
        }
        showToast('Banner created ✓');
      }
      setIsEditing(null);
      setIsAdding(false);
      loadBanners();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const COLOR_PREVIEW: Record<string, string> = {
    gold: '#D4A017', blue: '#3b82f6', red: '#ef4444', green: '#22c55e', purple: '#a855f7',
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#16a34a', color: '#fff', padding: '12px 20px',
          borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 4px 24px #00000080',
        }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Ads &amp; Banners</h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            {configured ? `${banners.length} banners in Supabase database` : `${banners.length} banners in local storage`}
          </p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Banner
        </button>
      </div>

      {error && (
        <div style={{
          background: '#2a0a0a', border: '1px solid #ef4444', borderRadius: '10px',
          padding: '14px 18px', marginBottom: '20px', color: '#ef4444',
          display: 'flex', gap: '10px', alignItems: 'center',
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <Loader size={32} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px' }}>Loading banners...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {banners.map(b => (
            <div key={b.id} style={{
              background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px',
              flexWrap: 'wrap',
            }}>
              {/* Colour dot */}
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                background: COLOR_PREVIEW[b.color] ?? '#9ca3af',
              }} />

              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>{b.text}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280' }}>
                  <span>{b.type}</span>
                  {b.link && <span>Link: {b.link}</span>}
                </div>
              </div>

              {/* Actions group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Toggle */}
                <button
                  onClick={() => handleToggle(b.id, b.isActive)}
                  style={{
                    display: 'inline-block', whiteSpace: 'nowrap',
                    padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    background: b.isActive ? '#22c55e20' : '#2a2a2a',
                    color: b.isActive ? '#22c55e' : '#9ca3af',
                  }}
                >
                  {b.isActive ? 'Active' : 'Inactive'}
                </button>

                <button onClick={() => setIsEditing(b)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(b.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>
                {isEditing ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Banner Text</label>
                <input name="text" defaultValue={isEditing?.text} className="input" required />
              </div>
              <div className="form-group">
                <label className="label">Link URL (Optional)</label>
                <input name="link" defaultValue={isEditing?.link} className="input" placeholder="/donate" />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Type</label>
                  <select name="type" defaultValue={isEditing?.type || 'announcement'} className="input">
                    <option value="announcement">Announcement</option>
                    <option value="promo">Promotion</option>
                    <option value="ad">Advertisement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Colour</label>
                  <select name="color" defaultValue={isEditing?.color || 'gold'} className="input">
                    {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="isActive" id="isActiveBanner" defaultChecked={isEditing ? isEditing.isActive : true} />
                <label htmlFor="isActiveBanner" style={{ color: '#fff' }}>Show on website (Active)</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
