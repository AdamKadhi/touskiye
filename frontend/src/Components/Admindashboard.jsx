import React, { useState } from 'react';
import OrdersPage from './Orderspage';
import ProductsPage from './Productpage';
import ConfirmModal from './ConfirmModal';

export default function AdminDashboard({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for dashboard
  const stats = {
    totalRevenue: 27430,
    revenueChange: '+12.8%',
    totalOrders: 1562,
    ordersChange: '+3.3%',
    pendingOrders: 48,
    completedOrders: 1514
  };

  const recentOrders = [
    { id: '#12345', customer: 'Ahmed Mohamed', product: 'Luxury Watch', amount: 299, status: 'Delivered', date: '2026-02-13' },
    { id: '#12344', customer: 'Fatima Zahra', product: 'Wireless Headphones', amount: 199, status: 'Shipping', date: '2026-02-13' },
    { id: '#12343', customer: 'Mohamed Ali', product: 'Leather Bag', amount: 249, status: 'Pending', date: '2026-02-12' },
    { id: '#12342', customer: 'Sarah Ahmed', product: 'Luxury Watch', amount: 299, status: 'Delivered', date: '2026-02-12' },
    { id: '#12341', customer: 'Youssef Hassan', product: 'Wireless Headphones', amount: 398, status: 'Delivered', date: '2026-02-11' }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 22300 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 24100 },
    { month: 'May', revenue: 21700 },
    { month: 'Jun', revenue: 27430 }
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .dashboard-container { display: flex; min-height: 100vh; background: #1a1a1a; }
        
        /* Sidebar */
        .sidebar { width: 260px; background: #2a2a2a; border-right: 1px solid rgba(244, 237, 216, 0.1); display: flex; flex-direction: column; position: fixed; height: 100vh; overflow-y: auto; z-index: 100; transition: transform 0.3s ease; }
        
        .sidebar-header { padding: 2rem 1.5rem; border-bottom: 1px solid rgba(244, 237, 216, 0.1); }
        
        .logo-section { display: flex; align-items: center; gap: 0.8rem; }
        
        .logo-icon { width: 45px; height: 45px; background: linear-gradient(135deg, #c4d600, #ff6b35); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: white; }
        
        .logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #f4edd8; letter-spacing: 2px; }
        
        .sidebar-nav { flex: 1; padding: 1.5rem 0; }
        
        .nav-item { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.5rem; color: #ccc; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin: 0.3rem 1rem; border-radius: 10px; text-decoration: none; }
        
        .nav-item:hover { background: rgba(196, 214, 0, 0.1); color: #c4d600; }
        
        .nav-item.active { background: linear-gradient(135deg, rgba(196, 214, 0, 0.15), rgba(255, 107, 53, 0.15)); color: #c4d600; border-left: 3px solid #c4d600; }
        
        .nav-icon { font-size: 1.3rem; width: 24px; display: flex; align-items: center; justify-content: center; }
        
        .sidebar-footer { padding: 1.5rem; border-top: 1px solid rgba(244, 237, 216, 0.1); }
        
        .logout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.8rem; padding: 0.9rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .logout-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        /* Mobile Menu Button */
        .mobile-menu-btn { display: none; position: fixed; top: 1rem; left: 1rem; width: 50px; height: 50px; background: linear-gradient(135deg, #ff6b35, #e85d2a); border: none; border-radius: 12px; cursor: pointer; z-index: 101; flex-direction: column; align-items: center; justify-content: center; gap: 5px; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); transition: all 0.3s ease; }
        
        .mobile-menu-btn:hover { transform: scale(1.05); }
        
        .mobile-menu-btn span { width: 25px; height: 3px; background: white; border-radius: 2px; transition: all 0.3s ease; }
        
        .mobile-menu-btn.active span:nth-child(1) { transform: rotate(45deg) translate(7px, 7px); }
        .mobile-menu-btn.active span:nth-child(2) { opacity: 0; }
        .mobile-menu-btn.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }
        
        /* Mobile Overlay */
        .mobile-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 99; }
        
        /* Main Content */
        .main-content { flex: 1; margin-left: 260px; background: #1a1a1a; }
        
        .top-bar { background: #2a2a2a; padding: 1.5rem 2rem; border-bottom: 1px solid rgba(244, 237, 216, 0.1); display: flex; justify-content: space-between; align-items: center; }
        
        .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f4edd8; letter-spacing: 2px; }
        
        .page-subtitle { color: #999; font-size: 0.9rem; margin-top: 0.3rem; }
        
        .top-actions { display: flex; gap: 1rem; }
        
        .action-btn { padding: 0.7rem 1.5rem; background: rgba(196, 214, 0, 0.1); border: 2px solid #c4d600; color: #c4d600; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .action-btn:hover { background: #c4d600; color: #2a2a2a; transform: translateY(-2px); }
        
        .action-btn.primary { background: linear-gradient(135deg, #ff6b35, #e85d2a); border: none; color: white; }
        
        .action-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        /* Content Area */
        .content-area { padding: 2rem; }
        
        /* Stats Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        
        .stat-card { background: #2a2a2a; border-radius: 16px; padding: 1.8rem; border: 1px solid rgba(244, 237, 216, 0.1); transition: all 0.3s ease; }
        
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(196, 214, 0, 0.15); border-color: rgba(196, 214, 0, 0.3); }
        
        .stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
        
        .stat-label { color: #999; font-size: 0.9rem; font-weight: 600; }
        
        .stat-icon { width: 40px; height: 40px; background: linear-gradient(135deg, rgba(196, 214, 0, 0.2), rgba(255, 107, 53, 0.2)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
        
        .stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: #f4edd8; letter-spacing: 1px; margin-bottom: 0.5rem; }
        
        .stat-change { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; }
        
        .stat-change.positive { color: #c4d600; }
        
        .stat-change.negative { color: #ff6b35; }
        
        /* Charts Grid */
        .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        
        .chart-card { background: #2a2a2a; border-radius: 16px; padding: 1.8rem; border: 1px solid rgba(244, 237, 216, 0.1); }
        
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .chart-title { font-size: 1.2rem; color: #f4edd8; font-weight: 700; }
        
        .chart-filter { padding: 0.5rem 1rem; background: rgba(196, 214, 0, 0.1); border: 1px solid rgba(196, 214, 0, 0.3); color: #c4d600; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-family: 'Cairo', sans-serif; }
        
        .revenue-chart { height: 250px; display: flex; align-items: flex-end; gap: 0.8rem; padding: 1rem 0; }
        
        .revenue-bar { flex: 1; background: linear-gradient(180deg, #c4d600, #ff6b35); border-radius: 8px 8px 0 0; position: relative; cursor: pointer; transition: all 0.3s ease; }
        
        .revenue-bar:hover { opacity: 0.8; transform: translateY(-5px); }
        
        .bar-label { position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: #999; white-space: nowrap; }
        
        .orders-status { display: flex; flex-direction: column; gap: 1.2rem; }
        
        .status-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(196, 214, 0, 0.05); border-radius: 10px; border-right: 3px solid #c4d600; }
        
        .status-item.pending { border-right-color: #ff6b35; }
        
        .status-label { color: #ccc; font-size: 0.9rem; font-weight: 600; }
        
        .status-value { font-size: 1.5rem; font-weight: 700; color: #f4edd8; }
        
        /* Recent Orders Table */
        .table-card { background: #2a2a2a; border-radius: 16px; padding: 1.8rem; border: 1px solid rgba(244, 237, 216, 0.1); }
        
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .orders-table { width: 100%; border-collapse: collapse; }
        
        .orders-table th { text-align: right; padding: 1rem; color: #999; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid rgba(244, 237, 216, 0.1); }
        
        .orders-table td { text-align: right; padding: 1rem; color: #ccc; font-size: 0.9rem; border-bottom: 1px solid rgba(244, 237, 216, 0.05); }
        
        .orders-table tr:hover td { background: rgba(196, 214, 0, 0.05); }
        
        .order-id { color: #c4d600; font-weight: 600; }
        
        .status-badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; }
        
        .status-badge.completed { background: rgba(196, 214, 0, 0.2); color: #c4d600; }
        
        .status-badge.pending { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
        
        .status-badge.shipping { background: rgba(100, 150, 255, 0.2); color: #6496ff; }
        
        .amount { color: #f4edd8; font-weight: 700; }
        
        .view-all { color: #c4d600; font-weight: 600; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; }
        
        .view-all:hover { color: #ff6b35; }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: 1fr; }
          .charts-grid { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .mobile-overlay { display: block; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
          .mobile-overlay.active { opacity: 1; pointer-events: all; }
          
          .sidebar { transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 20px rgba(0,0,0,0.5); }
          
          .main-content { margin-left: 0; }
          .top-bar { padding: 1rem; flex-direction: column; align-items: stretch; gap: 1rem; padding-top: 5rem; }
          .top-actions { flex-direction: column; }
          .action-btn { width: 100%; justify-content: center; }
          .page-title { font-size: 1.5rem; }
          
          .stats-grid { gap: 1rem; }
          .stat-card { padding: 1.2rem; }
          .stat-value { font-size: 2rem; }
          
          .charts-grid { gap: 1rem; }
          .chart-card { padding: 1.2rem; }
          
          .table-card { padding: 1rem; }
          .orders-table { font-size: 0.85rem; }
          .orders-table th, .orders-table td { padding: 0.7rem 0.5rem; }
        }
        
        @media (max-width: 480px) {
          .mobile-menu-btn { width: 45px; height: 45px; }
          .top-bar { padding-top: 4rem; }
          .stat-card { padding: 1rem; }
          .stat-value { font-size: 1.8rem; }
          .chart-card { padding: 1rem; }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Overlay */}
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-section">
              <div className="logo-icon">T</div>
              <div className="logo-text">TOUSKIYE</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${currentPage === 'overview' ? 'active' : ''}`}
              onClick={() => handlePageChange('overview')}
            >
              <span className="nav-icon">📊</span>
              <span>Overview</span>
            </div>
            
            <div 
              className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}
              onClick={() => handlePageChange('orders')}
            >
              <span className="nav-icon">📦</span>
              <span>Orders</span>
            </div>
            
            <div 
              className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}
              onClick={() => handlePageChange('products')}
            >
              <span className="nav-icon">🛍️</span>
              <span>Products</span>
            </div>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {currentPage === 'overview' ? (
            <>
              <div className="top-bar">
                <div>
                  <div className="page-title">Overview</div>
                  <div className="page-subtitle">Detailed information about your store</div>
                </div>
                <div className="top-actions">
                  <button className="action-btn">This Month 📅</button>
                  <button className="action-btn primary">Export 📤</button>
                </div>
              </div>

              <div className="content-area">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Revenue</span>
                  <div className="stat-icon">💰</div>
                </div>
                <div className="stat-value">{stats.totalRevenue.toLocaleString()} DT</div>
                <div className="stat-change positive">
                  <span>↗</span>
                  <span>{stats.revenueChange} vs last month</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Orders</span>
                  <div className="stat-icon">📦</div>
                </div>
                <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
                <div className="stat-change positive">
                  <span>↗</span>
                  <span>{stats.ordersChange} vs last month</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Average Order Value</span>
                  <div className="stat-icon">💳</div>
                </div>
                <div className="stat-value">{Math.round(stats.totalRevenue / stats.totalOrders)} DT</div>
                <div className="stat-change positive">
                  <span>↗</span>
                  <span>+8.2% vs last month</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Monthly Revenue</div>
                  <button className="chart-filter">Last 6 Months ▼</button>
                </div>
                <div className="revenue-chart">
                  {monthlyRevenue.map((item, index) => (
                    <div 
                      key={index}
                      className="revenue-bar"
                      style={{ height: `${(item.revenue / 30000) * 100}%` }}
                    >
                      <div className="bar-label">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Orders Status</div>
                </div>
                <div className="orders-status">
                  <div className="status-item">
                    <span className="status-label">Completed Orders</span>
                    <span className="status-value">{stats.completedOrders}</span>
                  </div>
                  <div className="status-item pending">
                    <span className="status-label">Pending Orders</span>
                    <span className="status-value">{stats.pendingOrders}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Total Orders</span>
                    <span className="status-value">{stats.totalOrders}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="table-card">
              <div className="table-header">
                <div className="chart-title">Recent Orders</div>
                <div className="view-all">
                  <span>View All</span>
                  <span>→</span>
                </div>
              </div>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td className="amount">{order.amount} DT</td>
                      <td>
                        <span className={`status-badge ${
                          order.status === 'Delivered' ? 'completed' : 
                          order.status === 'Shipping' ? 'shipping' : 'pending'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          ) : currentPage === 'orders' ? (
            <OrdersPage />
          ) : currentPage === 'products' ? (
            <ProductsPage />
          ) : null}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to login again to access the dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}