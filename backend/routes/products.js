const express = require('express');
const router = express.Router();
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
  .post(createProduct);

router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;