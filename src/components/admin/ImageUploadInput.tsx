'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { uploadImageToSupabase } from '@/lib/supabase-storage';
import { Upload, Link as LinkIcon, X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = 'Picture / Image',
  placeholder = 'https://example.com/photo.jpg',
}: ImageUploadInputProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'warn'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setStatusMsg(null);
      setUploading(true);

      try {
        const res = await uploadImageToSupabase(file);
        onChange(res.url);

        if (res.uploadedToStorage) {
          setStatusMsg({ type: 'success', text: 'Uploaded to Supabase Cloud Storage ✓' });
        } else if (res.warning) {
          setStatusMsg({ type: 'warn', text: res.warning });
        }
      } catch (err) {
        setError((err as Error).message || 'Failed to process image');
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && <label className="label">{label}</label>}

      {/* Mode Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          background: '#161616',
          borderRadius: '8px',
          padding: '4px',
          border: '1px solid #2a2a2a',
          width: 'fit-content',
        }}
      >
        <button
          type="button"
          onClick={() => setMode('upload')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: mode === 'upload' ? '#a855f7' : 'transparent',
            color: mode === 'upload' ? '#fff' : '#9ca3af',
            fontWeight: 600,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <Upload size={14} /> Upload Picture
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: mode === 'url' ? '#a855f7' : 'transparent',
            color: mode === 'url' ? '#fff' : '#9ca3af',
            fontWeight: 600,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <LinkIcon size={14} /> Picture URL
        </button>
      </div>

      {/* Upload Zone or URL Input */}
      {mode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#a855f7' : '#3a3a3a'}`,
              borderRadius: '10px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? '#a855f715' : '#1a1a1a',
              transition: 'all 0.2s',
            }}
          >
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Loader size={26} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>Uploading & processing picture...</p>
              </div>
            ) : (
              <div>
                <Upload size={26} color="#9ca3af" style={{ marginBottom: '6px' }} />
                <p style={{ color: '#fff', margin: '0 0 4px', fontWeight: 600, fontSize: '0.88rem' }}>
                  Drag & drop picture file here
                </p>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.78rem' }}>
                  or <span style={{ color: '#c084fc', fontWeight: 600 }}>click to browse</span> (JPG, PNG, WebP, GIF)
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <input
          type="text"
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => {
            setError(null);
            setStatusMsg(null);
            onChange(e.target.value);
          }}
          className="input"
          placeholder={placeholder}
        />
      )}

      {/* Error Message */}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Status Message */}
      {statusMsg && (
        <div
          style={{
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: statusMsg.type === 'success' ? '#22c55e' : '#f59e0b',
            background: statusMsg.type === 'success' ? '#22c55e10' : '#f59e0b10',
            padding: '6px 10px',
            borderRadius: '6px',
            border: `1px solid ${statusMsg.type === 'success' ? '#22c55e30' : '#f59e0b30'}`,
          }}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {statusMsg.text}
        </div>
      )}

      {/* Picture Preview */}
      {value && (
        <div style={{ marginTop: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 600 }}>Preview:</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={value}
              alt="Picture preview"
              style={{
                width: '120px',
                height: '90px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #3a3a3a',
                display: 'block',
                background: '#111',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => {
                onChange('');
                setStatusMsg(null);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              }}
              title="Remove picture"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
