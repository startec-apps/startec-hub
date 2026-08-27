/**
 * Client-Side Lightweight Image Compression Utility
 * Resizes and optimizes images to prevent slow page loads, reduce storage footprint,
 * and conserve API quota while maintaining crisp inspection quality.
 */

export const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<{ dataUrl: string; sizeKb: number }> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within max dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
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
          const rawResult = e.target?.result as string;
          const approxKb = Math.round((rawResult.length * 3) / 4 / 1024);
          resolve({ dataUrl: rawResult, sizeKb: approxKb });
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG format
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({ dataUrl, sizeKb });
      };

      img.onerror = () => reject(new Error('Unable to process the selected image.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read the image file.'));
    reader.readAsDataURL(file);
  });
};
