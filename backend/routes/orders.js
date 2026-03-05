const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', createOrder);

// Protected routes (Admin only)
router.get('/stats/overview', protect, getOrderStats);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;