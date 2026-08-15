import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Compress an image file using HTML Canvas to reduce base64 size if bucket upload fails or fallback is used.
 */
export async function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Supabase Storage bucket ('images').
 * If bucket upload succeeds, returns the public CDN URL.
 * If bucket upload fails (e.g. bucket not created in Supabase dashboard),
 * compresses image and returns Data URL as fallback so post creation never fails.
 */
export async function uploadImageToSupabase(
  file: File,
  bucketName = 'images'
): Promise<{ url: string; uploadedToStorage: boolean; warning?: string }> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image (JPG, PNG, WebP, GIF)');
  }

  // Maximum file size: 15 MB
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Image file size must be under 15 MB');
  }

  // Sanitize filename
  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}_${cleanName}`;

  if (isSupabaseConfigured()) {
    try {
      // 1. Try uploading to Supabase Storage bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        // 2. Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            uploadedToStorage: true,
          };
        }
      }

      console.warn(`Supabase Storage upload warning (${error?.message}). Falling back to compressed Data URL.`);
    } catch (err) {
      console.warn('Storage upload error:', err);
    }
  }

  // Fallback: Compress and convert to base64 Data URL if bucket is unavailable
  const compressedDataUrl = await compressImage(file);
  return {
    url: compressedDataUrl,
    uploadedToStorage: false,
    warning: !isSupabaseConfigured()
      ? undefined
      : 'Saved as compressed image data. (To store as clean storage file, create a public bucket named "images" in Supabase Storage).',
  };
}

/**
 * Deletes an image file from Supabase Storage bucket ('images') if it's a Supabase storage URL.
 */
export async function deleteImageFromSupabase(
  imageUrl: string | undefined,
  bucketName = 'images'
): Promise<boolean> {
  if (!imageUrl || typeof imageUrl !== 'string' || !isSupabaseConfigured()) {
    return false;
  }

  try {
    // Check if the URL is from Supabase storage
    const marker = `/storage/v1/object/public/${bucketName}/`;
    if (!imageUrl.includes(marker)) {
      return false;
    }

    const filePath = imageUrl.split(marker)[1];
    if (!filePath) return false;

    const decodedPath = decodeURIComponent(filePath);
    const { error } = await supabase.storage.from(bucketName).remove([decodedPath]);

    if (error) {
      console.warn(`Failed to delete storage file (${decodedPath}):`, error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Error deleting file from Supabase storage:', err);
    return false;
  }
}
