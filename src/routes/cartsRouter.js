// routes/cartRouter.js
import express from 'express';
import * as controller from '../controllers/cartController.js';

const router = express.Router();


router.post('/', controller.createCart);
router.get('/:cid', controller.cartById);
router.post('/:cid/products/:pid', controller.update);
router.put('/:cid', controller.updateCart);
router.put('/:cid/products/:pid', controller.updateProductQuantity);
router.delete('/:cid/products/:pid', controller.removeProduct);
router.delete('/:cid', controller.clearCart);

export default router;