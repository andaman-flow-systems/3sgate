'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbJobsDB } from '@/lib/supabase-db';
import { jobsDB, type JobListing } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Briefcase, Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isEditing, setIsEditing] = useState<JobListing | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      if (configured) {
        const data = await sbJobsDB.getAll();
        setJobs(data);
      } else {
        setJobs(jobsDB.getAll());
      }
    } catch {
      setJobs(jobsDB.getAll());
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      if (configured) {
        await sbJobsDB.delete(id);
      } else {
        jobsDB.delete(id);
      }
      showToast('Job listing deleted');
      loadJobs();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const reqString = formData.get('requirements') as string;
    const requirements = reqString ? reqString.split('\n').map(s => s.trim()).filter(Boolean) : [];

    const jobData: Omit<JobListing, 'id' | 'createdAt'> = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as JobListing['type'],
      salary: formData.get('salary') as string,
      description: formData.get('description') as string,
      requirements,
      contactEmail: formData.get('contactEmail') as string,
      isRecruitmentAgent: formData.get('isRecruitmentAgent') === 'on',
      status: formData.get('status') as JobListing['status'],
    };

    try {
      if (isEditing) {
        if (configured) {
          await sbJobsDB.update(isEditing.id, jobData);
        } else {
          jobsDB.update(isEditing.id, jobData);
        }
        showToast('Job updated ✓');
      } else {
        if (configured) {
          await sbJobsDB.create(jobData);
        } else {
          jobsDB.create(jobData);
        }
        showToast('Job created ✓');
      }
      setIsEditing(null);
      setIsAdding(false);
      loadJobs();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#16a34a', color: '#fff', padding: '12px 20px',
          borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 4px 24px #00000080',
        }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Job Listings</h2>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
            {configured ? `${jobs.length} jobs in Supabase` : `${jobs.length} jobs in local storage`}
          </p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Job Listing
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Job Title</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Company</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Location</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Type</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Status</th>
                <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '16px', color: '#fff', fontWeight: 600 }}>{j.title}</td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{j.company}</td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{j.location}</td>
                  <td style={{ padding: '16px', textTransform: 'capitalize', color: '#a78bfa' }}>{j.type}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                      background: j.status === 'active' ? '#22c55e20' : '#ef444420',
                      color: j.status === 'active' ? '#22c55e' : '#ef4444'
                    }}>
                      {j.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => setIsEditing(j)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(j.id)} style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>
              {isEditing ? 'Edit Job Listing' : 'Add Job Listing'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Job Title</label>
                <input name="title" defaultValue={isEditing?.title} className="input" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Company Name</label>
                  <input name="company" defaultValue={isEditing?.company} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Location</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Job Type</label>
                  <select name="type" defaultValue={isEditing?.type || 'full-time'} className="input" style={{ background: '#1a1a1a', color: '#fff' }}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Salary Range</label>
                  <input name="salary" defaultValue={isEditing?.salary} placeholder="12,000 - 15,000 THB / month" className="input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Contact Email</label>
                <input name="contactEmail" type="email" defaultValue={isEditing?.contactEmail} className="input" required />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={3} required />
              </div>

              <div className="form-group">
                <label className="label">Requirements (One per line)</label>
                <textarea name="requirements" defaultValue={isEditing?.requirements?.join('\n')} className="input" rows={3} />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ color: '#fff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" name="isRecruitmentAgent" defaultChecked={isEditing?.isRecruitmentAgent} />
                  Recruitment Agency
                </label>
                <label style={{ color: '#fff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select name="status" defaultValue={isEditing?.status || 'active'} style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '4px 8px', borderRadius: '4px' }}>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                  Status
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
