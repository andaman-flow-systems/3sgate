'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbFoodDB } from '@/lib/supabase-db';
import { foodDB, type FoodPlace } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Star, Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminFood() {
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [isEditing, setIsEditing] = useState<FoodPlace | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const configured = isSupabaseConfigured();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (configured) {
        const data = await sbFoodDB.getAll();
        setPlaces(data);
      } else {
        setPlaces(foodDB.getAll());
      }
    } catch (err) {
      setError((err as Error).message);
      setPlaces(foodDB.getAll());
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const openAdd = () => {
    setImageUrl('');
    setIsAdding(true);
  };

  const openEdit = (p: FoodPlace) => {
    setImageUrl(p.image || '');
    setIsEditing(p);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    setImageUrl('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food place?')) return;
    try {
      if (configured) {
        await sbFoodDB.delete(id);
      } else {
        foodDB.delete(id);
      }
      showToast('Food place deleted');
      loadPlaces();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const place: Omit<FoodPlace, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: imageUrl,
      location: formData.get('location') as string,
      address: formData.get('address') as string,
      priceRange: formData.get('priceRange') as '$' | '$$' | '$$$',
      rating: Number(formData.get('rating')),
      openHours: (formData.get('openHours') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
    };

    if (!place.image) {
      setError('Please upload or select a picture for this food place.');
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        if (configured) {
          await sbFoodDB.update(isEditing.id, place);
        } else {
          foodDB.update(isEditing.id, place);
        }
        showToast('Food place updated ✓');
      } else {
        if (configured) {
          await sbFoodDB.create(place);
        } else {
          foodDB.create(place);
        }
        showToast('Food place created ✓');
      }
      closeModal();
      loadPlaces();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
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
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Manage Food Guide</h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured ? `${places.length} places in Supabase cloud database` : `${places.length} places in local browser storage`}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-purple">
          + Add Place
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
          <p style={{ marginTop: '12px' }}>Loading food places...</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Image</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Name / Location</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Category</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Rating</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '16px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{p.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{p.location}</p>
                  </td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{p.category}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: '#f5c518', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} color="#f5c518" fill="#f5c518" /> {p.rating?.toFixed(1) ?? '5.0'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(p)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>
                {isEditing ? 'Edit Place' : 'Add New Place'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Place Name</label>
                  <input name="name" defaultValue={isEditing?.name} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Category</label>
                  <input name="category" defaultValue={isEditing?.category} className="input" placeholder="e.g. Thai Cuisine, Seafood & BBQ" required />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="label">Location (City)</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Price (e.g. $$)</label>
                  <input name="priceRange" defaultValue={isEditing?.priceRange || '$$'} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Rating (1-5)</label>
                  <input name="rating" type="number" step="0.1" min="1" max="5" defaultValue={isEditing?.rating || 5} className="input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Full Address</label>
                <input name="address" defaultValue={isEditing?.address} className="input" required />
              </div>

              <div className="form-group">
                <ImageUploadInput label="Food Place Picture" value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={3} required />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Open Hours (Optional)</label>
                  <input name="openHours" defaultValue={isEditing?.openHours} className="input" />
                </div>
                <div className="form-group">
                  <label className="label">Phone (Optional)</label>
                  <input name="phone" defaultValue={isEditing?.phone} className="input" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
