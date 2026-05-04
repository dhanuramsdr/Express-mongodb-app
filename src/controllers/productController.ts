import { NextFunction, Request, Response } from 'express';
import { productModels } from '../models/productModels';
import { HandleError } from '../utilits/errorHandler';
import {
  uploadMultipleImages,
  uploadSingleImage,
  getImageUrl,
  deleteImage,
} from '../utilits/imageUploadHelper';

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);
    console.log('Uploaded file:', req.file);

    const { name, quantity, categorey, sellerid } = req.body;

    // Validate required fields
    if (!name || !quantity || !categorey || !sellerid) {
      res.status(400).json({
        success: false,
        message: 'All required fields must be provided: name, quantity, category, sellerid',
      });
      return;
    }

    // Prepare product data
    const productData: any = {
      Productname: name,
      Productquantity: Number(quantity),
      categorey: categorey,
      seller: sellerid,
      images: [], // Will store all image public_ids
    };

    // ✅ Handle images - works for both single and multiple
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Multiple files uploaded
      const uploadResults = await uploadMultipleImages(
        req.files.map((file: Express.Multer.File) => file.buffer),
        'products'
      );
      productData.images = uploadResults.successful.map((result) => result.publicId);
      console.log(`Uploaded ${productData.images.length} images`);
    } else if (req.file) {
      // Single file uploaded
      const uploadResult = await uploadSingleImage(req.file.buffer, 'products');
      productData.images = [uploadResult.publicId];
      console.log(`Uploaded 1 image`);
    }

    // Create product
    const result = await productModels.create(productData);

    if (!result) {
      return next(new HandleError('Unable to create product', 404));
    }

    // Generate URLs for response
    const imageUrls = result.images.map((publicId: string, index: number) => ({
      publicId: publicId,
      url: getImageUrl(publicId, { width: 500, height: 500 }),
      thumbnail: getImageUrl(publicId, { width: 150, height: 150 }),
      isPrimary: index === 0, // First image is primary
    }));

    res.status(200).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: result._id,
        name: result.Productname,
        quantity: result.Productquantity,
        category: result.categorey,
        seller: result.seller,
        images: imageUrls, // Array of images (can be 0, 1, or many)
        primaryImage: imageUrls[0] || null,
        totalImages: result.images.length,
        createdAt: result.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Unhandled network error',
      error: error.message,
    });
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const product = await productModels.findById(productId).populate('seller', 'Name');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // ✅ Generate actual image URLs from public_ids
    const imageUrls = (product.images || []).map((publicId: string, index: number) => ({
      publicId: publicId,
      url: getImageUrl(publicId, { width: 800, height: 800 }),
      thumbnail: getImageUrl(publicId, { width: 150, height: 150 }),
      isPrimary: index === 0,
    }));

    // Transform the response to include image URLs
    const productResponse = {
      id: product._id,
      name: product.Productname,
      quantity: product.Productquantity,
      category: product.categorey,
      seller: product.seller,
      images: imageUrls, // ✅ Returns actual URLs
      primaryImage: imageUrls[0] || null,
      totalImages: product.images?.length || 0,
    };

    res.status(200).json({
      success: true,
      product: productResponse,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch all products with seller details populated
    const products = await productModels.find().populate('seller', 'Name ').sort({ createdAt: -1 }); // Optional: newest first

    if (!products || products.length === 0) {
      res.status(200).json({
        success: true,
        products: [],
        message: 'No products found',
        totalProducts: 0,
      });
      return;
    }

    // Transform each product to include image URLs
    const transformedProducts = products.map((product) => {
      // ✅ Extract image URL as string (not object)
      const imageUrl =
        product.images && product.images.length > 0
          ? getImageUrl(product.images[0], { width: 800, height: 800 })
          : null;

      return {
        id: product._id,
        name: product.Productname,
        quantity: product.Productquantity,
        category: product.categorey,
        seller: (product.seller as any).Name, // ✅ Use current product's seller
        // image: imageUrl, // ✅ Direct URL string
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      products: transformedProducts,
      totalProducts: transformedProducts.length,
    });
  } catch (error: any) {
    console.error('Error fetching all products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

export const getAllProductsName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch all products with seller details populated
    const products = await productModels.find();
    if (!products || products.length === 0) {
      res.status(200).json({
        success: true,
        products: [],
        message: 'No products found',
        totalProducts: 0,
      });
      return;
    }

    // Transform each product to include image URLs
    const transformedProducts = products.map((product) => {
      return {
        name: product.Productname,
      };
    });

    res.status(200).json({
      success: true,
      products: transformedProducts,
    });
  } catch (error: any) {
    console.error('Error fetching all products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};
