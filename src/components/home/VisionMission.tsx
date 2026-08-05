import { Target, Rocket } from 'lucide-react';

export default function VisionMission() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '40px',
    }}>
      {/* Vision */}
      <div style={{
        background: 'linear-gradient(135deg, #161616 0%, #1a1500 100%)',
        border: '1px solid #D4A01730',
        borderLeft: '3px solid #D4A017',
        borderRadius: '14px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#D4A01720', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Target size={18} color="#D4A017" />
          </div>
          <h3 style={{ color: '#D4A017', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Vision
          </h3>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.75 }}>
          To become a trusted gateway that connects communities with opportunities, knowledge, businesses, and meaningful social impact.
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
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#22c55e20', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Rocket size={18} color="#22c55e" />
          </div>
          <h3 style={{ color: '#22c55e', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Mission
          </h3>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.75 }}>
          To empower communities by connecting people with information, businesses, jobs, creativity, and opportunities that create positive social impact.
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
