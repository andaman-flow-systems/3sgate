'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbProductsDB } from '@/lib/supabase-db';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/lib/db';
import { Package, AlertCircle, Loader, CheckCircle } from 'lucide-react';

// ─── Not-configured banner ─────────────────────────────────────────────────────
function SetupBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a0a00 0%, #2a1500 100%)',
      border: '1px solid #f97316',
      borderRadius: '12px',
      padding: '24px 28px',
      marginBottom: '28px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      <AlertCircle size={22} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p style={{ color: '#f97316', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
          Supabase not connected yet
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
          Open <code style={{ background: '#111', padding: '2px 6px', borderRadius: '4px', color: '#fbbf24' }}>.env.local</code> and paste your <strong style={{ color: '#fff' }}>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong style={{ color: '#fff' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> from your Supabase project → Settings → API.
          Then restart the dev server.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AdminShop() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [isEditing, setIsEditing]   = useState<Product | null>(null);
  const [isAdding, setIsAdding]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [toast, setToast]           = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  // ── show toast for 3s then hide ──
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── load products from Supabase ──
  const loadProducts = useCallback(async () => {
    if (!configured) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const data = await sbProductsDB.getAll();
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // ── delete ──
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await sbProductsDB.delete(id);
      showToast('Product deleted');
      loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // ── save (create or update) ──
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const product: Omit<Product, 'id' | 'createdAt'> = {
      name:        formData.get('name') as string,
      description: formData.get('description') as string,
      price:       Number(formData.get('price')),
      image:       formData.get('image') as string,
      category:    formData.get('category') as string,
      inStock:     formData.get('inStock') === 'on',
    };

    try {
      if (isEditing) {
        await sbProductsDB.update(isEditing.id, product);
        showToast('Product updated ✓');
      } else {
        await sbProductsDB.create(product);
        showToast('Product added ✓');
      }
      setIsEditing(null);
      setIsAdding(false);
      loadProducts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
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
          animation: 'fadeIn 0.2s ease',
        }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
            Manage Shop
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured
              ? `${products.length} product${products.length !== 1 ? 's' : ''} in Supabase database`
              : 'Connect Supabase to enable cloud storage'}
          </p>
        </div>
        {configured && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-purple"
            disabled={loading}
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Setup banner if not configured */}
      {!configured && <SetupBanner />}

      {/* Error */}
      {error && (
        <div style={{
          background: '#2a0a0a', border: '1px solid #ef4444', borderRadius: '10px',
          padding: '14px 18px', marginBottom: '20px', color: '#ef4444',
          display: 'flex', gap: '10px', alignItems: 'center',
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader size={32} color="#7c3aed" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading from Supabase…</p>
        </div>
      ) : (
        <div style={{
          background: '#111111', border: '1px solid #2a2a2a',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          {products.length === 0 && configured ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
              <Package size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p>No products yet. Click <strong style={{ color: '#a78bfa' }}>+ Add Product</strong> to get started.</p>
            </div>
          ) : (
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
                  <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <img
                        src={p.image} alt={p.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2a2a' }}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', color: '#fff', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{p.category}</td>
                    <td style={{ padding: '14px 16px', color: '#a78bfa', fontWeight: 600 }}>฿{p.price.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                        background: p.inStock ? '#22c55e18' : '#ef444418',
                        color:      p.inStock ? '#22c55e'   : '#ef4444',
                        border:     `1px solid ${p.inStock ? '#22c55e40' : '#ef444440'}`,
                      }}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setIsEditing(p)}
                        style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 14px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ background: '#ef444415', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
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
          <div className="modal" style={{ maxWidth: '600px' }}>
            <h2 style={{ color: '#fff', marginBottom: '6px' }}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '20px' }}>
              Saved directly to Supabase cloud database
            </p>

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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setIsEditing(null); }}
                  className="btn"
                  style={{ background: '#1a1a1a', color: '#fff' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving…' : isEditing ? 'Update Product' : 'Add Product'}
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
