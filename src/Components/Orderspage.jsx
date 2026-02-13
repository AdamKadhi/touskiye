import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    { 
      id: '#12345', 
      customerName: 'Ahmed Mohamed', 
      phone: '12345678',
      product: 'Luxury Watch', 
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
      quantity: 1,
      city: 'Tunis', 
      address: '123 Habib Bourguiba Street',
      total: 299, 
      status: 'Delivered', 
      date: '2026-02-13',
      paymentMethod: 'Cash on Delivery'
    },
    { 
      id: '#12344', 
      customerName: 'Fatima Zahra', 
      phone: '23456789',
      product: 'Wireless Headphones', 
      productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&q=80',
      quantity: 2,
      city: 'Sfax', 
      address: '456 Avenue de la Liberté',
      total: 398, 
      status: 'Shipping', 
      date: '2026-02-13',
      paymentMethod: 'Cash on Delivery'
    },
    { 
      id: '#12343', 
      customerName: 'Mohamed Ali', 
      phone: '34567890',
      product: 'Leather Bag', 
      productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80',
      quantity: 1,
      city: 'Sousse', 
      address: '789 Rue de Paris',
      total: 249, 
      status: 'Pending', 
      date: '2026-02-12',
      paymentMethod: 'Cash on Delivery'
    },
    { 
      id: '#12342', 
      customerName: 'Sarah Ahmed', 
      phone: '45678901',
      product: 'Luxury Watch', 
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
      quantity: 1,
      city: 'Monastir', 
      address: '321 Boulevard de l\'Environnement',
      total: 299, 
      status: 'Delivered', 
      date: '2026-02-12',
      paymentMethod: 'Cash on Delivery'
    },
    { 
      id: '#12341', 
      customerName: 'Youssef Hassan', 
      phone: '56789012',
      product: 'Wireless Headphones', 
      productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&q=80',
      quantity: 2,
      city: 'Tunis', 
      address: '654 Avenue Habib Bourguiba',
      total: 398, 
      status: 'Cancelled', 
      date: '2026-02-11',
      paymentMethod: 'Cash on Delivery'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    customerName: '',
    phone: '',
    product: '',
    quantity: 1,
    city: '',
    address: '',
    status: 'Pending'
  });

  const products = ['Luxury Watch', 'Wireless Headphones', 'Leather Bag'];
  const cities = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Gabes', 'Ariana', 'Gafsa'];
  const statuses = ['Pending', 'Shipping', 'Delivered', 'Cancelled'];

  const productPrices = {
    'Luxury Watch': 299,
    'Wireless Headphones': 199,
    'Leather Bag': 249
  };

  const productImages = {
    'Luxury Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
    'Wireless Headphones': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&q=80',
    'Leather Bag': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80'
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.phone.includes(searchQuery);
    const matchesProduct = filterProduct === 'all' || order.product === filterProduct;
    const matchesCity = filterCity === 'all' || order.city === filterCity;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesProduct && matchesCity && matchesStatus;
  });

  const handleAddOrder = () => {
    if (!newOrder.customerName || !newOrder.phone || !newOrder.product || !newOrder.city || !newOrder.address) {
      setValidationMessage('Please fill in all required fields');
      setShowValidationModal(true);
      return;
    }

    const order = {
      id: `#${10000 + orders.length + 1}`,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      product: newOrder.product,
      productImage: productImages[newOrder.product],
      quantity: newOrder.quantity,
      city: newOrder.city,
      address: newOrder.address,
      total: productPrices[newOrder.product] * newOrder.quantity,
      status: newOrder.status,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash on Delivery'
    };

    setOrders([order, ...orders]);
    setShowAddModal(false);
    setNewOrder({
      customerName: '',
      phone: '',
      product: '',
      quantity: 1,
      city: '',
      address: '',
      status: 'Pending'
    });
  };

  const handleEditOrder = () => {
    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? {
        ...selectedOrder,
        total: productPrices[selectedOrder.product] * selectedOrder.quantity
      } : order
    ));
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOrder = () => {
    setOrders(orders.filter(order => order.id !== orderToDelete));
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditClick = (order) => {
    setSelectedOrder({ ...order });
    setShowEditModal(true);
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .orders-container { padding: 2rem; background: #1a1a1a; min-height: 100vh; }
        
        .orders-header { margin-bottom: 2rem; }
        
        .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f4edd8; letter-spacing: 2px; margin-bottom: 0.5rem; }
        
        .page-subtitle { color: #999; font-size: 0.9rem; }
        
        /* Filters Section */
        .filters-section { background: #2a2a2a; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(244, 237, 216, 0.1); }
        
        .filters-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 1rem; align-items: center; }
        
        .search-box { position: relative; }
        
        .search-input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .search-input:focus { outline: none; border-color: #c4d600; }
        
        .search-input::placeholder { color: #666; }
        
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #999; font-size: 1.1rem; }
        
        .filter-select { padding: 0.8rem 1rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; cursor: pointer; transition: all 0.3s ease; }
        
        .filter-select:focus { outline: none; border-color: #c4d600; }
        
        .filter-select option { background: #2a2a2a; color: #f4edd8; }
        
        .add-order-btn { padding: 0.8rem 1.5rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        
        .add-order-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        /* Orders Table */
        .orders-table-container { background: #2a2a2a; border-radius: 16px; padding: 1.5rem; border: 1px solid rgba(244, 237, 216, 0.1); overflow-x: auto; }
        
        .orders-table { width: 100%; border-collapse: collapse; }
        
        .orders-table th { text-align: left; padding: 1rem; color: #999; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid rgba(244, 237, 216, 0.1); white-space: nowrap; }
        
        .orders-table td { text-align: left; padding: 1rem; color: #ccc; font-size: 0.9rem; border-bottom: 1px solid rgba(244, 237, 216, 0.05); }
        
        .orders-table tr:hover td { background: rgba(196, 214, 0, 0.05); }
        
        .order-id { color: #c4d600; font-weight: 700; }
        
        .product-cell { display: flex; align-items: center; gap: 0.8rem; }
        
        .product-image { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
        
        .status-badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
        
        .status-badge.delivered { background: rgba(196, 214, 0, 0.2); color: #c4d600; }
        
        .status-badge.pending { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
        
        .status-badge.shipping { background: rgba(100, 150, 255, 0.2); color: #6496ff; }
        
        .status-badge.cancelled { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
        
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
        
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        
        .modal-btn { flex: 1; padding: 0.9rem; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .modal-btn.primary { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; }
        
        .modal-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .modal-btn.secondary { background: rgba(196, 214, 0, 0.1); color: #c4d600; border: 2px solid #c4d600; }
        
        .modal-btn.secondary:hover { background: #c4d600; color: #2a2a2a; }
        
        /* View Modal */
        .order-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-top: 1.5rem; }
        
        .detail-item { background: #1a1a1a; padding: 1rem; border-radius: 10px; border: 1px solid rgba(196, 214, 0, 0.1); }
        
        .detail-label { color: #999; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; }
        
        .detail-value { color: #f4edd8; font-size: 0.95rem; font-weight: 600; }
        
        .detail-item.full { grid-column: 1 / -1; }
        
        .product-detail { display: flex; align-items: center; gap: 1rem; }
        
        .product-detail-image { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; }
        
        .empty-state { text-align: center; padding: 3rem; color: #999; }
        
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .filters-row { grid-template-columns: 1fr; }
          .order-detail-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 768px) {
          .orders-container { padding: 1rem; }
          .filters-section { padding: 1rem; }
          .filters-row { gap: 0.8rem; }
          .add-order-btn { width: 100%; justify-content: center; }
          
          .orders-table-container { padding: 1rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .orders-table { min-width: 800px; font-size: 0.85rem; }
          .orders-table th, .orders-table td { padding: 0.7rem 0.5rem; }
          
          .modal-content { padding: 1.5rem; max-width: 95%; }
          .modal-title { font-size: 1.5rem; }
          .form-input { font-size: 16px; /* Prevents zoom on iOS */ }
          .actions-cell { gap: 0.3rem; }
          .action-btn { width: 28px; height: 28px; font-size: 0.9rem; }
        }
        
        @media (max-width: 480px) {
          .orders-container { padding: 0.8rem; }
          .page-title { font-size: 1.5rem; }
          .filters-section { padding: 0.8rem; }
          .modal-content { padding: 1rem; }
          .product-cell { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .product-image { width: 35px; height: 35px; }
        }
      `}</style>

      <div className="orders-container">
        <div className="orders-header">
          <div className="page-title">Orders Management</div>
          <div className="page-subtitle">Manage and track all customer orders</div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select 
              className="filter-select"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
            >
              <option value="all">All Products</option>
              {products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
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

            <button className="add-order-btn" onClick={() => setShowAddModal(true)}>
              <span>+</span>
              <span>Add Order</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          {filteredOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{order.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src={order.productImage} alt={order.product} className="product-image" />
                        <div>
                          <div style={{ fontWeight: '600' }}>{order.product}</div>
                          <div style={{ fontSize: '0.8rem', color: '#999' }}>Qty: {order.quantity}</div>
                        </div>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#f4edd8' }}>{order.total} DT</td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn view" onClick={() => handleViewOrder(order)} title="View">
                          👁️
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditClick(order)} title="Edit">
                          ✏️
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteOrder(order.id)} title="Delete">
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
              <div>No orders found</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Order</div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-input"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-input"
                value={newOrder.phone}
                onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}
                placeholder="12345678"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product *</label>
              <select
                className="form-input"
                value={newOrder.product}
                onChange={(e) => setNewOrder({...newOrder, product: e.target.value})}
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                className="form-input"
                value={newOrder.city}
                onChange={(e) => setNewOrder({...newOrder, city: e.target.value})}
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                className="form-input form-textarea"
                value={newOrder.address}
                onChange={(e) => setNewOrder({...newOrder, address: e.target.value})}
                placeholder="Enter full delivery address"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Status *</label>
              <select
                className="form-input"
                value={newOrder.status}
                onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleAddOrder}>
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Order Details</div>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="order-detail-grid">
              <div className="detail-item">
                <div className="detail-label">Order ID</div>
                <div className="detail-value" style={{ color: '#c4d600' }}>{selectedOrder.id}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Date</div>
                <div className="detail-value">{selectedOrder.date}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Customer Name</div>
                <div className="detail-value">{selectedOrder.customerName}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Phone Number</div>
                <div className="detail-value">{selectedOrder.phone}</div>
              </div>

              <div className="detail-item full">
                <div className="detail-label">Product</div>
                <div className="product-detail">
                  <img src={selectedOrder.productImage} alt={selectedOrder.product} className="product-detail-image" />
                  <div>
                    <div className="detail-value">{selectedOrder.product}</div>
                    <div style={{ color: '#999', fontSize: '0.85rem' }}>Quantity: {selectedOrder.quantity}</div>
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">City</div>
                <div className="detail-value">{selectedOrder.city}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Delivery Status</div>
                <div className="detail-value">
                  <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="detail-item full">
                <div className="detail-label">Delivery Address</div>
                <div className="detail-value">{selectedOrder.address}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Payment Method</div>
                <div className="detail-value">{selectedOrder.paymentMethod}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Total Amount</div>
                <div className="detail-value" style={{ color: '#ff6b35', fontSize: '1.3rem' }}>{selectedOrder.total} DT</div>
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

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Order</div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-input"
                value={selectedOrder.customerName}
                onChange={(e) => setSelectedOrder({...selectedOrder, customerName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-input"
                value={selectedOrder.phone}
                onChange={(e) => setSelectedOrder({...selectedOrder, phone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product *</label>
              <select
                className="form-input"
                value={selectedOrder.product}
                onChange={(e) => setSelectedOrder({...selectedOrder, product: e.target.value, productImage: productImages[e.target.value]})}
              >
                {products.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={selectedOrder.quantity}
                onChange={(e) => setSelectedOrder({...selectedOrder, quantity: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                className="form-input"
                value={selectedOrder.city}
                onChange={(e) => setSelectedOrder({...selectedOrder, city: e.target.value})}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                className="form-input form-textarea"
                value={selectedOrder.address}
                onChange={(e) => setSelectedOrder({...selectedOrder, address: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Status *</label>
              <select
                className="form-input"
                value={selectedOrder.status}
                onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleEditOrder}>
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
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
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