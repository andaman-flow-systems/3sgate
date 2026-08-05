'use client';

import { useEffect } from 'react';
import { seedIfEmpty } from '@/lib/db';
import HeroSlider from '@/components/home/HeroSlider';
import QuickAccess from '@/components/home/QuickAccess';
import VisionMission from '@/components/home/VisionMission';
import LatestNewsSidebar from '@/components/home/LatestNewsSidebar';
import FeaturedArtwork from '@/components/home/FeaturedArtwork';
import FeaturedShops from '@/components/home/FeaturedShops';

export default function HomePage() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <div className="container section-sm">
      {/* Main 3-column grid layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px 220px',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* Left: Hero + Quick Access */}
        <div>
          <HeroSlider />
          <QuickAccess />
        </div>

        {/* Center: Latest News */}
        <div style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: '16px',
          padding: '18px',
        }}>
          <LatestNewsSidebar />
        </div>

        {/* Right: Featured Artwork */}
        <div style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: '16px',
          padding: '18px',
        }}>
          <FeaturedArtwork />
        </div>
      </div>

      {/* Vision & Mission */}
      <VisionMission />

      {/* Featured Shops full width */}
      <div style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '16px',
        padding: '20px',
      }}>
        <FeaturedShops />
      </div>

      <style>{`
        @media (max-width: 1100px) {
          div[style*="1fr 280px 220px"] {
            grid-template-columns: 1fr 260px !important;
          }
          div[style*="1fr 280px 220px"] > div:last-child {
            display: none;
          }
        }
        @media (max-width: 768px) {
          div[style*="1fr 280px 220px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="1fr 280px 220px"] > div:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
