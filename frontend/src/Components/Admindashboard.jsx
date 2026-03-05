import React, { useState } from "react";
import OrdersPage from "./Orderspage";
import ProductsPage from "./Productpage";
import ConfirmModal from "./ConfirmModal";
import "../styles/AdminInterface.css";
export default function AdminDashboard({ onLogout }) {
  const [currentPage, setCurrentPage] = useState("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for dashboard
  const stats = {
    totalRevenue: 27430,
    revenueChange: "+12.8%",
    totalOrders: 1562,
    ordersChange: "+3.3%",
    pendingOrders: 48,
    completedOrders: 1514,
  };

  const recentOrders = [
    {
      id: "#12345",
      customer: "Ahmed Mohamed",
      product: "Luxury Watch",
      amount: 299,
      status: "Delivered",
      date: "2026-02-13",
    },
    {
      id: "#12344",
      customer: "Fatima Zahra",
      product: "Wireless Headphones",
      amount: 199,
      status: "Shipping",
      date: "2026-02-13",
    },
    {
      id: "#12343",
      customer: "Mohamed Ali",
      product: "Leather Bag",
      amount: 249,
      status: "Pending",
      date: "2026-02-12",
    },
    {
      id: "#12342",
      customer: "Sarah Ahmed",
      product: "Luxury Watch",
      amount: 299,
      status: "Delivered",
      date: "2026-02-12",
    },
    {
      id: "#12341",
      customer: "Youssef Hassan",
      product: "Wireless Headphones",
      amount: 398,
      status: "Delivered",
      date: "2026-02-11",
    },
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 18500 },
    { month: "Feb", revenue: 22300 },
    { month: "Mar", revenue: 19800 },
    { month: "Apr", revenue: 24100 },
    { month: "May", revenue: 21700 },
    { month: "Jun", revenue: 27430 },
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
    <div className="admin-interface">
      <div style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="dashboard-container">
          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Mobile Overlay */}
          <div
            className={`mobile-overlay ${isMobileMenuOpen ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <div className="sidebar-header">
              <div className="logo-section">
                <div className="logo-icon">T</div>
                <div className="logo-text">TOUSKIYE</div>
              </div>
            </div>

            <nav className="sidebar-nav">
              <div
                className={`nav-item ${currentPage === "overview" ? "active" : ""}`}
                onClick={() => handlePageChange("overview")}
              >
                <span className="nav-icon">📊</span>
                <span>Overview</span>
              </div>

              <div
                className={`nav-item ${currentPage === "orders" ? "active" : ""}`}
                onClick={() => handlePageChange("orders")}
              >
                <span className="nav-icon">📦</span>
                <span>Orders</span>
              </div>

              <div
                className={`nav-item ${currentPage === "products" ? "active" : ""}`}
                onClick={() => handlePageChange("products")}
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
            {currentPage === "overview" ? (
              <>
                <div className="top-bar">
                  <div>
                    <div className="page-title">Overview</div>
                    <div className="page-subtitle">
                      Detailed information about your store
                    </div>
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
                      <div className="stat-value">
                        {stats.totalRevenue.toLocaleString()} DT
                      </div>
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
                      <div className="stat-value">
                        {stats.totalOrders.toLocaleString()}
                      </div>
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
                      <div className="stat-value">
                        {Math.round(stats.totalRevenue / stats.totalOrders)} DT
                      </div>
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
                        <button className="chart-filter">
                          Last 6 Months ▼
                        </button>
                      </div>
                      <div className="revenue-chart">
                        {monthlyRevenue.map((item, index) => (
                          <div
                            key={index}
                            className="revenue-bar"
                            style={{
                              height: `${(item.revenue / 30000) * 100}%`,
                            }}
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
                          <span className="status-value">
                            {stats.completedOrders}
                          </span>
                        </div>
                        <div className="status-item pending">
                          <span className="status-label">Pending Orders</span>
                          <span className="status-value">
                            {stats.pendingOrders}
                          </span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Total Orders</span>
                          <span className="status-value">
                            {stats.totalOrders}
                          </span>
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
                              <span
                                className={`status-badge ${
                                  order.status === "Delivered"
                                    ? "completed"
                                    : order.status === "Shipping"
                                      ? "shipping"
                                      : "pending"
                                }`}
                              >
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
            ) : currentPage === "orders" ? (
              <OrdersPage />
            ) : currentPage === "products" ? (
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
    </div>
  );
}
