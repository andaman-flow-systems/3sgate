'use client';

import { useState } from 'react';
import { Heart, Users, BookOpen, QrCode, Building2, Copy, Check, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { sbDonationsDB } from '@/lib/supabase-db';
import { donationsDB } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';

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
] as const;

const PRESET_AMOUNTS = [200, 500, 1000, 2000];

export default function DonatePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<'support-me' | 'refugee' | 'scholarship'>('support-me');
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');

  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedPromptPay, setCopiedPromptPay] = useState(false);

  const current = DONATION_TYPES.find(d => d.id === activeTab)!;

  const getFinalAmount = () => {
    return amount === 'custom' ? Number(customAmount) : Number(amount);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVal = getFinalAmount();
    if (!finalVal || finalVal <= 0) return;
    setStep(2);
  };

  const handleConfirmTransfer = async () => {
    const finalVal = getFinalAmount();
    const payload = {
      type: activeTab,
      donorName: donorName.trim() || 'Anonymous',
      amount: finalVal,
      message: message.trim() || undefined,
    };

    try {
      if (isSupabaseConfigured()) {
        await sbDonationsDB.create(payload);
      } else {
        donationsDB.create(payload);
      }
    } catch {
      // Fallback
      donationsDB.create(payload);
    }

    setStep(3);
  };

  const copyToClipboard = (text: string, type: 'bank' | 'promptpay') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedPromptPay(true);
      setTimeout(() => setCopiedPromptPay(false), 2000);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAmount('500');
    setCustomAmount('');
    setDonorName('');
    setMessage('');
  };

  return (
    <div>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0505 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#ef444420',
              border: '1px solid #ef444450', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={22} color="#ef4444" />
            </div>
            <h1 style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 800 }}>Make an Impact</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Your contribution directly supports our community initiatives. All amounts are in Thai Baht (THB).
          </p>

          {/* Stepper indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px',
            background: '#111111', padding: '12px 20px', borderRadius: '12px', width: 'fit-content',
            border: '1px solid #2a2a2a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: step >= 1 ? '#ef4444' : '#2a2a2a', color: '#fff',
                fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>1</div>
              <span style={{ fontSize: '0.85rem', color: step >= 1 ? '#fff' : '#6b7280', fontWeight: 600 }}>Choose Amount</span>
            </div>
            <div style={{ width: '20px', height: '1px', background: '#2a2a2a' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: step >= 2 ? '#ef4444' : '#2a2a2a', color: '#fff',
                fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>2</div>
              <span style={{ fontSize: '0.85rem', color: step >= 2 ? '#fff' : '#6b7280', fontWeight: 600 }}>QR & Bank Transfer</span>
            </div>
            <div style={{ width: '20px', height: '1px', background: '#2a2a2a' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: step >= 3 ? '#22c55e' : '#2a2a2a', color: '#fff',
                fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>3</div>
              <span style={{ fontSize: '0.85rem', color: step >= 3 ? '#22c55e' : '#6b7280', fontWeight: 600 }}>Thank You</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* STEP 1: Select Category & Amount */}
          {step === 1 && (
            <div>
              {/* Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                {DONATION_TYPES.map(type => {
                  const isActive = activeTab === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => { setActiveTab(type.id); }}
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

                <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                          placeholder="100"
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
                      placeholder="Anonymous Donor"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Message of Support (Optional)</label>
                    <textarea
                      className="input"
                      placeholder="Leave a word of encouragement..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!amount || (amount === 'custom' && (!customAmount || Number(customAmount) <= 0))}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '10px', border: 'none',
                      background: current.color,
                      color: '#fff',
                      fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      opacity: (!amount || (amount === 'custom' && (!customAmount || Number(customAmount) <= 0))) ? 0.5 : 1,
                    }}
                  >
                    Proceed to Payment (฿{getFinalAmount().toLocaleString()} THB) →
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 2: PromptPay QR & Bank Account */}
          {step === 2 && (
            <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '32px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: 'transparent', border: 'none', color: '#9ca3af',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem',
                  cursor: 'pointer', marginBottom: '20px'
                }}
              >
                <ArrowLeft size={16} /> Back to Edit Amount
              </button>

              <div style={{
                background: '#1a1a1a', padding: '16px 20px', borderRadius: '12px',
                border: '1px solid #2a2a2a', marginBottom: '28px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'block' }}>Donation Summary</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{current.title}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'block' }}>Total Amount</span>
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.3rem' }}>฿{getFinalAmount().toLocaleString()} THB</span>
                </div>
              </div>

              <div className="cards-grid-2" style={{ alignItems: 'start' }}>
                
                {/* Exact Thai QR Payment Photo */}
                <div style={{
                  background: '#ffffff', borderRadius: '16px',
                  overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '8px'
                }}>
                  <img
                    src="/promptpay-qr.jpg"
                    alt="Thai QR Payment - MR. HEIN THANT"
                    style={{ width: '100%', maxWidth: '340px', height: 'auto', borderRadius: '12px', display: 'block' }}
                  />
                </div>

                {/* Bank Account Transfer Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px',
                    padding: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px', background: '#10b98120',
                        border: '1px solid #10b98140', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Building2 size={20} color="#10b981" />
                      </div>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>Direct Bank Transfer</h4>
                        <p style={{ color: '#22c55e', fontSize: '0.78rem', fontWeight: 600 }}>Kasikornbank (KBank)</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <span style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '2px' }}>Account Holder Name</span>
                        <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700 }}>MR. HEIN THANT</span>
                      </div>

                      {/* Bank Acc Number box with copy */}
                      <div style={{
                        background: '#1a1a1a', padding: '14px 16px', borderRadius: '10px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        border: '1px solid #2a2a2a'
                      }}>
                        <div>
                          <span style={{ color: '#6b7280', fontSize: '0.72rem', display: 'block', marginBottom: '2px' }}>KBank Account Number</span>
                          <span style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                            7014952040
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard('7014952040', 'bank')}
                          style={{
                            background: copiedBank ? '#22c55e' : '#22c55e20',
                            border: `1px solid ${copiedBank ? '#22c55e' : '#22c55e60'}`,
                            color: copiedBank ? '#000' : '#22c55e',
                            padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {copiedBank ? <Check size={16} /> : <Copy size={16} />}
                          {copiedBank ? 'Copied!' : 'Copy Acc'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions banner */}
                  <div style={{
                    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px',
                    padding: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start'
                  }}>
                    <ShieldCheck size={18} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: '#9ca3af', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>
                      After completing the payment in your banking app, click below to confirm. Your support makes a direct difference!
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmTransfer}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '10px', border: 'none',
                      background: '#22c55e', color: '#fff',
                      fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 4px 16px #22c55e30'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    I Have Completed the Transfer
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: Thank You Screen */}
          {step === 3 && (
            <div style={{
              background: '#111111', border: '1px solid #22c55e40', borderRadius: '20px',
              padding: '48px 32px', textAlign: 'center',
              boxShadow: '0 12px 40px #22c55e15'
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', background: '#22c55e20',
                border: '2px solid #22c55e', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>
                <Sparkles size={36} color="#22c55e" />
              </div>

              <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
                Thank You for Your Donation!
              </h2>

              <p style={{ color: '#9ca3af', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                {donorName ? <strong style={{ color: '#fff' }}>{donorName}</strong> : 'Generous Friend'}, your contribution of <strong style={{ color: '#22c55e' }}>฿{getFinalAmount().toLocaleString()} THB</strong> to <span style={{ color: '#a855f7' }}>{current.title}</span> has been recorded.
              </p>

              <div style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px',
                padding: '20px', maxWidth: '400px', margin: '0 auto 28px', textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Cause</span>
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{current.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Donor</span>
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{donorName || 'Anonymous'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Amount</span>
                  <span style={{ color: '#22c55e', fontSize: '0.95rem', fontWeight: 800 }}>฿{getFinalAmount().toLocaleString()} THB</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={resetForm}
                  className="btn"
                  style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333' }}
                >
                  Make Another Donation
                </button>
                <a href="/" className="btn btn-purple">
                  Return to Home Page
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
