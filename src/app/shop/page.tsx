'use client';

import { useState, useEffect } from 'react';
import { productsDB, type Product } from '@/lib/db';
import { ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Clothing', 'Crafts'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const all = productsDB.getAll();
    setProducts(all);
    setFiltered(all);
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
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
            <h1 style={{ color: '#D4A017', fontSize: '2rem', fontWeight: 800 }}>Our Shop</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Discover unique products from our Myanmar community marketplace
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filters */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          flexWrap: 'wrap', marginBottom: '28px',
        }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
              padding: '9px 14px', color: '#fff', fontSize: '0.88rem', width: '240px',
              fontFamily: 'Inter, sans-serif', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  border: `1px solid ${category === cat ? '#D4A017' : '#2a2a2a'}`,
                  background: category === cat ? '#D4A01720' : '#111111',
                  color: category === cat ? '#D4A017' : '#9ca3af',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((product) => (
            <div
              key={product.id}
              style={{
                background: '#111111',
                border: '1px solid #2a2a2a',
                borderRadius: '14px',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer',
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
              <div style={{ height: '180px', overflow: 'hidden', background: '#1a1a1a', position: 'relative' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {!product.inStock && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ background: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                      OUT OF STOCK
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
                <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#D4A017', fontSize: '1.1rem', fontWeight: 700 }}>
                    ฿{product.price.toLocaleString()}
                  </span>
                  <a
                    href="https://www.facebook.com/share/1JAoQ7KMHx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#1877f2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif',
                      textDecoration: 'none',
                      transition: 'background 0.2s, transform 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = '#1464d8';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = '#1877f2';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                    }}
                  >
                    {/* Facebook icon */}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                    Click Here
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p style={{ fontSize: '1.1rem' }}>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
