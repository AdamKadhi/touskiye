const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPublicProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/public', getPublicProducts);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.use(protect);

router.route('/')
  .get(getProducts)
  .post(upload.array('images', 5), createProduct); // ✅ CHANGED: array instead of single

router.route('/:id')
  .put(upload.array('images', 5), updateProduct)   // ✅ CHANGED: array instead of single
  .delete(deleteProduct);

module.exports = router;