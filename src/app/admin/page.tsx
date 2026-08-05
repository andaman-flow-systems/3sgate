'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardStats, newsDB, type NewsPost } from '@/lib/db';
import { FileText, Newspaper, Image as ImageIcon, Briefcase, ChevronRight, Folder } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0, newsPosts: 0, galleryItems: 0, jobListings: 0,
    todayVisitors: 0, weekPageViews: 0, activeBanners: 0
  });
  const [recentNews, setRecentNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    setStats(getDashboardStats());
    setRecentNews(newsDB.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px 240px', gap: '20px' }}>
      
      {/* LEFT COLUMN: Stats + Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* DASHBOARD section */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>DASHBOARD</h2>
          
          {/* Top 4 small stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              { Icon: FileText, label: 'Total Posts', val: stats.totalPosts, color: '#a855f7' },
              { Icon: Newspaper, label: 'News Posts', val: stats.newsPosts, color: '#3b82f6' },
              { Icon: ImageIcon, label: 'Gallery Items', val: stats.galleryItems, color: '#ec4899' },
              { Icon: Briefcase, label: 'Job Listings', val: stats.jobListings, color: '#22c55e' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <s.Icon size={16} color={s.color} />
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{s.label}</span>
                </div>
                <p style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>{s.val}</p>
              </div>
            ))}
          </div>
          
          {/* Bottom 3 large stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Total Visitors</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>
                  {stats.todayVisitors.toLocaleString()}
                </p>
                <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 600 }}>↑ 12.5%</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>Today</p>
            </div>
            
            <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Page Views</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>
                  {stats.weekPageViews.toLocaleString()}
                </p>
                <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 600 }}>↑ 8.3%</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>This Week</p>
            </div>
            
            <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Active Ads</p>
              <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>
                {stats.activeBanners}
              </p>
            </div>
          </div>
        </div>

        {/* CHART section */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>Visitors Overview</h2>
          
          <div style={{ height: '220px', position: 'relative' }}>
            {/* Y axis labels */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.7rem' }}>
              <span>2.0K</span><span>1.5K</span><span>1.0K</span><span>500</span><span>0</span>
            </div>
            
            {/* SVG Chart matching the purple line graph */}
            <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none" style={{ position: 'absolute', left: '40px', right: 0 }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="0" y1="0" x2="600" y2="0" stroke="#2a2a2a" strokeWidth="1" />
              <line x1="0" y1="50" x2="600" y2="50" stroke="#2a2a2a" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#2a2a2a" strokeWidth="1" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#2a2a2a" strokeWidth="1" />
              <line x1="0" y1="200" x2="600" y2="200" stroke="#2a2a2a" strokeWidth="1" />

              {/* Chart Path */}
              <path d="M0 160 L50 150 L100 80 L150 90 L200 110 L250 70 L300 90 L350 40 L400 70 L450 60 L500 65 L550 30" 
                    fill="none" stroke="#a855f7" strokeWidth="3" />
              <path d="M0 160 L50 150 L100 80 L150 90 L200 110 L250 70 L300 90 L350 40 L400 70 L450 60 L500 65 L550 30 L550 200 L0 200 Z" 
                    fill="url(#purpleGrad)" />

              {/* Dots */}
              {[
                {x:0, y:160}, {x:50, y:150}, {x:100, y:80}, {x:150, y:90}, {x:200, y:110}, {x:250, y:70},
                {x:300, y:90}, {x:350, y:40}, {x:400, y:70}, {x:450, y:60}, {x:500, y:65}, {x:550, y:30}
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#111111" stroke="#a855f7" strokeWidth="2" />
              ))}
            </svg>
            
            {/* X axis labels */}
            <div style={{ position: 'absolute', bottom: 0, left: '40px', right: 0, display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.7rem' }}>
              <span>May 6</span><span>May 7</span><span>May 8</span><span>May 9</span><span>May 10</span><span>May 11</span><span>May 12</span>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN: Recent Posts */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>RECENT POSTS</h2>
          <Link href="/admin/news" style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentNews.map(post => (
            <div key={post.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
                  {post.title}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span style={{ 
                  color: post.status === 'published' ? '#22c55e' : '#D4A017', 
                  fontSize: '0.75rem', fontWeight: 600 
                }}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Quick Actions */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>QUICK ACTIONS</h2>
        
        <button style={{ 
          width: '100%', background: '#a855f7', color: '#fff', border: 'none', 
          borderRadius: '8px', padding: '14px', fontSize: '0.9rem', fontWeight: 700, 
          cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span>+</span> Add New Post
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Manage Shops', href: '/admin/shop' },
            { label: 'Manage Business Directory', href: '/admin/rent' },
            { label: 'Manage News', href: '/admin/news' },
            { label: 'Manage Gallery', href: '/admin/gallery' },
            { label: 'Manage Jobs', href: '/admin/jobs' },
            { label: 'Manage Donations', href: '/admin/donate' },
            { label: 'Manage Banners', href: '/admin/banners' },
          ].map(action => (
            <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', 
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                color: '#9ca3af', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
              >
                <Folder size={15} color="#a855f7" /> {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  );
}
