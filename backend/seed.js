const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Sample Products
const products = [
  {
    name: 'Luxury Watch',
    category: 'Accessories',
    price: 299,
    originalPrice: 399,
    stock: 45,
    status: 'Shown',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    description: 'Elegant watch with modern design. Perfect for all occasions.',
    adLink: 'https://facebook.com/ads/watch-campaign'
  },
  {
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199,
    originalPrice: 299,
    stock: 28,
    status: 'Shown',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    description: 'Superior sound quality with active noise cancellation.',
    adLink: 'https://facebook.com/ads/headphones-campaign'
  },
  {
    name: 'Leather Bag',
    category: 'Bags',
    price: 249,
    originalPrice: 349,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
    description: 'Luxury leather bag made from finest natural leather.',
    adLink: 'https://facebook.com/ads/bag-campaign'
  },
  {
    name: 'Smart Watch Pro',
    category: 'Electronics',
    price: 349,
    originalPrice: 449,
    stock: 15,
    status: 'Shown',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
    description: 'Advanced smartwatch with fitness tracking and notifications.'
  },
  {
    name: 'Designer Sunglasses',
    category: 'Accessories',
    price: 179,
    originalPrice: 229,
    stock: 32,
    status: 'Shown',
    image: 'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=400&q=80',
    description: 'Stylish sunglasses with UV protection.',
    adLink: 'https://facebook.com/ads/sunglasses-campaign'
  }
];

// Sample Orders
const orders = [
  {
    customerName: 'Ahmed Mohamed',
    phone: '12345678',
    product: 'Luxury Watch',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
    quantity: 1,
    city: 'Tunis',
    address: '123 Habib Bourguiba Street',
    total: 299,
    status: 'Delivered'
  },
  {
    customerName: 'Fatima Zahra',
    phone: '23456789',
    product: 'Wireless Headphones',
    productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&q=80',
    quantity: 2,
    city: 'Sfax',
    address: '456 Avenue de la Liberté',
    total: 398,
    status: 'Shipping'
  },
  {
    customerName: 'Mohamed Ali',
    phone: '34567890',
    product: 'Leather Bag',
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80',
    quantity: 1,
    city: 'Sousse',
    address: '789 Rue de Paris',
    total: 249,
    status: 'Pending'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('🗑️  Data cleared');

    // Create admin user
    const admin = await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created');

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created`);

    // Create orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ ${createdOrders.length} orders created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('🗑️  Data deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}