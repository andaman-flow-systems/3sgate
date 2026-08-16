'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbGalleryDB } from '@/lib/supabase-db';
import { galleryDB, type ArtworkItem } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminGallery() {
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [isEditing, setIsEditing] = useState<ArtworkItem | null>(null);
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

  const loadArtworks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (configured) {
        const data = await sbGalleryDB.getAll();
        setArtworks(data);
      } else {
        setArtworks(galleryDB.getAll());
      }
    } catch (err) {
      setError((err as Error).message);
      setArtworks(galleryDB.getAll());
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  const openAdd = () => {
    setImageUrl('');
    setIsAdding(true);
  };

  const openEdit = (a: ArtworkItem) => {
    setImageUrl(a.image || '');
    setIsEditing(a);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    setImageUrl('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    try {
      if (configured) {
        await sbGalleryDB.delete(id);
      } else {
        galleryDB.delete(id);
      }
      showToast('Artwork deleted');
      loadArtworks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const art: Omit<ArtworkItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      image: imageUrl,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      forSale: formData.get('forSale') === 'on',
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
    };

    if (!art.image) {
      setError('Please upload or select an artwork picture.');
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        if (configured) {
          await sbGalleryDB.update(isEditing.id, art);
        } else {
          galleryDB.update(isEditing.id, art);
        }
        showToast('Artwork updated ✓');
      } else {
        if (configured) {
          await sbGalleryDB.create(art);
        } else {
          galleryDB.create(art);
        }
        showToast('Artwork created ✓');
      }
      closeModal();
      loadArtworks();
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
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Manage Gallery</h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured ? `${artworks.length} artworks in Supabase cloud database` : `${artworks.length} artworks in local browser storage`}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-purple">
          + Add Artwork
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
          <p style={{ marginTop: '12px' }}>Loading gallery artworks...</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Image</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Title / Artist</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Category</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Status</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '16px' }}>
                    <img src={a.image} alt={a.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{a.title}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{a.artist}</p>
                  </td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{a.category}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                      background: '#a855f720', color: '#c084fc'
                    }}>
                      {a.forSale ? `฿${a.price?.toLocaleString()}` : 'Display Only'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(a)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(a.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
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
                {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Title</label>
                  <input name="title" defaultValue={isEditing?.title} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Artist</label>
                  <input name="artist" defaultValue={isEditing?.artist} className="input" required />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Category (e.g. Painting, Digital)</label>
                  <input name="category" defaultValue={isEditing?.category} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Price (฿ THB) - Optional</label>
                  <input name="price" type="number" step="0.01" defaultValue={isEditing?.price} className="input" />
                </div>
              </div>

              <div className="form-group">
                <ImageUploadInput label="Artwork Picture" value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={3} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" name="forSale" defaultChecked={isEditing ? isEditing.forSale : true} id="forSale" />
                <label htmlFor="forSale" style={{ color: '#fff' }}>Item is For Sale</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
