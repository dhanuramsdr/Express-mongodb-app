import Router from 'express';
import { addProduct } from '../controllers/productController';

export const productRouter = Router();

productRouter.route('/creatproduct').post(addProduct);
