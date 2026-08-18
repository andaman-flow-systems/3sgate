'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbProductsDB } from '@/lib/supabase-db';
import { productsDB, type Product } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, X, ExternalLink, Search, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Clothing', 'Crafts', 'Accessories'];

export default function ShopPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbProductsDB.getAll();
        setProducts(data);
        setFiltered(data);
      } else {
        const data = productsDB.getAll();
        setProducts(data);
        setFiltered(data);
      }
    } catch {
      const data = productsDB.getAll();
      setProducts(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    let result = products;
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [category, search, products]);

  return (
    <div>
      {/* Page Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1200 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#D4A01720', border: '1px solid #D4A01750', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} color="#D4A017" />
            </div>
            <h1 style={{ color: '#D4A017', fontSize: '2rem', fontWeight: 800 }}>{t('shopHeroTitle')}</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            {t('shopHeroSub')}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={t('shopSearchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
                padding: '9px 14px 9px 36px', color: '#fff', fontSize: '0.88rem', width: '100%',
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={14} color="#6b7280" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '7px 14px', borderRadius: '8px',
                  border: `1px solid ${category === cat ? '#D4A017' : '#2a2a2a'}`,
                  background: category === cat ? '#D4A01720' : '#111111',
                  color: category === cat ? '#D4A017' : '#9ca3af',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                }}
              >
                {cat === 'All' ? t('all') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('loading')}</p>
          </div>
        ) : (
          /* Products grid */
          <div className="product-grid">
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                style={{
                  background: '#111111',
                  border: '1px solid #2a2a2a',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#D4A017';
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = '0 8px 24px rgba(212,160,23,0.15)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#2a2a2a';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ height: '180px', overflow: 'hidden', background: '#1a1a1a', position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {!product.inStock && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ background: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                          {t('outOfStock')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '0.7rem', color: '#D4A017', fontWeight: 600,
                      background: '#D4A01715', padding: '2px 8px', borderRadius: '4px',
                    }}>
                      {product.category}
                    </span>
                    <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '8px 0 6px' }}>
                      {product.name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#D4A017', fontSize: '1.1rem', fontWeight: 700 }}>
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span style={{ color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600 }}>
                    {t('viewDetails')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p style={{ fontSize: '1.1rem' }}>{t('shopNoProducts')}</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '260px', background: '#1a1a1a' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem', color: '#D4A017', fontWeight: 700,
                    background: '#D4A01715', padding: '4px 10px', borderRadius: '6px',
                  }}>
                    {selectedProduct.category}
                  </span>
                  <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>
                    {selectedProduct.name}
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#D4A017', fontSize: '1.5rem', fontWeight: 800 }}>
                    ฿{selectedProduct.price.toLocaleString()}
                  </span>
                  <span style={{ display: 'block', color: selectedProduct.inStock ? '#22c55e' : '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginTop: '4px' }}>
                    {selectedProduct.inStock ? `✓ ${t('inStock')}` : `✕ ${t('outOfStock')}`}
                  </span>
                </div>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '24px' }}>
                {selectedProduct.description}
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href="https://www.facebook.com/share/1BZMe1KVPk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, padding: '14px', borderRadius: '10px', background: '#1877f2', color: '#fff',
                    textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <ExternalLink size={18} /> {t('shopBuyInquireFacebook')}
                </a>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{ padding: '14px 20px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', cursor: 'pointer' }}
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
