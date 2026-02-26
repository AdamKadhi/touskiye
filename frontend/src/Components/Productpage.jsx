import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ConfirmModal from './ConfirmModal';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    status: 'Shown',
    image: null,
    description: '',
    adLink: ''
  });

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Other'];
  const statuses = ['Shown', 'Hidden', 'Out of Stock'];

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, [filterCategory, filterStatus, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchQuery || undefined
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage('Image size must be less than 5MB');
        setShowValidationModal(true);
        return;
      }
      
      setNewProduct({ ...newProduct, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage('Image size must be less than 5MB');
        setShowValidationModal(true);
        return;
      }
      
      setSelectedProduct({ ...selectedProduct, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.image) {
      setValidationMessage('Please fill in all required fields including image');
      setShowValidationModal(true);
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: newProduct.status,
        image: newProduct.image,
        description: newProduct.description || '',
        adLink: newProduct.adLink || ''
      };

      await productsAPI.create(productData);
      
      fetchProducts();
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        stock: '',
        status: 'Shown',
        image: null,
        description: '',
        adLink: ''
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating product:', error);
      setValidationMessage(error.response?.data?.message || 'Failed to create product. Please try again.');
      setShowValidationModal(true);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct.name || !selectedProduct.category || !selectedProduct.price || !selectedProduct.stock) {
      setValidationMessage('Please fill in all required fields');
      setShowValidationModal(true);
      return;
    }

    try {
      const productData = {
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: parseFloat(selectedProduct.price),
        originalPrice: selectedProduct.originalPrice ? parseFloat(selectedProduct.originalPrice) : parseFloat(selectedProduct.price),
        stock: parseInt(selectedProduct.stock),
        status: selectedProduct.status,
        description: selectedProduct.description || '',
        adLink: selectedProduct.adLink || ''
      };

      // Only add image if a new file was selected
      if (selectedProduct.image instanceof File) {
        productData.image = selectedProduct.image;
      }

      await productsAPI.update(selectedProduct._id, productData);
      
      fetchProducts();
      setShowEditModal(false);
      setSelectedProduct(null);
      setEditImagePreview(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setValidationMessage(error.response?.data?.message || 'Failed to update product. Please try again.');
      setShowValidationModal(true);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await productsAPI.delete(productToDelete);
      fetchProducts();
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setValidationMessage('Failed to delete product. Please try again.');
      setShowValidationModal(true);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct({ ...product });
    setEditImagePreview(null);
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .products-container { padding: 2rem; background: #1a1a1a; min-height: 100vh; }
        
        .products-header { margin-bottom: 2rem; }
        
        .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f4edd8; letter-spacing: 2px; margin-bottom: 0.5rem; }
        
        .page-subtitle { color: #999; font-size: 0.9rem; }
        
        .filters-section { background: #2a2a2a; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(244, 237, 216, 0.1); }
        
        .filters-row { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; align-items: center; }
        
        .search-box { position: relative; }
        
        .search-input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .search-input:focus { outline: none; border-color: #c4d600; }
        
        .search-input::placeholder { color: #666; }
        
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #999; font-size: 1.1rem; }
        
        .filter-select { padding: 0.8rem 1rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; cursor: pointer; transition: all 0.3s ease; }
        
        .filter-select:focus { outline: none; border-color: #c4d600; }
        
        .filter-select option { background: #2a2a2a; color: #f4edd8; }
        
        .add-product-btn { padding: 0.8rem 1.5rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        
        .add-product-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        
        .product-card { background: #2a2a2a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(244, 237, 216, 0.1); transition: all 0.3s ease; position: relative; }
        
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 30px rgba(196, 214, 0, 0.2); }
        
        .product-image-container { width: 100%; height: 200px; overflow: hidden; background: #1a1a1a; position: relative; }
        
        .product-image { width: 100%; height: 100%; object-fit: cover; }
        
        .product-status-badge { position: absolute; top: 0.8rem; right: 0.8rem; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        
        .product-status-badge.shown { background: rgba(196, 214, 0, 0.9); color: #2a2a2a; }
        
        .product-status-badge.hidden { background: rgba(153, 153, 153, 0.9); color: white; }
        
        .product-status-badge.out-of-stock { background: rgba(255, 107, 53, 0.9); color: white; }
        
        .product-discount-badge { position: absolute; top: 0.8rem; left: 0.8rem; padding: 0.4rem 0.8rem; border-radius: 20px; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; font-size: 0.75rem; font-weight: 700; }
        
        .product-info { padding: 1.2rem; }
        
        .product-name { font-weight: 700; font-size: 1.1rem; color: #f4edd8; margin-bottom: 0.5rem; }
        
        .product-category { color: #999; font-size: 0.85rem; margin-bottom: 0.8rem; }
        
        .product-price-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem; }
        
        .product-price { font-weight: 700; font-size: 1.3rem; color: #ff6b35; }
        
        .product-original-price { font-size: 0.9rem; color: #999; text-decoration: line-through; }
        
        .product-stock { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.8rem; background: rgba(196, 214, 0, 0.1); border-radius: 8px; margin-bottom: 1rem; }
        
        .product-stock-label { font-size: 0.85rem; color: #999; }
        
        .product-stock-value { font-weight: 700; color: #c4d600; }
        
        .product-actions { display: flex; gap: 0.5rem; }
        
        .action-btn { flex: 1; padding: 0.7rem; border: none; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .action-btn.view { background: rgba(100, 150, 255, 0.1); color: #6496ff; }
        
        .action-btn.view:hover { background: #6496ff; color: white; }
        
        .action-btn.edit { background: rgba(196, 214, 0, 0.1); color: #c4d600; }
        
        .action-btn.edit:hover { background: #c4d600; color: #2a2a2a; }
        
        .action-btn.delete { background: rgba(255, 107, 53, 0.1); color: #ff6b35; }
        
        .action-btn.delete:hover { background: #ff6b35; color: white; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-content { background: #2a2a2a; border-radius: 20px; padding: 2rem; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; border: 1px solid rgba(244, 237, 216, 0.1); animation: slideUp 0.3s ease; }
        
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: #f4edd8; letter-spacing: 2px; }
        
        .modal-close { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: rgba(255, 107, 53, 0.1); color: #ff6b35; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
        
        .modal-close:hover { background: #ff6b35; color: white; transform: rotate(90deg); }
        
        .form-group { margin-bottom: 1.2rem; }
        
        .form-label { display: block; color: #999; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        
        .form-input { width: 100%; padding: 0.8rem 1rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .form-input:focus { outline: none; border-color: #c4d600; }
        
        .form-textarea { resize: vertical; min-height: 80px; }
        
        .image-upload-area { border: 2px dashed rgba(196, 214, 0, 0.3); border-radius: 10px; padding: 2rem; text-align: center; background: #1a1a1a; cursor: pointer; transition: all 0.3s ease; }
        
        .image-upload-area:hover { border-color: #c4d600; background: rgba(196, 214, 0, 0.05); }
        
        .image-upload-area input { display: none; }
        
        .upload-icon { font-size: 3rem; margin-bottom: 0.5rem; color: #999; }
        
        .upload-text { color: #999; font-size: 0.9rem; }
        
        .image-preview { width: 100%; height: 200px; border-radius: 10px; object-fit: cover; margin-top: 1rem; }
        
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        
        .modal-btn { flex: 1; padding: 0.9rem; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .modal-btn.primary { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; }
        
        .modal-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .modal-btn.secondary { background: rgba(196, 214, 0, 0.1); color: #c4d600; border: 2px solid #c4d600; }
        
        .modal-btn.secondary:hover { background: #c4d600; color: #2a2a2a; }
        
        .empty-state { text-align: center; padding: 3rem; color: #999; }
        
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        
        .loading-state { text-align: center; padding: 3rem; color: #999; }
        
        .loading-spinner { font-size: 2rem; margin-bottom: 1rem; animation: spin 1s linear infinite; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .products-container { padding: 1rem; }
          .filters-row { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
        }
      `}</style>

      <div className="products-container">
        <div className="products-header">
          <div className="page-title">Products Management</div>
          <div className="page-subtitle">Manage your product inventory</div>
        </div>

        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select 
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
              <span>+</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <div>Loading products...</div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
                  />
                  <span className={`product-status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                    {product.status}
                  </span>
                  {product.discount > 0 && (
                    <span className="product-discount-badge">-{product.discount}%</span>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-category">{product.category}</div>
                  <div className="product-price-row">
                    <span className="product-price">{product.price} DT</span>
                    {product.originalPrice > product.price && (
                      <span className="product-original-price">{product.originalPrice} DT</span>
                    )}
                  </div>
                  <div className="product-stock">
                    <span className="product-stock-label">Stock:</span>
                    <span className="product-stock-value">{product.stock} units</span>
                  </div>
                  <div className="product-actions">
                    <button className="action-btn view" onClick={() => handleViewProduct(product)}>
                      👁️ View
                    </button>
                    <button className="action-btn edit" onClick={() => handleEditClick(product)}>
                      ✏️ Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteProduct(product._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div>No products found</div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Product</div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Product Image *</label>
              <label className="image-upload-area" htmlFor="product-image">
                <input 
                  id="product-image"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <>
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">Click to upload image (max 5MB)</div>
                  </>
                )}
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-input"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (DT) *</label>
              <input
                type="number"
                className="form-input"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Price (DT)</label>
              <input
                type="number"
                className="form-input"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                placeholder="Leave empty if no discount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input
                type="number"
                className="form-input"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-input"
                value={newProduct.status}
                onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ad Link (Optional)</label>
              <input
                type="url"
                className="form-input"
                value={newProduct.adLink}
                onChange={(e) => setNewProduct({...newProduct, adLink: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Product</div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Product Image</label>
              <label className="image-upload-area" htmlFor="edit-product-image">
                <input 
                  id="edit-product-image"
                  type="file" 
                  accept="image/*"
                  onChange={handleEditImageChange}
                />
                {editImagePreview ? (
                  <img src={editImagePreview} alt="Preview" className="image-preview" />
                ) : selectedProduct.image ? (
                  <img src={getImageUrl(selectedProduct.image)} alt="Current" className="image-preview" />
                ) : (
                  <>
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">Click to change image</div>
                  </>
                )}
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-input"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={selectedProduct.category}
                onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (DT) *</label>
              <input
                type="number"
                className="form-input"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Price (DT)</label>
              <input
                type="number"
                className="form-input"
                value={selectedProduct.originalPrice}
                onChange={(e) => setSelectedProduct({...selectedProduct, originalPrice: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input
                type="number"
                className="form-input"
                value={selectedProduct.stock}
                onChange={(e) => setSelectedProduct({...selectedProduct, stock: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-input"
                value={selectedProduct.status}
                onChange={(e) => setSelectedProduct({...selectedProduct, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={selectedProduct.description || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ad Link</label>
              <input
                type="url"
                className="form-input"
                value={selectedProduct.adLink || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, adLink: e.target.value})}
              />
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleEditProduct}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Product Details</div>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <img 
              src={getImageUrl(selectedProduct.image)} 
              alt={selectedProduct.name}
              className="image-preview"
              onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
            />

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Product Name</div>
                <div style={{ color: '#f4edd8', fontSize: '1.1rem', fontWeight: '700' }}>{selectedProduct.name}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Category</div>
                <div style={{ color: '#f4edd8' }}>{selectedProduct.category}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Price</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ color: '#ff6b35', fontSize: '1.5rem', fontWeight: '700' }}>{selectedProduct.price} DT</span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span style={{ color: '#999', textDecoration: 'line-through' }}>{selectedProduct.originalPrice} DT</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Stock</div>
                <div style={{ color: '#c4d600', fontWeight: '700' }}>{selectedProduct.stock} units</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Status</div>
                <span className={`product-status-badge ${selectedProduct.status.toLowerCase().replace(' ', '-')}`}>
                  {selectedProduct.status}
                </span>
              </div>

              {selectedProduct.description && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Description</div>
                  <div style={{ color: '#f4edd8', lineHeight: '1.6' }}>{selectedProduct.description}</div>
                </div>
              )}

              {selectedProduct.discount > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Discount</div>
                  <div style={{ color: '#ff6b35', fontWeight: '700' }}>{selectedProduct.discount}%</div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmModal
        show={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        onConfirm={() => setShowValidationModal(false)}
        title="Validation Error"
        message={validationMessage}
        confirmText="OK"
        cancelText=""
        type="warning"
      />
    </div>
  );
}