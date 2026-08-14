'use client';

import { useState, useEffect, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import { sbProductsDB } from '@/lib/supabase-db';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/lib/db';
import { Package, AlertCircle, Loader, CheckCircle, Upload, Link as LinkIcon, X, ImageIcon } from 'lucide-react';

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

// ─── Image Input Component (URL + Drag & Drop) ────────────────────────────────
interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

function ImageInput({ value, onChange }: ImageInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WebP, GIF)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10 MB');
      return;
    }
    setUploadError(null);
    setUploading(true);

    try {
      // Convert to base64 data URL for preview (works without Supabase storage bucket)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onChange(dataUrl);
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError('Upload failed. Try using a URL instead.');
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '12px', background: '#1a1a1a', borderRadius: '8px', padding: '4px', border: '1px solid #2a2a2a' }}>
        <button
          type="button"
          onClick={() => setMode('url')}
          style={{
            flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: mode === 'url' ? '#a855f7' : 'transparent',
            color: mode === 'url' ? '#fff' : '#9ca3af',
            fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <LinkIcon size={14} /> Image URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          style={{
            flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: mode === 'upload' ? '#a855f7' : 'transparent',
            color: mode === 'upload' ? '#fff' : '#9ca3af',
            fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <Upload size={14} /> Drag & Drop / Upload
        </button>
      </div>

      {mode === 'url' ? (
        <input
          name="image"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input"
          placeholder="https://example.com/photo.jpg"
        />
      ) : (
        <>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#a855f7' : '#3a3a3a'}`,
              borderRadius: '10px',
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? '#a855f710' : '#1a1a1a',
              transition: 'all 0.2s',
            }}
          >
            {uploading ? (
              <div>
                <Loader size={28} color="#a855f7" style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>Processing image…</p>
              </div>
            ) : (
              <div>
                <Upload size={28} color="#6b7280" style={{ marginBottom: '8px' }} />
                <p style={{ color: '#fff', margin: '0 0 4px', fontWeight: 600, fontSize: '0.9rem' }}>
                  Drag & drop your photo here
                </p>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.8rem' }}>
                  or <span style={{ color: '#a855f7', fontWeight: 600 }}>click to browse</span> — JPG, PNG, WebP up to 10 MB
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{uploadError}</p>
          )}

          {/* Also show a URL input below for convenience */}
          <div style={{ marginTop: '12px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '6px' }}>Or paste a URL directly:</p>
            <input
              value={value.startsWith('data:') ? '' : value}
              onChange={e => onChange(e.target.value)}
              className="input"
              placeholder="https://example.com/photo.jpg"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </>
      )}

      {/* Preview */}
      {value && (
        <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '6px' }}>Preview:</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={value}
              alt="Preview"
              style={{
                width: '120px', height: '90px', objectFit: 'cover',
                borderRadius: '8px', border: '1px solid #3a3a3a', display: 'block',
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#ef4444', border: 'none', borderRadius: '50%',
                width: '22px', height: '22px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Hidden input to carry the value for form submission */}
      <input type="hidden" name="image" value={value} />
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
  const [imageUrl, setImageUrl]     = useState('');
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

  // ── open modal helpers ──
  const openAdd = () => {
    setImageUrl('');
    setIsAdding(true);
  };

  const openEdit = (p: Product) => {
    setImageUrl(p.image);
    setIsEditing(p);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    setImageUrl('');
  };

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

    // imageUrl state holds the resolved value (could be data URL or https URL)
    const product: Omit<Product, 'id' | 'createdAt'> = {
      name:        formData.get('name') as string,
      description: formData.get('description') as string,
      price:       Number(formData.get('price')),
      image:       imageUrl,
      category:    formData.get('category') as string,
      inStock:     formData.get('inStock') === 'on',
    };

    if (!product.image) {
      setError('Please provide a product image (URL or upload).');
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        await sbProductsDB.update(isEditing.id, product);
        showToast('Product updated ✓');
      } else {
        await sbProductsDB.create(product);
        showToast('Product added ✓');
      }
      closeModal();
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
            onClick={openAdd}
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
                      {p.image ? (
                        <img
                          src={p.image} alt={p.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2a2a' }}
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
                          <ImageIcon size={20} color="#4b5563" />
                        </div>
                      )}
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
                        onClick={() => openEdit(p)}
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
          <div className="modal" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '24px' }}>
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

              {/* Image section — URL or Drag & Drop */}
              <div className="form-group">
                <label className="label">Product Image</label>
                <ImageInput value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={4} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" name="inStock" defaultChecked={isEditing ? isEditing.inStock : true} id="inStock" />
                <label htmlFor="inStock" style={{ color: '#fff' }}>Product is In Stock</label>
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={closeModal}
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
