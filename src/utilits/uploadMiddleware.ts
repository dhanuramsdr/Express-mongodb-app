import multer from 'multer';
import { Request } from 'express';

// Use memory storage instead of disk storage
// This keeps files in memory as buffers, which is better for Cloudinary
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are allowed.'));
  }
};

// Common multer configuration
const multerConfig = {
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
};

// For single image uploads (profile picture, single product image)
export const uploadSingle = (fieldName: string) => {
  return multer(multerConfig).single(fieldName);
};

// For multiple image uploads (multiple product images)
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => {
  return multer(multerConfig).array(fieldName, maxCount);
};

// For different fields (e.g., product image and user avatar in same request)
export const uploadFields = (fields: { name: string; maxCount: number }[]) => {
  return multer(multerConfig).fields(fields);
};
