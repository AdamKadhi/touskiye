const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders (with filters)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { product, city, status, search } = req.query;
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

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Admin)
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
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, product, productImage, quantity, city, address, total, status, paymentMethod, comment } = req.body;

    // Find the product by name to check stock
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
    const order = await Order.create({
      customerName,
      phone,
      product,
      productImage,
      quantity,
      city,
      address,
      total,
      status: status || 'Pending',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      comment: comment || ''
    });

    // Reduce stock
    productDoc.stock -= quantity;
    
    // Update product status if stock is 0
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
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin)
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
        
        // Update stock
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

    order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
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

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Order deleted and stock restored'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private (Admin)
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order stats',
      error: error.message
    });
  }
};