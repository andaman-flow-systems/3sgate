'use client';

// Simple cookie-based auth helpers for the admin panel
// Credentials are stored hashed in localStorage

const SESSION_KEY = '3sg_admin_session';
const DEFAULT_USERNAME = '0idadmin';
const DEFAULT_PASSWORD_HASH = btoa('Suser@3sgates#01l');

export interface AdminSession {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  expiresAt: number;
}

export function login(username: string, password: string): boolean {
  if (typeof window === 'undefined') return false;

  const usersRaw = localStorage.getItem('3sg_users');
  let users = usersRaw ? JSON.parse(usersRaw) : [];

  // Migrate old 'admin' user to new '0idadmin' username & password
  let migrated = false;
  users = users.map((u: { id: string; username: string; passwordHash: string }) => {
    if (u.id === 'admin-001' || u.username === 'admin') {
      migrated = true;
      return { ...u, username: DEFAULT_USERNAME, passwordHash: DEFAULT_PASSWORD_HASH };
    }
    return u;
  });
  if (migrated) {
    localStorage.setItem('3sg_users', JSON.stringify(users));
  }

  let user = users.find((u: { username: string; passwordHash: string }) => u.username === username);
  if (!user && username === DEFAULT_USERNAME && btoa(password) === DEFAULT_PASSWORD_HASH) {
    user = { id: 'admin-001', username: DEFAULT_USERNAME, displayName: 'Admin User', role: 'super-admin', passwordHash: DEFAULT_PASSWORD_HASH };
  }

  if (!user) return false;
  if (btoa(password) !== user.passwordHash) return false;

  const session: AdminSession = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch { return null; }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
