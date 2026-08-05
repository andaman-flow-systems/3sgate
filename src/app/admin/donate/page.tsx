'use client';

import { useState, useEffect } from 'react';
import { donationsDB, type DonationRecord } from '@/lib/db';

const TYPES = [
  { id: 'support-me', label: 'Support Me', color: '#a855f7' },
  { id: 'refugee',    label: 'Refugee Support', color: '#ef4444' },
  { id: 'scholarship',label: 'Scholarships', color: '#22c55e' },
];

export default function AdminDonate() {
  const [records, setRecords] = useState<DonationRecord[]>([]);

  useEffect(() => {
    const all = donationsDB.getAll().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecords(all);
  }, []);

  const totalByType = (type: DonationRecord['type']) =>
    donationsDB.getTotalByType(type);

  const getTypeLabel = (type: DonationRecord['type']) =>
    TYPES.find(t => t.id === type)?.label ?? type;
  const getTypeColor = (type: DonationRecord['type']) =>
    TYPES.find(t => t.id === type)?.color ?? '#fff';

  const grandTotal = records.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Donation Management</h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>View all donations received through the platform.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '6px' }}>Total Donations</p>
          <p style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700 }}>฿{grandTotal.toLocaleString()}</p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px' }}>{records.length} records</p>
        </div>
        {TYPES.map(type => (
          <div key={type.id} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '6px' }}>{type.label}</p>
            <p style={{ color: type.color, fontSize: '1.6rem', fontWeight: 700 }}>
              ฿{totalByType(type.id as DonationRecord['type']).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a' }}>
          <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>All Donation Records</h3>
        </div>
        {records.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
            <p>No donations received yet. They will appear here once visitors donate.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px', borderBottom: '1px solid #2a2a2a' }}>Donor</th>
                <th style={{ padding: '14px 20px', borderBottom: '1px solid #2a2a2a' }}>Type</th>
                <th style={{ padding: '14px 20px', borderBottom: '1px solid #2a2a2a' }}>Amount</th>
                <th style={{ padding: '14px 20px', borderBottom: '1px solid #2a2a2a' }}>Message</th>
                <th style={{ padding: '14px 20px', borderBottom: '1px solid #2a2a2a' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 600 }}>{r.donorName}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      color: getTypeColor(r.type),
                      background: getTypeColor(r.type) + '20',
                    }}>
                      {getTypeLabel(r.type)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#22c55e', fontWeight: 700 }}>
                    ฿{r.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#9ca3af', fontSize: '0.85rem', maxWidth: '200px' }}>
                    {r.message || '—'}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#6b7280', fontSize: '0.82rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
