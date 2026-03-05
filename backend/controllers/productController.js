const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Helper function to separate images and videos from uploaded files
const separateFiles = (files) => {
  const images = [];
  const videos = [];
  
  if (files) {
    files.forEach(file => {
      if (file.mimetype.startsWith('image/')) {
        images.push(file);
      } else if (file.mimetype.startsWith('video/')) {
        videos.push(file);
      }
    });
  }
  
  return { images, videos };
};

// Helper function to delete file
const deleteFile = (filePath) => {
  if (filePath && (filePath.startsWith('/uploads/') || filePath.startsWith('\\uploads\\'))) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public (customer) / Private (admin)
exports.getProducts = async (req, res) => {
  try {
    const { category, status, search, limit, page } = req.query;

    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
  try {
    console.log('🔍 CREATE PRODUCT CALLED');
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);

    const { name, category, price, originalPrice, stock, status, description, adLink, videoUrl, rating, numReviews } = req.body;

    // Separate images and videos from uploaded files
    const { images, videos } = separateFiles(req.files);

    console.log('Images found:', images.length);
    console.log('Videos found:', videos.length);

    // Validate: At least one image required
    if (images.length === 0) {
      // Delete any uploaded files
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../uploads', file.fieldname === 'video' ? 'videos' : 'images', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    // Create image URLs
    const imageUrls = images.map(file => `/uploads/images/${file.filename}`);
    const mainImage = imageUrls[0];

    // Create video file path if video uploaded
    let videoFilePath = null;
    if (videos.length > 0) {
      videoFilePath = `/uploads/videos/${videos[0].filename}`;
    }

    // Create product
    const product = await Product.create({
      name,
      category,
      price,
      originalPrice: originalPrice || price,
      stock,
      status,
      image: mainImage,
      images: imageUrls,
      videoFile: videoFilePath, // ✅ NEW: Uploaded video file
      videoUrl: videoUrl || '', // ✅ KEEP: External video URL
      description,
      adLink,
      rating: rating || 0,
      numReviews: numReviews || 0
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Delete uploaded files if product creation fails
    if (req.files) {
      req.files.forEach(file => {
        const folder = file.mimetype.startsWith('image/') ? 'images' : 'videos';
        const filePath = path.join(__dirname, `../uploads/${folder}`, file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = { ...req.body };

    // If new files uploaded
    if (req.files && req.files.length > 0) {
      const { images, videos } = separateFiles(req.files);

      // Handle new images
      if (images.length > 0) {
        // Delete old images
        if (product.images && product.images.length > 0) {
          product.images.forEach(imagePath => {
            deleteFile(imagePath);
          });
        }

        // Set new images
        const imageUrls = images.map(file => `/uploads/images/${file.filename}`);
        updateData.image = imageUrls[0];
        updateData.images = imageUrls;
      }

      // Handle new video
      if (videos.length > 0) {
        // Delete old video file
        if (product.videoFile) {
          deleteFile(product.videoFile);
        }

        // Set new video
        updateData.videoFile = `/uploads/videos/${videos[0].filename}`;
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Delete uploaded files if update fails
    if (req.files) {
      req.files.forEach(file => {
        const folder = file.mimetype.startsWith('image/') ? 'images' : 'videos';
        const filePath = path.join(__dirname, `../uploads/${folder}`, file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete all product images
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        deleteFile(imagePath);
      });
    }

    // ✅ NEW: Delete video file if exists
    if (product.videoFile) {
      deleteFile(product.videoFile);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get public products (shown and out of stock)
// @route   GET /api/products/public
// @access  Public
exports.getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      status: { $in: ['Shown', 'Out of Stock'] }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};