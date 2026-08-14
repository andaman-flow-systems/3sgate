'use client';

import { useState, useEffect } from 'react';
import { galleryDB, type ArtworkItem } from '@/lib/db';

export default function AdminGallery() {
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [isEditing, setIsEditing] = useState<ArtworkItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setArtworks(galleryDB.getAll());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this artwork?')) {
      galleryDB.delete(id);
      setArtworks(galleryDB.getAll());
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const art: Omit<ArtworkItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      forSale: formData.get('forSale') === 'on',
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
    };

    if (isEditing) {
      galleryDB.update(isEditing.id, art);
    } else {
      galleryDB.create(art);
    }

    setArtworks(galleryDB.getAll());
    setIsEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Manage Gallery</h2>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Artwork
        </button>
      </div>

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
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => setIsEditing(a)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(a.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>
              {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Title</label>
                  <input name="title" defaultValue={isEditing?.title} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Artist</label>
                  <input name="artist" defaultValue={isEditing?.artist} className="input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <label className="label">Image URL</label>
                <input name="image" defaultValue={isEditing?.image} className="input" required />
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
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Save Artwork</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
