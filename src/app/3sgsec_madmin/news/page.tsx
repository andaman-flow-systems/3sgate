'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbNewsDB } from '@/lib/supabase-db';
import { newsDB, type NewsPost } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminNews() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isEditing, setIsEditing] = useState<NewsPost | null>(null);
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

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (configured) {
        const data = await sbNewsDB.getAll();
        setNews(data);
      } else {
        setNews(newsDB.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      setError((err as Error).message);
      setNews(newsDB.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const openAdd = () => {
    setImageUrl('');
    setIsAdding(true);
  };

  const openEdit = (n: NewsPost) => {
    setImageUrl(n.image || '');
    setIsEditing(n);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    setImageUrl('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    try {
      if (configured) {
        await sbNewsDB.delete(id);
      } else {
        newsDB.delete(id);
      }
      showToast('News post deleted');
      loadNews();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const post: Omit<NewsPost, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: imageUrl,
      category: formData.get('category') as 'myanmar-thailand' | 'myanmar-abroad' | 'myanmar-news',
      publishedAt: formData.get('publishedAt') as string,
      status: formData.get('status') as 'draft' | 'published',
      author: 'Admin',
    };

    if (!post.image) {
      setError('Please upload or select an image for this article.');
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        if (configured) {
          await sbNewsDB.update(isEditing.id, post);
        } else {
          newsDB.update(isEditing.id, post);
        }
        showToast('News post updated ✓');
      } else {
        if (configured) {
          await sbNewsDB.create(post);
        } else {
          newsDB.create(post);
        }
        showToast('News post created ✓');
      }
      closeModal();
      loadNews();
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
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Manage News</h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured ? `${news.length} posts in Supabase cloud database` : `${news.length} posts in local browser storage`}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-purple">
          + Add News Post
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
          <p style={{ marginTop: '12px' }}>Loading news posts...</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Image</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Title</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Category</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Date</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Status</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '16px' }}>
                    <img src={n.image} alt={n.title} style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ color: '#fff', fontWeight: 600, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {n.title}
                    </p>
                  </td>
                  <td style={{ padding: '16px', color: '#9ca3af', fontSize: '0.85rem' }}>{n.category.replace('myanmar-', '')}</td>
                  <td style={{ padding: '16px', color: '#9ca3af', fontSize: '0.85rem' }}>
                    {new Date(n.publishedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', whiteSpace: 'nowrap',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                      background: n.status === 'published' ? '#22c55e20' : '#D4A01720',
                      color: n.status === 'published' ? '#22c55e' : '#D4A017'
                    }}>
                      {n.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(n)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(n.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
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
          <div className="modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>
                {isEditing ? 'Edit News Post' : 'Add News Post'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Title</label>
                <input name="title" defaultValue={isEditing?.title} className="input" required />
              </div>
              
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="label">Category</label>
                  <select name="category" defaultValue={isEditing?.category || 'myanmar-news'} className="input" required>
                    <option value="myanmar-news">Myanmar News</option>
                    <option value="myanmar-thailand">Myanmar in Thailand</option>
                    <option value="myanmar-abroad">Myanmar Abroad</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select name="status" defaultValue={isEditing?.status || 'published'} className="input" required>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Publish Date</label>
                  <input name="publishedAt" type="date" defaultValue={isEditing?.publishedAt.split('T')[0] || new Date().toISOString().split('T')[0]} className="input" required />
                </div>
              </div>

              <div className="form-group">
                <ImageUploadInput label="Post Picture" value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="form-group">
                <label className="label">Content (Markdown / Text)</label>
                <textarea name="content" defaultValue={isEditing?.content} className="input" rows={8} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
