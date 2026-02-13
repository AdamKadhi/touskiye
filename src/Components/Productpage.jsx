import React, { useState } from 'react';
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
  const [products, setProducts] = useState([
    {
      id: 'PRD-001',
      name: 'Luxury Watch',
      category: 'Accessories',
      price: 299,
      originalPrice: 399,
      discount: 25,
      stock: 45,
      status: 'Shown',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      description: 'Elegant watch with modern design. Perfect for all occasions, combining elegance and advanced engineering.',
      adLink: 'https://facebook.com/ads/watch-campaign',
      createdDate: '2026-01-15'
    },
    {
      id: 'PRD-002',
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 199,
      originalPrice: 299,
      discount: 33,
      stock: 28,
      status: 'Shown',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
      description: 'Superior sound quality with active noise cancellation. Designed for comfort and exceptional audio experience.',
      adLink: 'https://facebook.com/ads/headphones-campaign',
      createdDate: '2026-01-20'
    },
    {
      id: 'PRD-003',
      name: 'Leather Bag',
      category: 'Bags',
      price: 249,
      originalPrice: 349,
      discount: 29,
      stock: 0,
      status: 'Out of Stock',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
      description: 'Luxury leather bag made from the finest natural leather. Elegant and practical design for your daily essentials.',
      adLink: 'https://facebook.com/ads/bag-campaign',
      createdDate: '2026-02-01'
    },
    {
      id: 'PRD-004',
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 349,
      originalPrice: 449,
      discount: 22,
      stock: 15,
      status: 'Hidden',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
      description: 'Advanced smartwatch with fitness tracking, notifications, and long battery life.',
      adLink: '',
      createdDate: '2026-02-05'
    },
    {
      id: 'PRD-005',
      name: 'Designer Sunglasses',
      category: 'Accessories',
      price: 179,
      originalPrice: 229,
      discount: 22,
      stock: 32,
      status: 'Shown',
      image: 'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=400&q=80',
      description: 'Stylish sunglasses with UV protection. Perfect blend of fashion and functionality.',
      adLink: 'https://facebook.com/ads/sunglasses-campaign',
      createdDate: '2026-02-08'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    status: 'Shown',
    image: '',
    description: '',
    adLink: ''
  });

  const categories = ['Accessories', 'Electronics', 'Bags', 'Fashion', 'Sports'];
  const statuses = ['Shown', 'Hidden', 'Out of Stock'];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.image) {
      setValidationMessage('Please fill in all required fields');
      setShowValidationModal(true);
      return;
    }

    const discount = newProduct.originalPrice && newProduct.price 
      ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
      : 0;

    const product = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : parseFloat(newProduct.price),
      discount: discount,
      stock: parseInt(newProduct.stock),
      status: newProduct.status,
      image: newProduct.image,
      description: newProduct.description || '',
      adLink: newProduct.adLink || '',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      status: 'Shown',
      image: '',
      description: '',
      adLink: ''
    });
  };

  const handleEditProduct = () => {
    const discount = selectedProduct.originalPrice && selectedProduct.price 
      ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
      : 0;

    setProducts(products.map(product => 
      product.id === selectedProduct.id ? {
        ...selectedProduct,
        discount: discount
      } : product
    ));
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = () => {
    setProducts(products.filter(product => product.id !== productToDelete));
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct({ ...product });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Shown': return 'shown';
      case 'Hidden': return 'hidden';
      case 'Out of Stock': return 'outofstock';
      default: return 'shown';
    }
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
        
        /* Filters Section */
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
        
        /* Products Table */
        .products-table-container { background: #2a2a2a; border-radius: 16px; padding: 1.5rem; border: 1px solid rgba(244, 237, 216, 0.1); overflow-x: auto; }
        
        .products-table { width: 100%; border-collapse: collapse; }
        
        .products-table th { text-align: left; padding: 1rem; color: #999; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid rgba(244, 237, 216, 0.1); white-space: nowrap; }
        
        .products-table td { text-align: left; padding: 1rem; color: #ccc; font-size: 0.9rem; border-bottom: 1px solid rgba(244, 237, 216, 0.05); vertical-align: middle; }
        
        .products-table tr:hover td { background: rgba(196, 214, 0, 0.05); }
        
        .product-id { color: #c4d600; font-weight: 700; font-family: monospace; }
        
        .product-image-cell { width: 80px; }
        
        .product-table-image { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        
        .product-name-cell { font-weight: 600; color: #f4edd8; }
        
        .product-category { font-size: 0.75rem; color: #999; margin-top: 0.2rem; }
        
        .price-cell { font-weight: 700; color: #f4edd8; }
        
        .original-price { font-size: 0.75rem; color: #999; text-decoration: line-through; margin-right: 0.3rem; }
        
        .discount-label { font-size: 0.7rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 2px 6px; border-radius: 8px; margin-left: 0.3rem; }
        
        .stock-cell { font-weight: 600; }
        
        .stock-low { color: #ff6b35; }
        
        .stock-ok { color: #c4d600; }
        
        .stock-out { color: #999; }
        
        .status-badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
        
        .status-badge.shown { background: rgba(196, 214, 0, 0.2); color: #c4d600; }
        
        .status-badge.hidden { background: rgba(153, 153, 153, 0.2); color: #999; }
        
        .status-badge.outofstock { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
        
        .fb-link { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1877f2, #0d65d9); color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; font-size: 1rem; }
        
        .fb-link:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4); }
        
        .fb-link.disabled { background: rgba(153, 153, 153, 0.2); color: #666; cursor: not-allowed; pointer-events: none; }
        
        .actions-cell { display: flex; gap: 0.5rem; }
        
        .action-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; border: none; font-size: 1rem; }
        
        .action-btn.view { background: rgba(100, 150, 255, 0.1); color: #6496ff; }
        
        .action-btn.view:hover { background: #6496ff; color: white; transform: scale(1.1); }
        
        .action-btn.edit { background: rgba(196, 214, 0, 0.1); color: #c4d600; }
        
        .action-btn.edit:hover { background: #c4d600; color: #2a2a2a; transform: scale(1.1); }
        
        .action-btn.delete { background: rgba(255, 107, 53, 0.1); color: #ff6b35; }
        
        .action-btn.delete:hover { background: #ff6b35; color: white; transform: scale(1.1); }
        
        /* Modal */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-content { background: #2a2a2a; border-radius: 20px; padding: 2rem; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; border: 1px solid rgba(244, 237, 216, 0.1); animation: slideUp 0.3s ease; }
        
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: #f4edd8; letter-spacing: 2px; }
        
        .modal-close { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: rgba(255, 107, 53, 0.1); color: #ff6b35; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
        
        .modal-close:hover { background: #ff6b35; color: white; transform: rotate(90deg); }
        
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        
        .form-group { margin-bottom: 1.2rem; }
        
        .form-group.full { grid-column: 1 / -1; }
        
        .form-label { display: block; color: #999; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        
        .form-input { width: 100%; padding: 0.8rem 1rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .form-input:focus { outline: none; border-color: #c4d600; }
        
        .form-textarea { resize: vertical; min-height: 80px; }
        
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        
        .modal-btn { flex: 1; padding: 0.9rem; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .modal-btn.primary { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; }
        
        .modal-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .modal-btn.secondary { background: rgba(196, 214, 0, 0.1); color: #c4d600; border: 2px solid #c4d600; }
        
        .modal-btn.secondary:hover { background: #c4d600; color: #2a2a2a; }
        
        /* View Modal */
        .product-view-header { display: flex; gap: 2rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(244, 237, 216, 0.1); }
        
        .product-view-image { width: 200px; height: 200px; border-radius: 16px; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        
        .product-view-info { flex: 1; }
        
        .product-view-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f4edd8; margin-bottom: 0.5rem; letter-spacing: 1px; }
        
        .product-view-category { color: #999; font-size: 0.9rem; margin-bottom: 1rem; }
        
        .product-view-price { font-size: 2rem; color: #ff6b35; font-weight: 700; margin-bottom: 0.5rem; }
        
        .product-view-discount { display: inline-block; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; margin-left: 0.5rem; }
        
        .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        
        .detail-item { background: #1a1a1a; padding: 1rem; border-radius: 10px; border: 1px solid rgba(196, 214, 0, 0.1); }
        
        .detail-label { color: #999; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; }
        
        .detail-value { color: #f4edd8; font-size: 0.95rem; font-weight: 600; }
        
        .detail-item.full { grid-column: 1 / -1; }
        
        .empty-state { text-align: center; padding: 3rem; color: #999; }
        
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .filters-row { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .detail-grid { grid-template-columns: 1fr; }
          .product-view-header { flex-direction: column; }
        }
        
        @media (max-width: 768px) {
          .products-container { padding: 1rem; }
          .filters-section { padding: 1rem; }
          .filters-row { gap: 0.8rem; }
          .add-product-btn { width: 100%; justify-content: center; }
          
          .products-table-container { padding: 1rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .products-table { min-width: 900px; font-size: 0.85rem; }
          .products-table th, .products-table td { padding: 0.7rem 0.5rem; }
          .product-table-image { width: 50px; height: 50px; }
          
          .modal-content { padding: 1.5rem; max-width: 95%; }
          .modal-title { font-size: 1.5rem; }
          .form-input { font-size: 16px; /* Prevents zoom on iOS */ }
          .actions-cell { gap: 0.3rem; }
          .action-btn { width: 28px; height: 28px; font-size: 0.9rem; }
          
          .product-view-image { width: 150px; height: 150px; }
          .product-view-name { font-size: 1.5rem; }
          .product-view-price { font-size: 1.5rem; }
        }
        
        @media (max-width: 480px) {
          .products-container { padding: 0.8rem; }
          .page-title { font-size: 1.5rem; }
          .filters-section { padding: 0.8rem; }
          .modal-content { padding: 1rem; }
          .product-table-image { width: 40px; height: 40px; }
          .product-view-image { width: 120px; height: 120px; }
          .discount-label { font-size: 0.65rem; padding: 1px 4px; }
        }
      `}</style>

      <div className="products-container">
        <div className="products-header">
          <div className="page-title">Products Management</div>
          <div className="page-subtitle">Manage your store's product catalog</div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by product name..."
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
              <option value="all">All Statuses</option>
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

        {/* Products Table */}
        <div className="products-table-container">
          {filteredProducts.length > 0 ? (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Ad Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-id">{product.id}</td>
                    <td className="product-image-cell">
                      <img src={product.image} alt={product.name} className="product-table-image" />
                    </td>
                    <td>
                      <div className="product-name-cell">{product.name}</div>
                      <div className="product-category">{product.category}</div>
                    </td>
                    <td className="price-cell">
                      {product.originalPrice > product.price && (
                        <span className="original-price">{product.originalPrice} DT</span>
                      )}
                      <div>
                        {product.price} DT
                        {product.discount > 0 && (
                          <span className="discount-label">-{product.discount}%</span>
                        )}
                      </div>
                    </td>
                    <td className={`stock-cell ${
                      product.stock === 0 ? 'stock-out' : 
                      product.stock < 20 ? 'stock-low' : 'stock-ok'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      {product.adLink ? (
                        <a href={product.adLink} target="_blank" rel="noopener noreferrer" className="fb-link" title="View Facebook Ad">
                          📘
                        </a>
                      ) : (
                        <div className="fb-link disabled" title="No ad link">
                          📘
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn view" onClick={() => handleViewProduct(product)} title="View">
                          👁️
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditClick(product)} title="Edit">
                          ✏️
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteProduct(product.id)} title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div>No products found</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Product</div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="form-row">
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  className="form-input"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="299"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price (Optional)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                  placeholder="399"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  className="form-input"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  placeholder="50"
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
            </div>

            <div className="form-group full">
              <label className="form-label">Image URL *</label>
              <input
                type="text"
                className="form-input"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description..."
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Facebook Ad Link</label>
              <input
                type="text"
                className="form-input"
                value={newProduct.adLink}
                onChange={(e) => setNewProduct({...newProduct, adLink: e.target.value})}
                placeholder="https://facebook.com/ads/..."
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

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Product Details</div>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="product-view-header">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="product-view-image" />
              <div className="product-view-info">
                <div className="product-view-name">{selectedProduct.name}</div>
                <div className="product-view-category">{selectedProduct.category}</div>
                <div className="product-view-price">
                  {selectedProduct.price} DT
                  {selectedProduct.discount > 0 && (
                    <span className="product-view-discount">-{selectedProduct.discount}%</span>
                  )}
                </div>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                    {selectedProduct.originalPrice} DT
                  </div>
                )}
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Product ID</div>
                <div className="detail-value" style={{ color: '#c4d600' }}>{selectedProduct.id}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Stock</div>
                <div className="detail-value">{selectedProduct.stock} units</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Status</div>
                <div className="detail-value">
                  <span className={`status-badge ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Created Date</div>
                <div className="detail-value">{selectedProduct.createdDate}</div>
              </div>

              <div className="detail-item full">
                <div className="detail-label">Description</div>
                <div className="detail-value">{selectedProduct.description || 'No description'}</div>
              </div>

              <div className="detail-item full">
                <div className="detail-label">Facebook Ad Link</div>
                <div className="detail-value">
                  {selectedProduct.adLink ? (
                    <a href={selectedProduct.adLink} target="_blank" rel="noopener noreferrer" style={{ color: '#6496ff' }}>
                      {selectedProduct.adLink}
                    </a>
                  ) : (
                    <span style={{ color: '#999' }}>No ad link</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowViewModal(false)}>
                Close
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

            <div className="form-row">
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedProduct.originalPrice}
                  onChange={(e) => setSelectedProduct({...selectedProduct, originalPrice: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})}
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
            </div>

            <div className="form-group full">
              <label className="form-label">Image URL *</label>
              <input
                type="text"
                className="form-input"
                value={selectedProduct.image}
                onChange={(e) => setSelectedProduct({...selectedProduct, image: e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Facebook Ad Link</label>
              <input
                type="text"
                className="form-input"
                value={selectedProduct.adLink}
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
      
      {/* Delete Confirmation Modal */}
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

      {/* Validation Modal */}
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