const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const {
  getAllProducts,
  getPublicProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/public', getPublicProducts);
router.get('/:id', getProduct);

// Admin routes (protected)
router.get('/', protect, adminOnly, getAllProducts);
router.post('/', protect, adminOnly, upload.single('image'), createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;