'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1,
    headline: 'Connecting Communities.',
    highlight: 'Creating Opportunities.',
    sub: 'A trusted platform that connects businesses, communities, creators, job seekers, and social initiatives to create meaningful opportunities and positive social impact.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
  },
  {
    id: 2,
    headline: 'Supporting Myanmar',
    highlight: 'Communities Abroad.',
    sub: 'Your trusted source for news, jobs, art, and community support for Myanmar people living in Thailand and around the world.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
  },
  {
    id: 3,
    headline: 'Empowering Artists &',
    highlight: 'Creative Voices.',
    sub: 'Showcase and discover artwork from talented Myanmar artists and support the next generation of creative minds.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [current]);

  function goTo(idx: number) {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 600);
  }

  const slide = SLIDES[current];

  return (
    <div style={{
      position: 'relative',
      height: '380px',
      borderRadius: '16px',
      overflow: 'hidden',
      background: '#0d0d0d',
    }}>
      {/* Background image */}
      <div
        key={slide.id}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'opacity 0.6s ease',
          opacity: isAnimating ? 0 : 1,
        }}
      />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.2) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '40px 40px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '520px',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.2,
          marginBottom: '4px',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.5s ease',
        }}>
          {slide.headline}
        </h1>
        <h1 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#D4A017',
          lineHeight: 1.2,
          marginBottom: '16px',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.5s ease 0.1s',
        }}>
          {slide.highlight}
        </h1>
        <p style={{
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.7,
          marginBottom: '24px',
          maxWidth: '380px',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.5s ease 0.2s',
        }}>
          {slide.sub}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/shop" className="btn btn-gold btn-lg" style={{ textDecoration: 'none', fontFamily: 'Inter,sans-serif', borderRadius: '8px', padding: '11px 24px', fontWeight: 700, fontSize: '0.88rem' }}>
            EXPLORE NOW
          </Link>
          <Link href="/news" className="btn btn-outline btn-lg" style={{ textDecoration: 'none', fontFamily: 'Inter,sans-serif', borderRadius: '8px', padding: '11px 24px', fontWeight: 700, fontSize: '0.88rem', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
            LEARN MORE
          </Link>
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', width: '36px', height: '36px',
          color: '#fff', cursor: 'pointer', fontSize: '1rem', zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >‹</button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', width: '36px', height: '36px',
          color: '#fff', cursor: 'pointer', fontSize: '1rem', zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >›</button>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '6px', zIndex: 3,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '24px' : '8px', height: '8px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: i === current ? '#D4A017' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
