'use client';

import { Target, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VisionMission() {
  const { t } = useLanguage();

  return (
    <div className="grid-2" style={{ gap: '20px', marginBottom: '40px' }}>
      {/* Vision */}
      <div style={{
        background: 'linear-gradient(135deg, #161616 0%, #1a1500 100%)',
        border: '1px solid #D4A01730',
        borderLeft: '3px solid #D4A017',
        borderRadius: '14px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D4A01720', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} color="#D4A017" />
          </div>
          <h3 style={{ color: '#D4A017', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('visionTitle')}
          </h3>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.75 }}>
          {t('visionText')}
        </p>
      </div>

      {/* Mission */}
      <div style={{
        background: 'linear-gradient(135deg, #161616 0%, #001a0a 100%)',
        border: '1px solid #22c55e30',
        borderLeft: '3px solid #22c55e',
        borderRadius: '14px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={18} color="#22c55e" />
          </div>
          <h3 style={{ color: '#22c55e', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('missionTitle')}
          </h3>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.75 }}>
          {t('missionText')}
        </p>
      </div>
    </div>
  );
}
