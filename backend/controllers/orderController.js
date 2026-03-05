const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getOrders = async (req, res) => {
  try {
    const { status, search, limit, page, startDate, endDate } = req.query;

    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search by customer name, phone, or order number
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

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
    console.error('Error fetching orders:', error);
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
    const order = await Order.findById(req.params.id).populate('items.productId');

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
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    console.log('📦 Creating new order...');
    console.log('Request body:', req.body);

    const {
      customerName,
      phone,
      city,
      address,
      items,
      subtotal,
      deliveryFee,
      total,
      notes,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!customerName || !phone || !city || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required customer information'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate stock availability for each item
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.name} not found`
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          });
        }
      }
    }

    // Create order
    const order = await Order.create({
      customerName,
      phone,
      city,
      address,
      items,
      subtotal: subtotal || total - (deliveryFee || 7),
      deliveryFee: deliveryFee || 7,
      total,
      notes,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending',
      paymentStatus: 'Pending'
    });

    // Update product stock
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });

        // Update status to Out of Stock if stock reaches 0
        const updatedProduct = await Product.findById(item.productId);
        if (updatedProduct.stock === 0) {
          await Product.findByIdAndUpdate(item.productId, {
            status: 'Out of Stock'
          });
        }
      }
    }

    console.log('✅ Order created successfully:', order.orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
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

    const { status } = req.body;

    // Update status timestamps
    if (status && status !== order.status) {
      if (status === 'Shipped' && !order.shippedAt) {
        req.body.shippedAt = new Date();
      }
      if (status === 'Delivered' && !order.deliveredAt) {
        req.body.deliveredAt = new Date();
        req.body.paymentStatus = 'Paid'; // Assume paid on delivery
      }
      if (status === 'Cancelled' && !order.cancelledAt) {
        req.body.cancelledAt = new Date();
        
        // Restore product stock if order is cancelled
        for (const item of order.items) {
          if (item.productId) {
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stock: item.quantity }
            });
          }
        }
      }
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
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

    // Restore product stock if order was not delivered
    if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity }
          });
        }
      }
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
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
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Calculate total revenue (delivered orders only)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};