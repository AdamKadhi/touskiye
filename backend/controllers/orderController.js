const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getOrders = async (req, res) => {
  try {
    const { product, city, status, search, limit, page } = req.query;

    // Build query
    let query = {};

    if (product) query.product = product;
    if (city) query.city = city;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Admin only)
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Public (Customer) / Private (Admin)
exports.createOrder = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    // Find the product by name to check and update stock
    const productDoc = await Product.findOne({ name: product });

    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if enough stock is available
    if (productDoc.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${productDoc.stock} items available.`
      });
    }

    // Create the order
    const order = await Order.create(req.body);

    // Reduce stock
    productDoc.stock -= quantity;

    // Update product status if stock reaches 0
    if (productDoc.stock === 0) {
      productDoc.status = 'Out of Stock';
    }

    await productDoc.save();

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin only)
exports.updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If quantity is being changed, update stock accordingly
    if (req.body.quantity && req.body.quantity !== order.quantity) {
      const productDoc = await Product.findOne({ name: order.product });

      if (productDoc) {
        const quantityDifference = req.body.quantity - order.quantity;

        // Check if we have enough stock for the increase
        if (quantityDifference > 0 && productDoc.stock < quantityDifference) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock. Only ${productDoc.stock} more items available.`
          });
        }

        // Update stock (if increasing order, reduce stock; if decreasing order, increase stock)
        productDoc.stock -= quantityDifference;

        // Update status based on stock
        if (productDoc.stock === 0) {
          productDoc.status = 'Out of Stock';
        } else if (productDoc.stock > 0 && productDoc.status === 'Out of Stock') {
          productDoc.status = 'Shown';
        }

        await productDoc.save();
      }
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore stock when deleting an order
    const productDoc = await Product.findOne({ name: order.product });

    if (productDoc) {
      productDoc.stock += order.quantity;

      // Update status if stock is restored
      if (productDoc.stock > 0 && productDoc.status === 'Out of Stock') {
        productDoc.status = 'Shown';
      }

      await productDoc.save();
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted and stock restored'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/overview
// @access  Private (Admin only)
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const shippingOrders = await Order.countDocuments({ status: 'Shipping' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        shippingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};