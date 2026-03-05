import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../services/api";
import "../styles/UserInterface.css";

export default function HomePage({
  cartItems,
  cartCount,
  addToCart,
  goToCheckout,
}) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastAddedProduct, setLastAddedProduct] = useState(null);

  const handleAddToCart = (product) => {
    addToCart({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
    });
    setLastAddedProduct({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
    });
    setShowCartModal(true);
  };

  const openImageModal = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setHasDragged(false);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedProduct(null);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setHasDragged(false);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
    setLastAddedProduct(null);
  };

  const continueShopping = () => {
    closeCartModal();
    showNotification("تم إضافة المنتج بنجاح!");
  };

  const proceedToCheckout = () => {
    closeCartModal();
    goToCheckout();
  };

  const handleCart = () => {
    if (cartCount === 0) {
      showNotification("سلة التسوق فارغة!");
    } else {
      goToCheckout();
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.3, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(zoomLevel + delta, 1), 3);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const handleImageClick = (e) => {
    // Only zoom if user didn't drag
    if (!hasDragged) {
      // Toggle zoom: if at 1x, zoom to 2x, if zoomed, zoom out to 1x
      if (zoomLevel === 1) {
        setZoomLevel(2);
      } else {
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      }
    }
    setHasDragged(false);
  };

  const handleMouseDown = (e) => {
    setHasDragged(false);
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setHasDragged(true);
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getPublic();
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // ✅ NEW: Check if product is out of stock
  const isOutOfStock = (product) => {
    return product.stock === 0 || product.status === "Out of Stock";
  };

  // ✅ NEW: Navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#1a1a1a",
          color: "#f4edd8",
          fontSize: "1.5rem",
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <div>جاري تحميل المنتجات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-interface">
      {" "}
      {/* ✅ ADD THIS */}
      <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        {/* Notification */}
        {notification && <div className="notification">{notification}</div>}

        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <img
              src="./assets/logo_horizontal.png"
              alt="TOUSKIYE TN Logo"
              className="logo-image"
            />
          </div>
          <div className="cart-container" onClick={handleCart}>
            <div className="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <div className={`cart-badge ${cartCount > 0 ? "animate" : ""}`}>
              {cartCount}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>المجموعة المميزة</h1>
            <p className="hero-subtitle">اكتشف الجودة • اختبر التميز</p>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <h2 className="section-title">المنتجات المميزة</h2>

          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className={`product-card ${isOutOfStock(product) ? "out-of-stock" : ""}`}
                onClick={() => handleProductClick(product._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image-container">
                  <img
                    src={
                      product.image.startsWith("/uploads")
                        ? `http://localhost:5000${product.image}`
                        : product.image
                    }
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-badge">{product.category}</div>
                  {product.discount > 0 && !isOutOfStock(product) && (
                    <div className="discount-badge">
                      <span>-{product.discount}%</span>
                    </div>
                  )}

                  {/* ✅ NEW: Out of Stock Overlay */}
                  {isOutOfStock(product) && (
                    <div className="product-card-overlay">
                      <div className="out-of-stock-badge">نفذت الكمية</div>
                      <div className="coming-soon-message">
                        <span>🔄</span>
                        <span>سيعود قريباً</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-footer">
                    <div className="product-price-section">
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <div className="product-old-price">
                            {product.originalPrice} دينار
                          </div>
                        )}
                      <div className="product-price">
                        {product.price} <span>دينار</span>
                      </div>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={isOutOfStock(product)}
                    >
                      <span>
                        {isOutOfStock(product) ? "غير متوفر" : "أضف للسلة"}
                      </span>
                      <span>{isOutOfStock(product) ? "✕" : "+"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo-section">
              <div className="footer-logo">
                <div className="footer-logo-icon">👆</div>
                <div className="footer-logo-text">TOUSKIYE TN</div>
              </div>
              <p className="footer-tagline">
                وجهتك الموثوقة للمنتجات المميزة. الجودة والأناقة توصل لباب بيتك.
              </p>
            </div>

            <div className="footer-section">
              <h3>اتصل بنا</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>تونس، تونس</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>hello@touskiye.tn</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <span>+216 XX XXX XXX</span>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h3>تابعنا</h3>
              <div className="social-media">
                <p className="social-link">
                  <span className="social-icon">📘</span>
                  <span>فيسبوك</span>
                </p>
                <p className="social-link">
                  <span className="social-icon">📸</span>
                  <span>انستغرام</span>
                </p>
                <p className="social-link">
                  <span className="social-icon">🐦</span>
                  <span>تويتر</span>
                </p>
                <p className="social-link">
                  <span className="social-icon">💼</span>
                  <span>لينكد إن</span>
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; 2026 TOUSKIYE TN. جميع الحقوق محفوظة. صنع بـ ❤️ في تونس
            </p>
          </div>
        </footer>

        {/* Image Modal */}
        {showImageModal && selectedProduct && (
          <div className="modal-overlay" onClick={closeImageModal}>
            <div
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeImageModal}>
                ×
              </button>

              <div className="modal-image-container" onWheel={handleWheel}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className={`modal-image ${zoomLevel > 1 ? "zoomed" : ""}`}
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                    transformOrigin: "center center",
                  }}
                  draggable="false"
                  onClick={handleImageClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                <div className="zoom-controls">
                  <button className="zoom-btn" onClick={zoomOut}>
                    −
                  </button>
                  <button className="zoom-btn" onClick={zoomIn}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Confirmation Modal */}
        {showCartModal && lastAddedProduct && (
          <div className="modal-overlay" onClick={closeCartModal}>
            <div
              className="cart-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cart-modal-header">
                <div className="cart-modal-icon">✓</div>
                <h2 className="cart-modal-title">تمت الإضافة بنجاح!</h2>
              </div>

              <div className="cart-modal-body">
                <div className="added-product-showcase">
                  <div className="product-image-preview">
                    <img
                      src={lastAddedProduct.image}
                      alt={lastAddedProduct.name}
                    />
                  </div>
                  <div className="added-product-details">
                    <div className="added-product-name">
                      {lastAddedProduct.name}
                    </div>
                    <div className="added-product-price-label">السعر</div>
                    {lastAddedProduct.originalPrice && (
                      <div
                        className="product-old-price"
                        style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}
                      >
                        {lastAddedProduct.originalPrice} دينار
                      </div>
                    )}
                    <div className="added-product-price">
                      {lastAddedProduct.price} دينار
                      {lastAddedProduct.discount && (
                        <span
                          style={{
                            fontSize: "0.9rem",
                            marginRight: "0.5rem",
                            background:
                              "linear-gradient(135deg, #ff6b35, #e85d2a)",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            color: "white",
                          }}
                        >
                          -{lastAddedProduct.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="cart-modal-actions">
                  <button
                    className="cart-action-btn primary"
                    onClick={proceedToCheckout}
                  >
                    <span>إتمام عملية الشراء</span>
                    <span>💳</span>
                  </button>
                  <button
                    className="cart-action-btn secondary"
                    onClick={continueShopping}
                  >
                    <span>متابعة التسوق</span>
                    <span>🛍️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
