'use client';

import { useState, useEffect } from 'react';
import { settingsDB, type SiteSettings } from '@/lib/db';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(settingsDB.get());
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    settingsDB.set({
      siteName: formData.get('siteName') as string,
      tagline: formData.get('tagline') as string,
      contactEmail: formData.get('contactEmail') as string,
      maintenanceMode: formData.get('maintenanceMode') === 'on',
    });
    setSettings(settingsDB.get());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return null;

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Site Settings</h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '4px' }}>
          Configure global settings for the 3SGate platform.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#1a1a1a' }}>
            <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>General</h3>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="label">Site Name</label>
              <input name="siteName" defaultValue={settings.siteName} className="input" required />
            </div>
            <div className="form-group">
              <label className="label">Tagline</label>
              <input name="tagline" defaultValue={settings.tagline} className="input" required />
            </div>
            <div className="form-group">
              <label className="label">Contact Email</label>
              <input name="contactEmail" type="email" defaultValue={settings.contactEmail} className="input" required />
            </div>
          </div>
        </div>

        <div style={{ background: '#111111', border: '1px solid #ef444430', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#1a1a1a' }}>
            <h3 style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 600 }}>Danger Zone</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 500, marginBottom: '4px' }}>Maintenance Mode</p>
              <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>When enabled, visitors will see a maintenance page.</p>
            </div>
            <input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenanceMode} style={{ width: '18px', height: '18px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" className="btn btn-purple" style={{ padding: '12px 28px' }}>
            Save Settings
          </button>
          {saved && (
            <span style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 600 }}>
              Settings saved successfully.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
