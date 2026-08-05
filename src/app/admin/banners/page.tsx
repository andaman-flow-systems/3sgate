'use client';

import { useState, useEffect } from 'react';
import { bannersDB, type Banner } from '@/lib/db';

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

  useEffect(() => {
    setBanners(bannersDB.getAll());
  }, []);

  const handleToggle = (id: string, current: boolean) => {
    bannersDB.update(id, { isActive: !current });
    setBanners(bannersDB.getAll());
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this banner?')) {
      bannersDB.delete(id);
      setBanners(bannersDB.getAll());
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Omit<Banner, 'id' | 'createdAt'> = {
      text: formData.get('text') as string,
      link: formData.get('link') as string || undefined,
      type: formData.get('type') as 'announcement' | 'promo' | 'ad',
      color: formData.get('color') as string,
      isActive: formData.get('isActive') === 'on',
    };
    if (isEditing) {
      bannersDB.update(isEditing.id, data);
    } else {
      bannersDB.create(data);
    }
    setBanners(bannersDB.getAll());
    setIsEditing(null);
    setIsAdding(false);
  };

  const COLOR_PREVIEW: Record<string, string> = {
    gold: '#D4A017', blue: '#3b82f6', red: '#ef4444', green: '#22c55e', purple: '#a855f7',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Ads &amp; Banners</h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
            Manage the sliding announcement bar at the top of the website.
          </p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Banner
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {banners.map(b => (
          <div key={b.id} style={{
            background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px',
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            {/* Colour dot */}
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
              background: COLOR_PREVIEW[b.color] ?? '#9ca3af',
            }} />

            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>{b.text}</p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>{b.type}</span>
                {b.link && <span>Link: {b.link}</span>}
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => handleToggle(b.id, b.isActive)}
              style={{
                padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: b.isActive ? '#22c55e20' : '#2a2a2a',
                color: b.isActive ? '#22c55e' : '#9ca3af',
              }}
            >
              {b.isActive ? 'Active' : 'Inactive'}
            </button>

            <button onClick={() => setIsEditing(b)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Edit
            </button>
            <button onClick={() => handleDelete(b.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '560px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>
              {isEditing ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Banner Text</label>
                <input name="text" defaultValue={isEditing?.text} className="input" required />
              </div>
              <div className="form-group">
                <label className="label">Link URL (Optional)</label>
                <input name="link" defaultValue={isEditing?.link} className="input" placeholder="/donate" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <button type="submit" className="btn btn-purple">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
