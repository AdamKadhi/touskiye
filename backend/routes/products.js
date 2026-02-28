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
router.use(protect); // All routes after this require authentication

router.route('/')
  .get(getProducts)
  .post(upload.single('image'), createProduct); // Add multer middleware for image upload

router.route('/:id')
  .put(upload.single('image'), updateProduct) // Add multer middleware for image upload
  .delete(deleteProduct);

module.exports = router;