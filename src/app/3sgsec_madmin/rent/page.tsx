'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbRentalsDB } from '@/lib/supabase-db';
import { rentalsDB, type RentalSpace } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminRent() {
  const [spaces, setSpaces] = useState<RentalSpace[]>([]);
  const [isEditing, setIsEditing] = useState<RentalSpace | null>(null);
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

  const loadSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (configured) {
        const data = await sbRentalsDB.getAll();
        setSpaces(data);
      } else {
        setSpaces(rentalsDB.getAll());
      }
    } catch (err) {
      setError((err as Error).message);
      setSpaces(rentalsDB.getAll());
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  const openAdd = () => {
    setImageUrl('');
    setIsAdding(true);
  };

  const openEdit = (s: RentalSpace) => {
    setImageUrl(s.image || '');
    setIsEditing(s);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    setImageUrl('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this space/listing?')) return;
    try {
      if (configured) {
        await sbRentalsDB.delete(id);
      } else {
        rentalsDB.delete(id);
      }
      showToast('Listing deleted');
      loadSpaces();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const space: Omit<RentalSpace, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      image: imageUrl,
      location: formData.get('location') as string,
      size: formData.get('size') as string,
      isAvailable: formData.get('isAvailable') === 'on',
      renterName: (formData.get('renterName') as string) || undefined,
      ownerUrl: (formData.get('ownerUrl') as string) || 'https://www.facebook.com/share/1BZMe1KVPk/',
    };

    if (!space.image) {
      setError('Please upload or select an image for this space listing.');
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        if (configured) {
          await sbRentalsDB.update(isEditing.id, space);
        } else {
          rentalsDB.update(isEditing.id, space);
        }
        showToast('Listing updated ✓');
      } else {
        if (configured) {
          await sbRentalsDB.create(space);
        } else {
          rentalsDB.create(space);
        }
        showToast('Listing added ✓');
      }
      closeModal();
      loadSpaces();
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
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Manage Business Directory</h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured ? `${spaces.length} listings in Supabase cloud database` : `${spaces.length} listings in local browser storage`}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-purple">
          + Add Listing
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
          <p style={{ marginTop: '12px' }}>Loading business listings...</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Image</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Name / Location</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Size / Category</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Price/mo</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Owner Link</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Status</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {spaces.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '16px' }}>
                    <img src={s.image} alt={s.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{s.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{s.location}</p>
                  </td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{s.size}</td>
                  <td style={{ padding: '16px', color: '#fff' }}>฿{s.price.toLocaleString()}/mo</td>
                  <td style={{ padding: '16px', color: '#38bdf8', fontSize: '0.8rem' }}>
                    {s.ownerUrl ? (
                      <a href={s.ownerUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                        View Link →
                      </a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', whiteSpace: 'nowrap',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                      background: s.isAvailable ? '#22c55e20' : '#ef444420',
                      color: s.isAvailable ? '#22c55e' : '#ef4444',
                      border: `1px solid ${s.isAvailable ? '#22c55e40' : '#ef444440'}`,
                    }}>
                      {s.isAvailable ? 'Available' : 'Rented'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(s)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
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
                {isEditing ? 'Edit Listing' : 'Add New Business Listing'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Business / Space Name</label>
                <input name="name" defaultValue={isEditing?.name} className="input" required />
              </div>
              
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Location</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Size / Category</label>
                  <input name="size" defaultValue={isEditing?.size} className="input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Price per Month (฿ THB)</label>
                <input name="price" type="number" step="0.01" defaultValue={isEditing?.price} className="input" required />
              </div>

              <div className="form-group">
                <ImageUploadInput label="Space / Listing Picture" value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="form-group">
                <label className="label">Owner / Contact Redirect URL</label>
                <input
                  name="ownerUrl"
                  defaultValue={isEditing?.ownerUrl || 'https://www.facebook.com/share/1BZMe1KVPk/'}
                  className="input"
                  placeholder="https://facebook.com/your-profile-or-page"
                  required
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Users who click the listing or "Contact Owner" will be redirected directly to this URL.
                </span>
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={3} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" name="isAvailable" defaultChecked={isEditing ? isEditing.isAvailable : true} id="isAvailable" />
                <label htmlFor="isAvailable" style={{ color: '#fff' }}>Space / Listing is Available</label>
              </div>

              <div className="form-group">
                <label className="label">Owner / Renter Name (Optional)</label>
                <input name="renterName" defaultValue={isEditing?.renterName} className="input" placeholder="Owner or Renter name" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
