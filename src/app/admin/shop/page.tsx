'use client';

import { useState, useEffect } from 'react';
import { productsDB, type Product } from '@/lib/db';

export default function AdminShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setProducts(productsDB.getAll());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      productsDB.delete(id);
      setProducts(productsDB.getAll());
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      inStock: formData.get('inStock') === 'on',
    };

    if (isEditing) {
      productsDB.update(isEditing.id, product);
    } else {
      productsDB.create(product);
    }

    setProducts(productsDB.getAll());
    setIsEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Manage Shop</h2>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Product
        </button>
      </div>

      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Image</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Name</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Category</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Price</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Status</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '16px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                </td>
                <td style={{ padding: '16px', color: '#fff', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '16px', color: '#9ca3af' }}>{p.category}</td>
                <td style={{ padding: '16px', color: '#fff' }}>฿{p.price.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                    background: p.inStock ? '#22c55e20' : '#ef444420',
                    color: p.inStock ? '#22c55e' : '#ef4444'
                  }}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
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
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Product Name</label>
                <input name="name" defaultValue={isEditing?.name} className="input" required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Category</label>
                  <input name="category" defaultValue={isEditing?.category} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Price (฿ THB)</label>
                  <input name="price" type="number" step="0.01" defaultValue={isEditing?.price} className="input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Image URL</label>
                <input name="image" defaultValue={isEditing?.image} className="input" required />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={4} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" name="inStock" defaultChecked={isEditing ? isEditing.inStock : true} id="inStock" />
                <label htmlFor="inStock" style={{ color: '#fff' }}>Product is In Stock</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
