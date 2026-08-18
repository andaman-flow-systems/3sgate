'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSlider() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const SLIDES = [
    {
      id: 1,
      headline: t('slide1Headline'),
      highlight: t('slide1Highlight'),
      sub: t('slide1Sub'),
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    },
    {
      id: 2,
      headline: t('slide2Headline'),
      highlight: t('slide2Highlight'),
      sub: t('slide2Sub'),
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
    },
    {
      id: 3,
      headline: t('slide3Headline'),
      highlight: t('slide3Highlight'),
      sub: t('slide3Sub'),
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, [current, SLIDES.length]);

  function goTo(idx: number) {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 600);
  }

  const slide = SLIDES[current];

  return (
    <>
      <div className="hero-slider" style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#0d0d0d',
      }}>
        {/* Background image */}
        <div
          key={slide.id}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            transition: 'opacity 0.6s ease',
            opacity: isAnimating ? 0 : 1,
          }}
        />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.2) 100%)' }} />

        {/* Content */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '520px' }}>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '4px', opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(10px)' : 'translateY(0)', transition: 'all 0.5s ease' }}>
            {slide.headline}
          </h1>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, color: '#D4A017', lineHeight: 1.2, marginBottom: '14px', opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(10px)' : 'translateY(0)', transition: 'all 0.5s ease 0.1s' }}>
            {slide.highlight}
          </h1>
          <p style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '380px', opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(10px)' : 'translateY(0)', transition: 'all 0.5s ease 0.2s' }}>
            {slide.sub}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-gold" style={{ textDecoration: 'none', fontFamily: 'Inter,sans-serif', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.85rem' }}>
              {t('exploreNow')}
            </Link>
            <Link href="/news" className="btn btn-outline" style={{ textDecoration: 'none', fontFamily: 'Inter,sans-serif', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
              {t('learnMore')}
            </Link>
          </div>
        </div>

        {/* Prev/Next arrows */}
        <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '34px', height: '34px', color: '#fff', cursor: 'pointer', fontSize: '1rem', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <button onClick={() => goTo((current + 1) % SLIDES.length)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '34px', height: '34px', color: '#fff', cursor: 'pointer', fontSize: '1rem', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === current ? '22px' : '7px', height: '7px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: i === current ? '#D4A017' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease', padding: 0 }} />
          ))}
        </div>
      </div>
    </>
  );
}
