import cloudinary from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Interface for upload result
export interface IUploadResult {
  publicId: string; // The Cloudinary public_id (path) - this is what we store in DB
  secureUrl: string; // Full URL (for temporary use, not stored)
}

// Interface for multiple upload result
export interface IMultipleUploadResult {
  successful: IUploadResult[];
  failed: { error: string; originalname: string }[];
}

/**
 * Common function to upload single image to Cloudinary
 * @param fileBuffer - The image buffer from multer
 * @param folderName - Folder name in Cloudinary (e.g., 'products', 'users')
 * @returns Promise with publicId and secureUrl
 *
 * EXPLANATION:
 * - We only store the public_id in MongoDB (not the full URL)
 * - public_id is the unique identifier Cloudinary gives to each image
 * - We can reconstruct the URL later using the public_id
 * - This saves database space and is more flexible
 */
export const uploadSingleImage = async (
  fileBuffer: Buffer,
  folderName: string
): Promise<IUploadResult> => {
  try {
    // Upload to Cloudinary using buffer
    // We let Cloudinary generate the public_id automatically
    // This is better than creating our own because Cloudinary handles uniqueness
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName, // Organize images in folders
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'], // Modern formats
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
            { quality: 'auto' }, // Automatic quality optimization
          ],
          use_filename: true, // Use original filename as base
          unique_filename: true, // Add random suffix to avoid conflicts
          overwrite: false, // Don't overwrite existing images
        },
        (
          error: UploadApiErrorResponse | undefined,
          uploadResult: UploadApiResponse | undefined
        ) => {
          if (error) reject(error);
          else resolve(uploadResult!);
        }
      );
      uploadStream.end(fileBuffer);
    });

    // We only return the public_id to store in database
    // The secure_url is only returned temporarily for response
    return {
      publicId: result.public_id, // This is what we store in MongoDB
      secureUrl: result.secure_url, // This is used for immediate response
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error}`);
  }
};

/**
 * Common function to upload multiple images to Cloudinary
 * @param files - Array of file buffers from multer
 * @param folderName - Folder name in Cloudinary
 * @returns Promise with arrays of successful and failed uploads
 */
export const uploadMultipleImages = async (
  files: Buffer[],
  folderName: string
): Promise<IMultipleUploadResult> => {
  const results: IMultipleUploadResult = {
    successful: [],
    failed: [],
  };

  // Upload each file concurrently for better performance
  const uploadPromises = files.map(async (fileBuffer, index) => {
    try {
      const result = await uploadSingleImage(fileBuffer, folderName);
      results.successful.push(result);
    } catch (error) {
      results.failed.push({
        error: error instanceof Error ? error.message : String(error),
        originalname: `file_${index}`,
      });
    }
  });

  await Promise.all(uploadPromises);
  return results;
};

/**
 * Helper function to delete an image from Cloudinary
 * @param publicId - The public_id of the image to delete
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * Helper function to get the full URL from a public_id
 * @param publicId - The Cloudinary public_id stored in database
 * @param transformations - Optional transformations (e.g., { width: 500, height: 500 })
 * @returns Full Cloudinary URL
 *
 * EXPLANATION:
 * - We use this when we need to send image URLs to the client
 * - We only store public_id in DB, then generate URL dynamically
 * - This allows us to apply different transformations on the fly
 */
export const getImageUrl = (
  publicId: string,
  transformations?: { width?: number; height?: number; crop?: string }
): string => {
  if (!publicId) return '';

  let url = cloudinary.url(publicId);

  // Apply transformations if provided
  if (transformations) {
    url = cloudinary.url(publicId, {
      width: transformations.width,
      height: transformations.height,
      crop: transformations.crop || 'limit',
      quality: 'auto',
    });
  }

  return url;
};
