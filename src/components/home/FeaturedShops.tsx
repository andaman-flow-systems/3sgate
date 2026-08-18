'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productsDB, type Product } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturedShops() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(productsDB.getAll().slice(0, 4));
  }, []);

  return (
    <div>
      <div className="section-header">
        <span className="section-title" style={{ color: '#D4A017' }}>{t('featuredShops')}</span>
        <Link href="/shop" className="view-all">{t('viewAll')}</Link>
      </div>

      <div className="grid-4" style={{ gap: '12px' }}>
        {products.map((p) => (
          <Link key={p.id} href="/shop" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#111111',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = '#D4A017';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = '#2a2a2a';
              el.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ height: '100px', overflow: 'hidden', background: '#1a1a1a' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {p.name}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#D4A017', fontWeight: 700 }}>
                  ฿{p.price.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
