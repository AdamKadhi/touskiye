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

// Public routes (for customer orders)
router.post('/', createOrder);

// Protected routes (Admin only)
router.use(protect);

router.get('/', getOrders);
router.get('/stats/overview', getOrderStats);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;