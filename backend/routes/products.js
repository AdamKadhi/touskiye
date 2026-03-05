const express = require('express');
const router = express.Router();
const { uploadCombined } = require('../config/upload');
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
  // ✅ Accept up to 5 images + 1 video
  .post(uploadCombined.array('files', 6), createProduct);

router.route('/:id')
  // ✅ Accept up to 5 images + 1 video
  .put(uploadCombined.array('files', 6), updateProduct)
  .delete(deleteProduct);

module.exports = router;