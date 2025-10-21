/**
 * Image utility functions for avatar upload
 * - Resize images to 512x512
 * - Convert to WebP for smaller file sizes
 * - Client-side processing
 */

export interface ImageProcessingResult {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Resize and convert image to WebP
 * @param file - Original image file
 * @param maxSize - Maximum width/height (default 512)
 * @param quality - WebP quality 0-1 (default 0.9)
 * @returns Processed image file and preview URL
 */
export async function processImage(
  file: File,
  maxSize: number = 512,
  quality: number = 0.9
): Promise<ImageProcessingResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate dimensions maintaining aspect ratio
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create image blob'));
                return;
              }

              // Create File from Blob
              const processedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '.webp'),
                { type: 'image/webp' }
              );

              // Get data URL for preview
              const dataUrl = canvas.toDataURL('image/webp', quality);

              resolve({
                file: processedFile,
                dataUrl,
                width,
                height,
              });
            },
            'image/webp',
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default 2)
 * @returns Error message or null if valid
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 2
): string | null {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Моля, качете JPG, PNG или WebP файл';
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Файлът е твърде голям. Максимален размер: ${maxSizeMB}MB`;
  }

  return null;
}

/**
 * Generate unique filename for avatar
 * @param userId - User ID
 * @param extension - File extension (default 'webp')
 * @returns Unique filename
 */
export function generateAvatarFilename(
  userId: string,
  extension: string = 'webp'
): string {
  const timestamp = Date.now();
  return `${userId}/${timestamp}.${extension}`;
}
