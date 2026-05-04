import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    Productname: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    Productquantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    // ✅ Remove ProductUrl - keep only ONE image field
    images: {
      type: [String], // Array of Cloudinary public_ids
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 10; // Max 10 images per product
        },
        message: 'Product cannot have more than 10 images',
      },
    },
    categorey: {
      type: String,
      required: [true, 'Product category is required'], // Fix: 'required' not 'require'
      enum: {
        values: ['Electronics', 'Mobile', 'Toys'], // Fix: 'Toyes' -> 'Toys'
        message: '{VALUE} is not a valid category',
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Seller ID is required'],
    },
  },
  { timestamps: true }
);

// Helper method to get primary image (first image)
productSchema.methods.getPrimaryImage = function (): string | null {
  return this.images.length > 0 ? this.images[0] : null;
};

// Helper method to get all image public_ids
productSchema.methods.getAllImages = function (): string[] {
  return this.images;
};

// Helper method to check if product has images
productSchema.methods.hasImages = function (): boolean {
  return this.images.length > 0;
};

// Helper method to get image count
productSchema.methods.getImageCount = function (): number {
  return this.images.length;
};

export const productModels = mongoose.model('product', productSchema);
