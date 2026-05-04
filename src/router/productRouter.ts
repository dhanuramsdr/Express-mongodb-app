import Router from 'express';
import {
  addProduct,
  getAllProducts,
  getAllProductsName,
  getProduct,
} from '../controllers/productController';
import { uploadMultiple } from '../utilits/uploadMiddleware';

export const productRouter = Router();

productRouter.route('/product').post(uploadMultiple('image', 10), addProduct);
productRouter.route('/product/:productId').get(getProduct);
productRouter.route('/allproduct').get(getAllProducts);
productRouter.route('/allproductname').get(getAllProductsName);
