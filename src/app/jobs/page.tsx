'use client';

import { useState, useEffect } from 'react';
import { jobsDB, type JobListing } from '@/lib/db';
import { Briefcase, Banknote } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filtered, setFiltered] = useState<JobListing[]>([]);
  const [filter, setFilter] = useState('all'); // all, direct, agent

  useEffect(() => {
    const active = jobsDB.getActive().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setJobs(active);
    setFiltered(active);
  }, []);

  useEffect(() => {
    if (filter === 'all') setFiltered(jobs);
    else if (filter === 'direct') setFiltered(jobs.filter(j => !j.isRecruitmentAgent));
    else if (filter === 'agent') setFiltered(jobs.filter(j => j.isRecruitmentAgent));
  }, [filter, jobs]);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #051a0c 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', background: '#22c55e20', border: '1px solid #22c55e50', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={22} color="#22c55e" />
            </div>
            <h1 style={{ color: '#22c55e', fontSize: '2rem', fontWeight: 800 }}>Job Listings</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            Find the right opportunities. Connect directly with employers or reliable recruitment agents.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'direct', label: 'Direct Employers' },
            { id: 'agent', label: 'Recruitment Agents' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                border: `1px solid ${filter === f.id ? '#22c55e' : '#2a2a2a'}`,
                background: filter === f.id ? '#22c55e15' : '#111111',
                color: filter === f.id ? '#22c55e' : '#9ca3af',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'Inter,sans-serif',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(job => (
            <div key={job.id} style={{
              background: '#111111',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '24px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#22c55e';
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 4px 20px rgba(34,197,94,0.1)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#2a2a2a';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: '#22c55e20', color: '#4ade80', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {job.type.replace('-', ' ')}
                    </span>
                    {job.isRecruitmentAgent && (
                      <span style={{ background: '#3b82f620', color: '#60a5fa', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                        Recruitment Agent
                      </span>
                    )}
                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                    {job.title}
                  </h2>
                  <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '16px' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{job.company}</span> • {job.location}
                  </p>
                  
                  {job.salary && (
                    <p style={{ color: '#22c55e', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Banknote size={16} color="#22c55e" /> {job.salary}
                    </p>
                  )}
                  
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    {job.description}
                  </p>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '8px' }}>Requirements:</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#9ca3af', fontSize: '0.85rem' }}>
                      {job.requirements.map((req, i) => <li key={i} style={{ marginBottom: '4px' }}>{req}</li>)}
                    </ul>
                  </div>
                </div>
                
                <div style={{ flexShrink: 0 }}>
                  <a href={`mailto:${job.contactEmail}`} className="btn btn-green" style={{ textDecoration: 'none' }}>
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
            <p>No job listings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
