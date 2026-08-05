'use client';

import { useState, useEffect } from 'react';
import { jobsDB, type JobListing } from '@/lib/db';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isEditing, setIsEditing] = useState<JobListing | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setJobs(jobsDB.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job listing?')) {
      jobsDB.delete(id);
      setJobs(jobsDB.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse requirements back into an array
    const reqsString = formData.get('requirements') as string;
    const requirements = reqsString.split('\n').map(s => s.trim()).filter(Boolean);

    const job: Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as 'full-time' | 'part-time' | 'contract',
      description: formData.get('description') as string,
      requirements,
      salary: formData.get('salary') as string || undefined,
      contactEmail: formData.get('contactEmail') as string,
      isRecruitmentAgent: formData.get('isRecruitmentAgent') === 'on',
      status: formData.get('status') as 'active' | 'closed',
    };

    if (isEditing) {
      jobsDB.update(isEditing.id, job);
    } else {
      jobsDB.create(job);
    }

    setJobs(jobsDB.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Manage Jobs</h2>
        <button onClick={() => setIsAdding(true)} className="btn btn-purple">
          + Add Job
        </button>
      </div>

      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Title / Company</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Type</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Location</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>Listed By</th>
              <th style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '16px' }}>
                  <p style={{ color: '#fff', fontWeight: 600 }}>{j.title}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{j.company}</p>
                </td>
                <td style={{ padding: '16px', color: '#9ca3af', textTransform: 'capitalize' }}>{j.type.replace('-', ' ')}</td>
                <td style={{ padding: '16px', color: '#9ca3af' }}>{j.location}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                    background: j.isRecruitmentAgent ? '#3b82f620' : '#22c55e20',
                    color: j.isRecruitmentAgent ? '#60a5fa' : '#4ade80'
                  }}>
                    {j.isRecruitmentAgent ? 'Agent' : 'Direct'}
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

      {/* Modal */}
      {(isAdding || isEditing) && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '700px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>
              {isEditing ? 'Edit Job' : 'Add New Job'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Job Title</label>
                  <input name="title" defaultValue={isEditing?.title} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Company</label>
                  <input name="company" defaultValue={isEditing?.company} className="input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Location</label>
                  <input name="location" defaultValue={isEditing?.location} className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Type</label>
                  <select name="type" defaultValue={isEditing?.type || 'full-time'} className="input" required>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select name="status" defaultValue={isEditing?.status || 'active'} className="input" required>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Salary (Optional)</label>
                  <input name="salary" defaultValue={isEditing?.salary} className="input" />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" defaultValue={isEditing?.description} className="input" rows={3} required />
              </div>

              <div className="form-group">
                <label className="label">Requirements (One per line)</label>
                <textarea 
                  name="requirements" 
                  defaultValue={isEditing?.requirements.join('\n')} 
                  className="input" 
                  rows={4} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="label">Contact Email</label>
                <input name="contactEmail" type="email" defaultValue={isEditing?.contactEmail} className="input" required />
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" name="isRecruitmentAgent" defaultChecked={isEditing ? isEditing.isRecruitmentAgent : false} id="agent" />
                  <label htmlFor="agent" style={{ color: '#fff' }}>Posted by Agent</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="btn" style={{ background: '#1a1a1a', color: '#fff' }}>Cancel</button>
                <button type="submit" className="btn btn-purple">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
