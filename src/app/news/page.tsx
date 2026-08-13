'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbNewsDB } from '@/lib/supabase-db';
import { newsDB, type NewsPost } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Newspaper, Calendar, User, ArrowRight, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All News' },
  { id: 'myanmar-thailand', label: 'Myanmar-Thailand' },
  { id: 'myanmar-abroad', label: 'Myanmar Abroad' },
  { id: 'myanmar-news', label: 'Myanmar Local' },
];

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filtered, setFiltered] = useState<NewsPost[]>([]);
  const [category, setCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbNewsDB.getPublished();
        setPosts(data);
        setFiltered(data);
      } else {
        const data = newsDB.getPublished();
        setPosts(data);
        setFiltered(data);
      }
    } catch {
      const data = newsDB.getPublished();
      setPosts(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  useEffect(() => {
    if (category === 'all') {
      setFiltered(posts);
    } else {
      setFiltered(posts.filter(p => p.category === category));
    }
  }, [category, posts]);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #180900 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#ea580c20',
              border: '1px solid #ea580c50', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Newspaper size={22} color="#ea580c" />
            </div>
            <h1 style={{ color: '#ea580c', fontSize: '2rem', fontWeight: 800 }}>Community News</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Latest updates, immigration policies, and stories for Myanmar communities.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: '9px 18px', borderRadius: '8px',
                border: `1px solid ${category === cat.id ? '#ea580c' : '#2a2a2a'}`,
                background: category === cat.id ? '#ea580c20' : '#111111',
                color: category === cat.id ? '#ea580c' : '#9ca3af',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>Loading news articles from database...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filtered.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                style={{
                  background: '#111111', border: '1px solid #2a2a2a', borderRadius: '14px',
                  overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#ea580c';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#2a2a2a';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ height: '190px', background: '#1a1a1a' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px', color: '#6b7280', fontSize: '0.75rem', marginBottom: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} color="#ea580c" /> {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} /> {post.author}
                      </span>
                    </div>

                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '10px' }}>
                      {post.title}
                    </h3>

                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.content}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 20px 20px', color: '#ea580c', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Read Full Article <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>No news articles found in this category.</p>
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '280px', background: '#1a1a1a' }}>
              <img src={selectedPost.image} alt={selectedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '14px', color: '#ea580c', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
                <span>Published: {new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                <span>Author: {selectedPost.author}</span>
              </div>

              <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '16px' }}>
                {selectedPost.title}
              </h2>

              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {selectedPost.content}
              </p>

              <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedPost(null)}
                  style={{ padding: '10px 24px', borderRadius: '8px', background: '#ea580c', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
