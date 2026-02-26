const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Accessories', 'Electronics', 'Bags', 'Fashion', 'Sports']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  status: {
    type: String,
    enum: ['Shown', 'Hidden', 'Out of Stock'],
    default: 'Shown'
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  adLink: {
    type: String,
    trim: true
  }
}, {
  timestamps: true  // Auto handles createdAt and updatedAt
});

// Calculate discount before saving
productSchema.pre('save', function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.discount = 0;
  }
  
  // Auto-set Out of Stock status
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  }
});

module.exports = mongoose.model('Product', productSchema);