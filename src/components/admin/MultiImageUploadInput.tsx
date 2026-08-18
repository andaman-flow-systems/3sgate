'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { uploadImageToSupabase } from '@/lib/supabase-storage';
import { Upload, Link as LinkIcon, X, Loader, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

const MAX_IMAGES = 3;

interface MultiImageUploadInputProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

interface SingleSlotProps {
  index: number;
  value: string;
  onSet: (url: string) => void;
  onRemove: () => void;
}

function SingleImageSlot({ index, value, onSet, onRemove }: SingleSlotProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'warn'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setStatusMsg(null);
    setUploading(true);
    try {
      const res = await uploadImageToSupabase(file);
      onSet(res.url);
      if (res.uploadedToStorage) {
        setStatusMsg({ type: 'success', text: 'Uploaded to Supabase ✓' });
      } else if (res.warning) {
        setStatusMsg({ type: 'warn', text: res.warning });
      }
    } catch (err) {
      setError((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onSet]);

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

  if (value) {
    // Show thumbnail with remove button
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', border: '1px solid #3a3a3a', background: '#1a1a1a' }}>
        <img
          src={value}
          alt={`Image ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%)', pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', color: '#D4A017', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
          IMG {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          style={{ position: 'absolute', top: '6px', right: '6px', background: '#ef4444', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}
          title="Remove image"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  // Empty slot — show upload zone
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#161616', borderRadius: '6px', padding: '3px', border: '1px solid #2a2a2a', width: 'fit-content' }}>
        <button type="button" onClick={() => setMode('upload')} style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: mode === 'upload' ? '#a855f7' : 'transparent', color: mode === 'upload' ? '#fff' : '#9ca3af', fontWeight: 600, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
          <Upload size={11} /> Upload
        </button>
        <button type="button" onClick={() => setMode('url')} style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: mode === 'url' ? '#a855f7' : 'transparent', color: mode === 'url' ? '#fff' : '#9ca3af', fontWeight: 600, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
          <LinkIcon size={11} /> URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? '#a855f7' : '#3a3a3a'}`, borderRadius: '8px', padding: '16px 8px', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#a855f715' : '#1a1a1a', transition: 'all 0.2s', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {uploading ? (
              <>
                <Loader size={20} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.72rem' }}>Uploading…</p>
              </>
            ) : (
              <>
                <Plus size={22} color="#6b7280" />
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.72rem' }}>Drop or click</p>
                <p style={{ color: '#4b5563', margin: 0, fontSize: '0.65rem' }}>Image {index + 1}</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          className="input"
          style={{ fontSize: '0.78rem' }}
          onChange={(e) => { setError(null); onSet(e.target.value); }}
        />
      )}

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}
      {statusMsg && (
        <div style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', color: statusMsg.type === 'success' ? '#22c55e' : '#f59e0b' }}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {statusMsg.text}
        </div>
      )}
    </div>
  );
}

export default function MultiImageUploadInput({ values, onChange, label = 'Images (max 3)' }: MultiImageUploadInputProps) {
  const handleSet = (index: number, url: string) => {
    const next = [...values];
    next[index] = url;
    // remove empty trailing slots
    onChange(next.filter((u, i) => u || i < next.length - 1));
  };

  const handleRemove = (index: number) => {
    const next = values.filter((_, i) => i !== index);
    onChange(next);
  };

  // Always show up to MAX_IMAGES slots (filled + 1 empty if < max)
  const slots: (string | undefined)[] = [];
  for (let i = 0; i < MAX_IMAGES; i++) {
    slots.push(values[i] ?? undefined);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {label && (
        <label className="label">
          {label}
          <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
            ({values.filter(Boolean).length}/{MAX_IMAGES} uploaded — thumbnails shown, full size on listing)
          </span>
        </label>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {slots.map((url, i) => {
          const isDisabled = i > values.filter(Boolean).length;
          if (isDisabled) {
            return (
              <div key={i} style={{ aspectRatio: '4/3', borderRadius: '10px', border: '2px dashed #222', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <span style={{ color: '#4b5563', fontSize: '0.7rem' }}>Slot {i + 1}</span>
              </div>
            );
          }
          return (
            <SingleImageSlot
              key={i}
              index={i}
              value={url ?? ''}
              onSet={(u) => handleSet(i, u)}
              onRemove={() => handleRemove(i)}
            />
          );
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
