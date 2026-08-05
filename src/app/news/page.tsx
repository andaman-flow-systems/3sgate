'use client';

import { useState, useEffect } from 'react';
import { newsDB, type NewsPost } from '@/lib/db';
import { Newspaper } from 'lucide-react';

const CATEGORIES: { value: string; label: string; color: string }[] = [
  { value: 'all',              label: 'All News',         color: '#9ca3af' },
  { value: 'myanmar-thailand', label: 'Myanmar in Thailand', color: '#3b82f6' },
  { value: 'myanmar-abroad',   label: 'Myanmar Abroad',   color: '#22c55e' },
  { value: 'myanmar-news',     label: 'Myanmar News',     color: '#D4A017' },
];

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filtered, setFiltered] = useState<NewsPost[]>([]);
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<NewsPost | null>(null);

  useEffect(() => {
    const pub = newsDB.getPublished().sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    setPosts(pub);
    setFiltered(pub);
  }, []);

  useEffect(() => {
    if (category === 'all') setFiltered(posts);
    else setFiltered(posts.filter((p) => p.category === category));
  }, [category, posts]);

  const catColor = (cat: NewsPost['category']) => {
    const c = CATEGORIES.find((x) => x.value === cat);
    return c?.color ?? '#9ca3af';
  };
  const catLabel = (cat: NewsPost['category']) => {
    const c = CATEGORIES.find((x) => x.value === cat);
    return c?.label ?? cat;
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #00081a 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#3b82f620', border: '1px solid #3b82f650', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Newspaper size={22} color="#3b82f6" />
            </div>
            <h1 style={{ color: '#3b82f6', fontSize: '2rem', fontWeight: 800 }}>News</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Important news for Myanmar communities in Thailand and abroad
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Category filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              style={{
                padding: '8px 18px', borderRadius: '8px',
                border: `1px solid ${category === cat.value ? cat.color : '#2a2a2a'}`,
                background: category === cat.value ? cat.color + '20' : '#111111',
                color: category === cat.value ? cat.color : '#9ca3af',
                fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'Inter,sans-serif',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelected(post)}
              style={{
                background: '#111111',
                border: '1px solid #2a2a2a',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#3b82f6';
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = '0 8px 24px rgba(59,130,246,0.15)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#2a2a2a';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, color: catColor(post.category),
                    background: catColor(post.category) + '20',
                    padding: '2px 8px', borderRadius: '4px',
                  }}>
                    {catLabel(post.category)}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '8px' }}>
                  {post.title}
                </h2>
                <p style={{
                  color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                }}>
                  {post.content}
                </p>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>No news in this category yet.</p>
          </div>
        )}
      </div>

      {/* Article modal */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: '200px', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
              <img src={selected.image} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, color: catColor(selected.category),
                background: catColor(selected.category) + '20',
                padding: '3px 10px', borderRadius: '4px',
              }}>
                {catLabel(selected.category)}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>
                {new Date(selected.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.4 }}>
              {selected.title}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.8 }}>
              {selected.content}
            </p>
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: '24px', background: '#1a1a1a', border: '1px solid #2a2a2a',
                color: '#9ca3af', padding: '10px 20px', borderRadius: '8px',
                cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
