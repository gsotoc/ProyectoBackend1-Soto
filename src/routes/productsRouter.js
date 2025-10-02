import express from 'express';
import * as controller from '../controllers/productController.js';

const router = express.Router();

router.get('/', controller.get);
router.get('/realtimeproducts', controller.getAll); //ruta pa websockets, tiene que estar antes de la de :pid sino la toma como id
router.get('/:pid', controller.getById);
router.post('/', controller.create);
router.put('/:pid', controller.update);
router.delete('/:pid', controller.deleteProduct); 



export default router;