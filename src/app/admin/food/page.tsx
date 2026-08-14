'use client';

import { useState, useEffect } from 'react';
import { foodDB, type FoodPlace } from '@/lib/db';
import { Star } from 'lucide-react';

export default function AdminFood() {
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [isEditing, setIsEditing] = useState<FoodPlace | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setPlaces(foodDB.getAll());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this food place?')) {
      foodDB.delete(id);
      setPlaces(foodDB.getAll());
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const place: Omit<FoodPlace, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      location: formData.get('location') as string,
      address: formData.get('address') as string,
      priceRange: formData.get('priceRange') as '$' | '$$' | '$$$',
      rating: Number(formData.get('rating')),
      openHours: formData.get('openHours') as string || undefined,
      phone: formData.get('phone') as string || undefined,
    };

    if (isEditing) {
      foodDB.update(isEditing.id, place);
    } else {
      foodDB.create(place);
    }

    setPlaces(foodDB.getAll());
    setIsEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Manage Food Guide</h2>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Place
        </button>
      </div>

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
                    <Star size={13} color="#f5c518" fill="#f5c518" /> {p.rating.toFixed(1)}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => setIsEditing(p)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
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
              {isEditing ? 'Edit Place' : 'Add New Place'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="label">Place Name</label>
                  <input name="name" defaultValue={isEditing?.name} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Category</label>
                  <input name="category" defaultValue={isEditing?.category} className="input" placeholder="e.g. Myanmar Cuisine" required />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="label">Location (City)</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Price (e.g. $$)</label>
                  <input name="priceRange" defaultValue={isEditing?.priceRange} className="input" required />
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
                <label className="label">Image URL</label>
                <input name="image" defaultValue={isEditing?.image} className="input" required />
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
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Save Place</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
