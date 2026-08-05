'use client';

import { useState } from 'react';
import { Heart, Users, BookOpen } from 'lucide-react';

const DONATION_TYPES = [
  {
    id: 'support-me',
    title: 'Support the Platform',
    sub: 'Help us keep 3SGate running',
    desc: 'Your contribution supports the development, hosting, and maintenance of the 3SGate platform — keeping this community resource free and accessible for everyone.',
    Icon: Heart,
    color: '#a855f7',
  },
  {
    id: 'refugee',
    title: 'Refugee Support',
    sub: 'Emergency aid for displaced families',
    desc: 'Provide essential relief to Myanmar refugees in border areas — food, clean water, temporary shelter, and medical care for the most vulnerable families.',
    Icon: Users,
    color: '#ef4444',
  },
  {
    id: 'scholarship',
    title: 'Student Scholarships',
    sub: 'Invest in the next generation',
    desc: 'Fund education for children and students who have lost access to schooling. Every contribution helps a young person build a brighter future.',
    Icon: BookOpen,
    color: '#22c55e',
  },
];

const PRESET_AMOUNTS = [200, 500, 1000, 2000];

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState('support-me');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const current = DONATION_TYPES.find(d => d.id === activeTab)!;

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount === 'custom' ? Number(customAmount) : Number(amount);
    if (!finalAmount || finalAmount <= 0) return;
    setShowThankYou(true);
    setAmount('');
    setCustomAmount('');
    setDonorName('');
    setTimeout(() => setShowThankYou(false), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0505 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#ef444420', border: '1px solid #ef444450', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} color="#ef4444" />
            </div>
            <h1 style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 800 }}>Make an Impact</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Your contribution directly supports our community initiatives. All amounts are in Thai Baht (THB).
          </p>
        </div>
      </div>

      <div className="container section-sm">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {DONATION_TYPES.map(type => {
              const isActive = activeTab === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => { setActiveTab(type.id); setAmount(''); setCustomAmount(''); }}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    border: `1px solid ${isActive ? type.color : '#2a2a2a'}`,
                    background: isActive ? type.color + '15' : '#111111',
                    color: isActive ? type.color : '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: isActive ? type.color + '25' : '#1a1a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <type.Icon size={20} color={isActive ? type.color : '#9ca3af'} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
                    {type.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.7, textAlign: 'center' }}>
                    {type.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form card */}
          <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '32px' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}>
              {current.desc}
            </p>

            <form onSubmit={handleDonate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Amount presets */}
              <div>
                <label className="label">Select Amount (THB)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '8px' }}>
                  {PRESET_AMOUNTS.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(String(val))}
                      style={{
                        padding: '14px 8px',
                        borderRadius: '8px',
                        border: `1px solid ${amount === String(val) ? current.color : '#2a2a2a'}`,
                        background: amount === String(val) ? current.color + '15' : '#1a1a1a',
                        color: amount === String(val) ? current.color : '#fff',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      ฿{val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  style={{
                    marginTop: '10px', width: '100%', padding: '11px',
                    borderRadius: '8px',
                    border: `1px solid ${amount === 'custom' ? current.color : '#2a2a2a'}`,
                    background: amount === 'custom' ? current.color + '15' : '#1a1a1a',
                    color: amount === 'custom' ? current.color : '#9ca3af',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  Enter Custom Amount
                </button>
              </div>

              {amount === 'custom' && (
                <div className="form-group">
                  <label className="label">Custom Amount (THB)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1rem', fontWeight: 600 }}>฿</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="input"
                      style={{ paddingLeft: '32px', fontSize: '1.1rem' }}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="label">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Message (Optional)</label>
                <textarea className="input" placeholder="Leave a message of support..." rows={3} style={{ resize: 'vertical' }} />
              </div>

              <button
                type="submit"
                disabled={!amount}
                style={{
                  width: '100%', padding: '16px', borderRadius: '10px', border: 'none',
                  background: amount ? current.color : '#2a2a2a',
                  color: amount ? '#fff' : '#6b7280',
                  fontSize: '1rem', fontWeight: 700, cursor: amount ? 'pointer' : 'default',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Heart size={18} />
                Donate Now
              </button>

              <p style={{ color: '#6b7280', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.6 }}>
                Donations are collected in Thai Baht (THB). For bank transfer or QR payment details, please contact us at <span style={{ color: '#9ca3af' }}>contact@3sgate.com</span>.
              </p>
            </form>
          </div>
        </div>
      </div>

      {showThankYou && (
        <div className="toast-container">
          <div className="toast toast-success">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart size={20} color="#22c55e" />
              <div>
                <p style={{ color: '#fff', fontWeight: 700 }}>Thank you{donorName ? `, ${donorName}` : ''}!</p>
                <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Your support means everything to our community.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
