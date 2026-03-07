import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import '../styles/UserInterface.css';
import logoHorizontal from "./assests/logo_horizontal-removebg-preview.png";

// SVG Icons as components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const BoxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

export default function HomePage({ cartItems, cartCount, addToCart, goToCheckout }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const allProducts = response.data.data;
      const shownProducts = allProducts.filter(product => product.status === 'Shown');
      setProducts(shownProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ RESTORED: Original add to cart with modal
  const handleAddToCart = (product) => {
    if (product.stock === 0 || product.status === 'Out of Stock') {
      return;
    }

    addToCart({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      quantity: 1
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

  // ✅ RESTORED: Cart modal functions
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

  // ✅ RESTORED: Original cart icon click handler
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400';
    return imagePath.startsWith('/uploads')
      ? `http://localhost:5000${imagePath}`
      : imagePath;
  };

  const isOutOfStock = (product) => {
    return product.stock === 0 || product.status === 'Out of Stock';
  };

  if (loading) {
    return (
      <div className="user-interface">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <div>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-interface">
      <div dir="rtl">
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <img src={logoHorizontal} alt="TOUSKIYE" className="logo-image" />
          </div>

          <div className="nav-actions">
            {/* ✅ RESTORED: Cart icon with original onClick handler */}
            <div className="cart-container" onClick={handleCart}>
              <div className="cart-icon">
                <CartIcon />
              </div>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </div>
        </nav>

        {/* Notification */}
        {notification && (
          <div className="notification">
            <CheckIcon /> {notification}
          </div>
        )}

        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">مرحباً بك </h1>
          <p className="hero-subtitle">أفضل المنتجات بأسعار لا تقاوم - توصيل سريع لكل تونس</p>
        </section>

        {/* Search & Filter */}
        <section className="search-filter-section">
          <div className="search-box">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              className="search-input"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">جميع الفئات</option>
            {categories.filter(cat => cat !== 'all').map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <h2 className="section-title">منتجاتنا المميزة</h2>
          
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`product-card ${isOutOfStock(product) ? 'out-of-stock' : ''}`}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {/* Out of Stock Overlay */}
                  {isOutOfStock(product) && (
                    <div className="product-card-overlay">
                      <div className="out-of-stock-badge">نفذت الكمية</div>
                      <div className="coming-soon-message">
                        <ClockIcon /> قريباً
                      </div>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="product-image-container">
                    <img
                      src={getImageUrl(product.images?.[0] || product.image)}
                      alt={product.name}
                      className="product-image"
                    />

                    {product.status === 'Shown' && !isOutOfStock(product) && (
                      <div className="product-badge">متوفر</div>
                    )}

                    {product.discount > 0 && (
                      <div className="discount-badge">-{product.discount}%</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-footer">
                      <div className="product-price-section">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="product-old-price">{product.originalPrice} دت</div>
                        )}
                        <div className="product-price">
                          {product.price} <span>دت</span>
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
                        <PlusIcon />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><BoxIcon /></div>
              <p className="empty-message">لا توجد منتجات متاحة</p>
            </div>
          )}
        </section>

        {/* ✅ RESTORED: Cart Confirmation Modal with MODERN DESIGN */}
        {showCartModal && lastAddedProduct && (
          <div className="modal-overlay" onClick={closeCartModal}>
            <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="cart-modal-header">
                <div className="cart-modal-icon">
                  <CheckCircleIcon />
                </div>
                <h2 className="cart-modal-title">تمت الإضافة بنجاح!</h2>
              </div>

              <div className="cart-modal-body">
                <div className="added-product-showcase">
                  <div className="product-image-preview">
                    <img
                      src={getImageUrl(lastAddedProduct.images?.[0] || lastAddedProduct.image)}
                      alt={lastAddedProduct.name}
                    />
                  </div>
                  <div className="added-product-details">
                    <div className="added-product-name">
                      {lastAddedProduct.name}
                    </div>
                    <div className="added-product-price-label">السعر</div>
                    {lastAddedProduct.originalPrice && (
                      <div className="product-old-price" style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}>
                        {lastAddedProduct.originalPrice} دينار
                      </div>
                    )}
                    <div className="added-product-price">
                      {lastAddedProduct.price} دينار
                      {lastAddedProduct.discount && (
                        <span className="added-product-discount">
                          -{lastAddedProduct.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="cart-modal-actions">
                  <button className="cart-action-btn primary" onClick={proceedToCheckout}>
                    <CreditCardIcon />
                    <span>إتمام عملية الشراء</span>
                  </button>
                  <button className="cart-action-btn secondary" onClick={continueShopping}>
                    <ShoppingBagIcon />
                    <span>متابعة التسوق</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p className="footer-text">© 2026 TOUSKIYE - جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
}