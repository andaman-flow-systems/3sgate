'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardStats, newsDB, statsDB, type NewsPost, type VisitorStat } from '@/lib/db';
import { sbNewsDB, sbGalleryDB, sbJobsDB, sbRentalsDB, sbFoodDB, sbBannersDB, sbStatsDB } from '@/lib/supabase-db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { FileText, Newspaper, Image as ImageIcon, Briefcase, Folder, TrendingUp, Users, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0, newsPosts: 0, galleryItems: 0, jobListings: 0,
    rentListings: 0, foodPlaces: 0, todayVisitors: 0, todayPageViews: 0,
    weekPageViews: 0, weekVisitors: 0, visitorGrowth: 0, pageViewGrowth: 0,
    activeBanners: 0
  });
  const [recentNews, setRecentNews] = useState<NewsPost[]>([]);
  const [chartData, setChartData] = useState<VisitorStat[]>([]);
  const [metric, setMetric] = useState<'visitors' | 'pageViews'>('visitors');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: VisitorStat } | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const localStats = getDashboardStats();
      const localNews = newsDB.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
      setChartData(statsDB.getChartData());

      if (!isSupabaseConfigured()) {
        setStats(localStats);
        setRecentNews(localNews);
        return;
      }

      try {
        const [newsList, galleryList, jobsList, rentList, foodList, bannerList, realStatsSummary, realChartData] = await Promise.all([
          sbNewsDB.getAll().catch(() => null),
          sbGalleryDB.getAll().catch(() => null),
          sbJobsDB.getAll().catch(() => null),
          sbRentalsDB.getAll().catch(() => null),
          sbFoodDB.getAll().catch(() => null),
          sbBannersDB.getAll().catch(() => null),
          sbStatsDB.getSummary().catch(() => null),
          sbStatsDB.getChartData().catch(() => null),
        ]);

        const newsCount = newsList ? newsList.length : localStats.newsPosts;
        const galleryCount = galleryList ? galleryList.length : localStats.galleryItems;
        const jobsCount = jobsList ? jobsList.length : localStats.jobListings;
        const rentCount = rentList ? rentList.length : localStats.rentListings;
        const foodCount = foodList ? foodList.length : localStats.foodPlaces;
        const bannerCount = bannerList ? bannerList.filter(b => b.isActive).length : localStats.activeBanners;

        setStats({
          newsPosts: newsCount,
          galleryItems: galleryCount,
          jobListings: jobsCount,
          rentListings: rentCount,
          foodPlaces: foodCount,
          totalPosts: newsCount + galleryCount + jobsCount + rentCount + foodCount,
          activeBanners: bannerCount,
          todayVisitors: realStatsSummary ? realStatsSummary.todayVisitors : localStats.todayVisitors,
          todayPageViews: realStatsSummary ? realStatsSummary.todayPageViews : localStats.todayPageViews,
          weekPageViews: realStatsSummary ? realStatsSummary.weekPageViews : localStats.weekPageViews,
          weekVisitors: realStatsSummary ? realStatsSummary.weekVisitors : localStats.weekVisitors,
          visitorGrowth: realStatsSummary ? realStatsSummary.visitorGrowth : localStats.visitorGrowth,
          pageViewGrowth: realStatsSummary ? realStatsSummary.pageViewGrowth : localStats.pageViewGrowth,
        });

        if (realChartData && realChartData.length > 0) {
          setChartData(realChartData);
        }

        if (newsList && newsList.length > 0) {
          setRecentNews(newsList.slice(0, 5));
        } else {
          setRecentNews(localNews);
        }
      } catch {
        setStats(localStats);
        setRecentNews(localNews);
      }
    };

    loadDashboardData();
  }, []);

  // Compute SVG chart coordinates dynamically from chartData
  const svgWidth = 560;
  const svgHeight = 160;
  const paddingX = 20;
  const paddingY = 20;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const dataValues = chartData.map(d => d[metric]);
  const maxRaw = Math.max(...dataValues, 10);
  // Round up max for nice grid intervals
  const maxVal = Math.ceil(maxRaw / 100) * 100 || 100;

  const points = chartData.map((d, index) => {
    const count = dataValues.length;
    const x = paddingX + (count > 1 ? (index / (count - 1)) * graphWidth : graphWidth / 2);
    const val = d[metric];
    const y = svgHeight - paddingY - (val / maxVal) * graphHeight;
    return { x, y, data: d, val };
  });

  const lineD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const areaD = points.length > 0
    ? `${lineD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  // Format date labels for X-axis (e.g. "Mon", "Tue", "Wed"...)
  const formatDayName = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="admin-dash-grid">
      
      {/* LEFT COLUMN: Stats + Dynamic Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* DASHBOARD Overview Cards */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>DASHBOARD OVERVIEW</h2>
            <span style={{ fontSize: '0.75rem', color: '#22c55e', background: '#22c55e15', border: '1px solid #22c55e30', padding: '3px 10px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="dot-green" /> Live Real Data
            </span>
          </div>
          
          {/* Top 4 small stats */}
          <div className="admin-stat-4" style={{ marginBottom: '20px' }}>
            {[
              { Icon: FileText, label: 'Total Content', val: stats.totalPosts, color: '#a855f7' },
              { Icon: Newspaper, label: 'News Posts', val: stats.newsPosts, color: '#3b82f6' },
              { Icon: ImageIcon, label: 'Gallery Items', val: stats.galleryItems, color: '#ec4899' },
              { Icon: Briefcase, label: 'Job Listings', val: stats.jobListings, color: '#22c55e' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1a1a1a', borderRadius: '10px', padding: '16px', border: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <s.Icon size={16} color={s.color} />
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 500 }}>{s.label}</span>
                </div>
                <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{s.val}</p>
              </div>
            ))}
          </div>
          
          {/* Bottom 3 large stats */}
          <div className="admin-stat-3">
            <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '16px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 }}>Total Visitors</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>
                  {stats.todayVisitors.toLocaleString()}
                </p>
                <span style={{ color: stats.visitorGrowth >= 0 ? '#22c55e' : '#ef4444', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  {stats.visitorGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.visitorGrowth)}%
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '6px' }}>Today vs yesterday</p>
            </div>
            
            <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '16px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 }}>Page Views</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>
                  {stats.weekPageViews.toLocaleString()}
                </p>
                <span style={{ color: stats.pageViewGrowth >= 0 ? '#22c55e' : '#ef4444', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  {stats.pageViewGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.pageViewGrowth)}%
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '6px' }}>Last 7 Days total</p>
            </div>
            
            <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '16px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 }}>Active Ads & Banners</p>
              <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>
                {stats.activeBanners}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '6px' }}>Currently running</p>
            </div>
          </div>
        </div>

        {/* REAL DYNAMIC SVG CHART section */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#a855f7" /> Visitors & Analytics Trend
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '2px' }}>Live data generated dynamically from real visitor sessions</p>
            </div>

            {/* Metric Toggle buttons */}
            <div style={{ display: 'flex', background: '#1a1a1a', padding: '3px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <button
                onClick={() => setMetric('visitors')}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                  background: metric === 'visitors' ? '#a855f7' : 'transparent',
                  color: metric === 'visitors' ? '#fff' : '#9ca3af',
                  cursor: 'pointer', border: 'none', transition: 'all 0.2s'
                }}
              >
                <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> Visitors
              </button>
              <button
                onClick={() => setMetric('pageViews')}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                  background: metric === 'pageViews' ? '#3b82f6' : 'transparent',
                  color: metric === 'pageViews' ? '#fff' : '#9ca3af',
                  cursor: 'pointer', border: 'none', transition: 'all 0.2s'
                }}
              >
                <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} /> Page Views
              </button>
            </div>
          </div>

          <div style={{ height: '230px', position: 'relative', marginTop: '10px' }}>
            {/* Y axis labels */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.72rem', fontWeight: 600 }}>
              <span>{maxVal >= 1000 ? `${(maxVal/1000).toFixed(1)}k` : maxVal}</span>
              <span>{Math.round(maxVal * 0.75)}</span>
              <span>{Math.round(maxVal * 0.5)}</span>
              <span>{Math.round(maxVal * 0.25)}</span>
              <span>0</span>
            </div>
            
            {/* Dynamic SVG Chart */}
            <div style={{ position: 'absolute', left: '46px', right: 0, top: 0, bottom: '24px' }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metric === 'visitors' ? '#a855f7' : '#3b82f6'} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={metric === 'visitors' ? '#a855f7' : '#3b82f6'} stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = paddingY + pct * graphHeight;
                  return <line key={i} x1="0" y1={y} x2={svgWidth} y2={y} stroke="#1e1e1e" strokeWidth="1" strokeDasharray="3 3" />;
                })}

                {/* Filled gradient area under line */}
                {areaD && <path d={areaD} fill="url(#chartGrad)" />}

                {/* Main trend line */}
                {lineD && (
                  <path
                    d={lineD}
                    fill="none"
                    stroke={metric === 'visitors' ? '#a855f7' : '#3b82f6'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Data Nodes */}
                {points.map((p, i) => (
                  <g key={i}>
                    {/* Outer glow ring on hover */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint?.data.date === p.data.date ? '8' : '5'}
                      fill="#111111"
                      stroke={metric === 'visitors' ? '#a855f7' : '#3b82f6'}
                      strokeWidth="2.5"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y, data: p.data })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div style={{
                  position: 'absolute',
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                  transform: 'translate(-50%, -120%)',
                  background: '#1c1c1c',
                  border: `1px solid ${metric === 'visitors' ? '#a855f7' : '#3b82f6'}`,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, marginBottom: '2px' }}>
                    {formatShortDate(hoveredPoint.data.date)} ({formatDayName(hoveredPoint.data.date)})
                  </p>
                  <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800 }}>
                    {hoveredPoint.data[metric].toLocaleString()} <span style={{ color: metric === 'visitors' ? '#a855f7' : '#3b82f6', fontSize: '0.75rem', fontWeight: 600 }}>{metric === 'visitors' ? 'Visitors' : 'Views'}</span>
                  </p>
                </div>
              )}
            </div>
            
            {/* X axis labels (Dynamic Dates) */}
            <div style={{ position: 'absolute', bottom: 0, left: '46px', right: 0, display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.72rem', fontWeight: 600 }}>
              {chartData.map((d) => (
                <span key={d.date} style={{ textAlign: 'center', width: `${100 / chartData.length}%` }}>
                  {formatDayName(d.date)}
                </span>
              ))}
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
              <div style={{ width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
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
        
        <Link href="/admin/news" style={{ textDecoration: 'none' }}>
          <button style={{ 
            width: '100%', background: '#a855f7', color: '#fff', border: 'none', 
            borderRadius: '8px', padding: '14px', fontSize: '0.9rem', fontWeight: 700, 
            cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <span>+</span> Add New Post
          </button>
        </Link>
        
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
