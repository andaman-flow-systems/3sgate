'use client';

import { useState, useEffect } from 'react';
import { newsDB, type NewsPost } from '@/lib/db';

export default function AdminNews() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isEditing, setIsEditing] = useState<NewsPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Sort by newest first
    setNews(newsDB.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this news article?')) {
      newsDB.delete(id);
      setNews(newsDB.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const post: Omit<NewsPost, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as 'myanmar-thailand' | 'myanmar-abroad' | 'myanmar-news',
      publishedAt: formData.get('publishedAt') as string,
      status: formData.get('status') as 'draft' | 'published',
      author: 'Admin',
    };

    if (isEditing) {
      newsDB.update(isEditing.id, post);
    } else {
      newsDB.create(post);
    }

    setNews(newsDB.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Manage News</h2>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add News Post
        </button>
      </div>

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
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                    background: n.status === 'published' ? '#22c55e20' : '#D4A01720',
                    color: n.status === 'published' ? '#22c55e' : '#D4A017'
                  }}>
                    {n.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => setIsEditing(n)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(n.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>
              {isEditing ? 'Edit News Post' : 'Add News Post'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Title</label>
                <input name="title" defaultValue={isEditing?.title} className="input" required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
                <label className="label">Image URL</label>
                <input name="image" defaultValue={isEditing?.image} className="input" required />
              </div>

              <div className="form-group">
                <label className="label">Content (Markdown / Text)</label>
                <textarea name="content" defaultValue={isEditing?.content} className="input" rows={10} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
