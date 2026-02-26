const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/', createOrder);

// Admin routes (protected)
router.get('/', protect, adminOnly, getAllOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/:id', protect, adminOnly, getOrder);
router.put('/:id', protect, adminOnly, updateOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;