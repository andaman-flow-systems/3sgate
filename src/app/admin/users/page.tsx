'use client';

import { useState, useEffect } from 'react';
import { usersDB, type AdminUser } from '@/lib/db';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setUsers(usersDB.getAll());
  }, []);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (usersDB.findByUsername(username)) {
      setError('Username already exists.');
      return;
    }

    usersDB.create({
      username,
      passwordHash: btoa(password),
      role: formData.get('role') as AdminUser['role'],
      displayName: formData.get('displayName') as string,
    });

    setUsers(usersDB.getAll());
    setIsAdding(false);
    setError('');
    setSuccess('User created successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (id === 'admin-001') {
      alert('Cannot delete the primary admin account.');
      return;
    }
    if (confirm('Delete this user?')) {
      usersDB.delete(id);
      setUsers(usersDB.getAll());
    }
  };

  const ROLE_COLOR: Record<AdminUser['role'], string> = {
    'super-admin': '#a855f7',
    'admin': '#3b82f6',
    'editor': '#22c55e',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Admin Users</h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
            Manage who has access to the admin panel.
          </p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add User
        </button>
      </div>

      {success && (
        <div style={{ background: '#22c55e20', border: '1px solid #22c55e', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#22c55e', fontSize: '0.9rem' }}>
          {success}
        </div>
      )}

      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Display Name</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Username</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Role</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Created</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #1e1e1e' }}>
                <td style={{ padding: '16px', color: '#fff', fontWeight: 600 }}>{u.displayName}</td>
                <td style={{ padding: '16px', color: '#9ca3af', fontFamily: 'monospace' }}>{u.username}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                    color: ROLE_COLOR[u.role], background: ROLE_COLOR[u.role] + '20',
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.82rem' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  {u.id !== 'admin-001' ? (
                    <button onClick={() => handleDelete(u.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                      Remove
                    </button>
                  ) : (
                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Primary Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '480px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>Add New Admin User</h2>
            {error && (
              <div style={{ background: '#ef444420', border: '1px solid #ef4444', borderRadius: '6px', padding: '10px', marginBottom: '16px', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Display Name</label>
                <input name="displayName" className="input" required />
              </div>
              <div className="form-group">
                <label className="label">Username</label>
                <input name="username" className="input" required />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input name="password" type="password" className="input" minLength={6} required />
              </div>
              <div className="form-group">
                <label className="label">Role</label>
                <select name="role" className="input">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setError(''); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
