'use client';

import { useState, useEffect } from 'react';
import { rentalsDB, type RentalSpace } from '@/lib/db';

export default function AdminRent() {
  const [spaces, setSpaces] = useState<RentalSpace[]>([]);
  const [isEditing, setIsEditing] = useState<RentalSpace | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setSpaces(rentalsDB.getAll());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this space?')) {
      rentalsDB.delete(id);
      setSpaces(rentalsDB.getAll());
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const space: Omit<RentalSpace, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      image: formData.get('image') as string,
      location: formData.get('location') as string,
      size: formData.get('size') as string,
      isAvailable: formData.get('isAvailable') === 'on',
      renterName: formData.get('renterName') as string || undefined,
      ownerUrl: (formData.get('ownerUrl') as string) || 'https://www.facebook.com/share/1JAoQ7KMHx/',
    };

    if (isEditing) {
      rentalsDB.update(isEditing.id, space);
    } else {
      rentalsDB.create(space);
    }

    setSpaces(rentalsDB.getAll());
    setIsEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Manage Business Directory</h2>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Listing
        </button>
      </div>

      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
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
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                    background: s.isAvailable ? '#22c55e20' : '#ef444420',
                    color: s.isAvailable ? '#22c55e' : '#ef4444'
                  }}>
                    {s.isAvailable ? 'Available' : 'Rented'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => setIsEditing(s)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(s.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
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
              {isEditing ? 'Edit Listing' : 'Add New Business Listing'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Business / Space Name</label>
                <input name="name" defaultValue={isEditing?.name} className="input" required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Location</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Size / Category</label>
                  <input name="size" defaultValue={isEditing?.size} className="input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Price per Month (฿ THB)</label>
                  <input name="price" type="number" step="0.01" defaultValue={isEditing?.price} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Image URL</label>
                  <input name="image" defaultValue={isEditing?.image} className="input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Owner / Contact Redirect URL</label>
                <input
                  name="ownerUrl"
                  defaultValue={isEditing?.ownerUrl || 'https://www.facebook.com/share/1JAoQ7KMHx/'}
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
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Save Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
