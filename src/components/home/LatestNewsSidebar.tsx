'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { newsDB, type NewsPost } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LatestNewsSidebar() {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    setNews(newsDB.getPublished().slice(0, 4));
  }, []);

  const catLabel = (cat: NewsPost['category']) => {
    if (cat === 'myanmar-thailand') return t('newsCatThailand');
    if (cat === 'myanmar-abroad') return t('newsCatAbroad');
    return t('newsCatLocal');
  };

  const catColor = (cat: NewsPost['category']) =>
    cat === 'myanmar-thailand' ? '#3b82f6' : cat === 'myanmar-abroad' ? '#22c55e' : '#D4A017';

  return (
    <div>
      <div className="section-header">
        <span className="section-title" style={{ color: '#3b82f6' }}>{t('latestNews')}</span>
        <Link href="/news" className="view-all">{t('viewAll')}</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {news.map((post) => (
          <Link key={post.id} href="/news" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '10px',
              borderRadius: '10px',
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Thumbnail */}
              <div style={{
                width: '64px',
                height: '48px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#1a1a1a',
              }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#ffffff',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  marginBottom: '4px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {post.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    color: catColor(post.category),
                    fontWeight: 600,
                  }}>
                    {catLabel(post.category)}
                  </span>
                  <span style={{ color: '#374151', fontSize: '0.68rem' }}>·</span>
                  <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>
                    {new Date(post.publishedAt).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
