'use client';

import { useState, useEffect, useCallback } from 'react';
import { sbJobsDB } from '@/lib/supabase-db';
import { jobsDB, type JobListing } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, MapPin, Clock, DollarSign, Mail, Search, X } from 'lucide-react';

export default function JobsPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filtered, setFiltered] = useState<JobListing[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await sbJobsDB.getActive();
        setJobs(data);
        setFiltered(data);
      } else {
        const data = jobsDB.getActive();
        setJobs(data);
        setFiltered(data);
      }
    } catch {
      const data = jobsDB.getActive();
      setJobs(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  useEffect(() => {
    let result = jobs;
    if (typeFilter !== 'all') {
      result = result.filter(j => j.type === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, typeFilter, jobs]);

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return t('jobsFullTime');
      case 'part-time': return t('jobsPartTime');
      case 'contract': return t('jobsContract');
      case 'freelance': return t('jobsFreelance');
      default: return t('jobsAllTypes');
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #09121d 0%, #0b0b0b 100%)',
        borderBottom: '1px solid #2a2a2a',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#3b82f620',
              border: '1px solid #3b82f650', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Briefcase size={22} color="#3b82f6" />
            </div>
            <h1 style={{ color: '#3b82f6', fontSize: '2rem', fontWeight: 800 }}>{t('jobsHeroTitle')}</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.92rem' }}>
            {t('jobsHeroSub')}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filters */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          flexWrap: 'wrap', marginBottom: '28px', justifyContent: 'space-between'
        }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={t('jobsSearchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
                padding: '9px 14px 9px 36px', color: '#fff', fontSize: '0.88rem', width: '100%',
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'full-time', 'part-time', 'contract', 'freelance'].map(typeKey => (
              <button
                key={typeKey}
                onClick={() => setTypeFilter(typeKey)}
                style={{
                  padding: '8px 14px', borderRadius: '8px',
                  border: `1px solid ${typeFilter === typeKey ? '#3b82f6' : '#2a2a2a'}`,
                  background: typeFilter === typeKey ? '#3b82f620' : '#111111',
                  color: typeFilter === typeKey ? '#3b82f6' : '#9ca3af',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {getJobTypeLabel(typeKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('loading')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  background: '#111111', border: '1px solid #2a2a2a',
                  borderRadius: '14px', padding: '24px', cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between',
                  gap: '20px', alignItems: 'center'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#3b82f6';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#2a2a2a';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>{job.title}</h3>
                    {job.isRecruitmentAgent && (
                      <span style={{
                        background: '#a855f720', border: '1px solid #a855f750', color: '#a855f7',
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px'
                      }}>
                        {t('jobsRecruitmentAgent')}
                      </span>
                    )}
                  </div>

                  <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '12px' }}>
                    <strong style={{ color: '#fff' }}>{job.company}</strong> · <MapPin size={13} color="#6b7280" style={{ display: 'inline', verticalAlign: '-1px' }} /> {job.location}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="#3b82f6" /> {getJobTypeLabel(job.type)}
                    </span>
                    {job.salary && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontWeight: 600 }}>
                        <DollarSign size={14} /> {job.salary}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  style={{
                    background: '#3b82f620', border: '1px solid #3b82f6', color: '#3b82f6',
                    padding: '10px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {t('viewDetails')}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p>{t('jobsNoJobs')}</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>{selectedJob.title}</h2>
                <p style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.95rem' }}>{selectedJob.company}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.72rem', display: 'block' }}>{t('location')}</span>
                <span style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{selectedJob.location}</span>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.72rem', display: 'block' }}>{t('category')}</span>
                <span style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{getJobTypeLabel(selectedJob.type)}</span>
              </div>
              {selectedJob.salary && (
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.72rem', display: 'block' }}>{t('jobsSalary')}</span>
                  <span style={{ color: '#22c55e', fontSize: '0.88rem', fontWeight: 700 }}>{selectedJob.salary}</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Description</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6 }}>{selectedJob.description}</p>
            </div>

            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>{t('jobsRequirements')}</h4>
                <ul style={{ paddingLeft: '20px', color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.7 }}>
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`mailto:${selectedJob.contactEmail}`}
                style={{
                  flex: 1, padding: '14px', borderRadius: '10px', background: '#3b82f6', color: '#fff',
                  textAlign: 'center', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Mail size={18} /> {t('jobsApplyEmail')}: {selectedJob.contactEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
