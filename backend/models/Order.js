const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  product: {
    type: String,
    required: [true, 'Product is required']
  },
  productImage: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1,
    default: 1
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    enum: [
      'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
      'Bizerte', 'Beja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan',
      'Kasserine', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Gabes',
      'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili', 'Sidi Bouzid'
    ]
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery'
  },
  comment: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customerName: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;