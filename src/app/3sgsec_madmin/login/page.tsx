'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Logo from '@/components/Logo';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      router.push('/3sgsec_madmin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0512 0%, #000 100%)',
      padding: '24px',
    }}>
      <div style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(168,85,247,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <Logo size="lg" />
        </div>
        
        <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, textAlign: 'center', marginBottom: '24px' }}>
          Admin Login
        </h2>
        
        {error && (
          <div style={{ background: '#ef444420', borderLeft: '3px solid #ef4444', padding: '12px', color: '#f87171', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input"
              style={{ padding: '12px' }}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              style={{ padding: '12px' }}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-purple" style={{ padding: '14px', width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '1rem' }}>
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
