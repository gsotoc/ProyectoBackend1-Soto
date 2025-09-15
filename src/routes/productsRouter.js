const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/', controller.getAll);
router.get('/:pid', controller.getById);
router.post('/', controller.create);
router.put('/:pid', controller.update);
router.delete('/:pid', controller.delete);

module.exports = router;

