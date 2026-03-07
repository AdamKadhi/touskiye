import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI } from "../services/api";
import "../styles/UserInterface.css";
import logoHorizontal from "./assests/logo_horizontal.png";

// SVG Icons
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function ProductDetailPage({ addToCart, cartCount, goToCheckout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  // ✅ FIX 1: Reset quantity to 1 whenever product ID changes OR component mounts
  useEffect(() => {
    // Reset quantity FIRST before fetching
    setQuantity(1);
    fetchProduct();
  }, [id]);

  // Additional effect to ensure quantity is 1 when component unmounts and remounts
  useEffect(() => {
    return () => {
      // Cleanup: reset quantity when component unmounts
      setQuantity(1);
    };
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getOne(id);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1,
    );
  };

  const handleAddToCart = () => {
    if (product.stock === 0 || product.status === "Out of Stock") {
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

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // ✅ Navigate back to homepage after adding to cart
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // ✅ FIX 1: Buy Now with proper quantity handling
  const handleBuyNow = () => {
    if (product.stock === 0 || product.status === "Out of Stock") {
      return;
    }

    // Capture current quantity value before any state changes
    const currentQuantity = quantity;

    // Add to cart with captured quantity (not state variable)
    addToCart({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      quantity: currentQuantity
    });

    // Immediately reset quantity to 1 (synchronously)
    setQuantity(1);

    // Navigate to checkout
    goToCheckout();
  };

  const handleCart = () => {
    if (cartCount === 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else {
      goToCheckout();
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled"><StarIcon filled /></span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half"><StarIcon filled /></span>);
      } else {
        stars.push(<span key={i} className="star empty"><StarIcon filled={false} /></span>);
      }
    }
    return stars;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600";
    return imagePath.startsWith("/uploads")
      ? `http://localhost:5000${imagePath}`
      : imagePath;
  };

  const getVideoUrl = (videoPath) => {
    if (!videoPath) return "";
    return videoPath.startsWith("/uploads")
      ? `http://localhost:5000${videoPath}`
      : videoPath;
  };

  const isOutOfStock =
    product?.stock === 0 || product?.status === "Out of Stock";

  if (loading) {
    return (
      <div className="user-interface">
        <div className="product-detail-loading">
          <div className="loading-spinner">⏳</div>
          <div>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="user-interface">
        <div className="product-detail-error">
          <div className="error-icon"><XIcon /></div>
          <div>المنتج غير موجود</div>
          <button className="back-btn" onClick={() => navigate("/")}>
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const displayImages =
    product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="user-interface">
      <div dir="rtl" className="product-detail-container product-detail-compact">
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logoHorizontal} alt="TOUSKIYE" className="logo-image" style={{ cursor: 'pointer' }} />
          </div>

          <div className="nav-actions">
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

        {/* Breadcrumb - Smaller */}
        <div className="detail-breadcrumb" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>
          <span onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>الرئيسية</span> / المنتجات / {product.name}
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="notification">
            <CheckIcon /> تم إضافة المنتج إلى السلة!
          </div>
        )}

        {/* Main Content - with padding bottom for fixed buttons */}
        <div className="detail-content" style={{ paddingBottom: '120px' }}>
          {/* Images Section */}
          <div className="detail-images-section">
            <div className="main-image-container">
              <img
                src={getImageUrl(displayImages[currentImageIndex])}
                alt={product.name}
                className="main-image"
              />

              {displayImages.length > 1 && (
                <>
                  <button
                    className="image-nav-btn prev"
                    onClick={handlePrevImage}
                  >
                    ❮
                  </button>
                  <button
                    className="image-nav-btn next"
                    onClick={handleNextImage}
                  >
                    ❯
                  </button>

                  <div className="image-indicator">
                    {displayImages.map((_, index) => (
                      <div
                        key={index}
                        className={`indicator-dot ${index === currentImageIndex ? "active" : ""}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="thumbnail-grid">
                {displayImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="detail-info-section">
            {/* Category */}
            <div className="product-category" style={{ fontSize: '0.75rem', marginBottom: '0.3rem',width:'fit-content' }}>{product.category}</div>
            
            {/* Title and Rating on same line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h1 className="product-title" style={{ fontSize: '1.5rem', margin: 0 }}>{product.name}</h1>
              <div className="rating-section" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="stars">{renderStars(product.rating || 0)}</div>
                <span className="rating-text" style={{ fontSize: '0.75rem' }}>
                  ({product.numReviews || 0} تقييم)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="price-section" style={{ marginBottom: '0.75rem' }}>
              <div className="current-price" style={{ fontSize: '1.75rem' }}>{product.price} دت</div>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <div className="original-price" style={{ fontSize: '1rem' }}>{product.originalPrice} دت</div>
                  {product.discount > 0 && (
                    <div className="discount-badge" style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}>-{product.discount}%</div>
                  )}
                </>
              )}
            </div>

            {/* Stock - Only show when 10 or less, in RED */}
            {!isOutOfStock && product.stock <= 10 && (
              <div
                className="stock-info"
                style={{ 
                  marginBottom: '0.75rem', 
                  padding: '0.6rem 1rem', 
                  fontSize: '0.85rem',
                  background: 'rgba(231, 76, 60, 0.1)',
                  border: '2px solid #E74C3C',
                  color: '#E74C3C',
                  fontWeight: '700'
                }}
              >
                <XIcon />
                <span>تنبيه: متبقي {product.stock} وحدات فقط!</span>
              </div>
            )}

            {/* Out of stock message */}
            {isOutOfStock && (
              <div
                className="stock-info out-of-stock"
                style={{ marginBottom: '0.75rem', padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <XIcon />
                <span>نفذت الكمية</span>
              </div>
            )}

            {/* Description - Preserve formatting */}
            {product.description && (
              <div className="description-section" style={{ marginBottom: '1rem' }}>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>الوصف</h2>
                <p className="description-text" style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'  // ✅ Preserves line breaks and spaces
                }}>{product.description}</p>
              </div>
            )}

            {/* Video Player Section - Autoplay, Loop, Muted, No Controls */}
            {(product.videoFile || product.videoUrl) && (
              <div className="video-player-section" style={{ marginBottom: '1rem' }}>
                <h2 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>فيديو المنتج</h2>
                {product.videoFile ? (
                  <div className="video-player-container">
                    <video
                      className="video-player"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source
                        src={getVideoUrl(product.videoFile)}
                        type="video/mp4"
                      />
                      <source
                        src={getVideoUrl(product.videoFile)}
                        type="video/webm"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  product.videoUrl && (
                    <div className="video-player-container">
                      <iframe
                        src={product.videoUrl}
                        title={product.name}
                        className="video-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )
                )}
              </div>
            )}

            {/* Quantity - Smaller (NOT in fixed bar) */}
            {!isOutOfStock && (
              <div className="quantity-section" style={{ marginBottom: '1.5rem' }}>
                <div className="quantity-label" style={{ fontSize: '0.85rem' }}>الكمية:</div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <MinusIcon />
                  </button>
                  <div className="quantity-value" style={{ fontSize: '1rem', minWidth: '50px' }}>{quantity}</div>
                  <button
                    className="quantity-btn"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            )}

            {/* ✅ Fixed Action Buttons - Inside info section for desktop left positioning */}
            <div className="fixed-action-bar">
              <div className="fixed-action-content">
                <button
                  className="add-to-cart-main-fixed"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCartIcon />
                  <span>{isOutOfStock ? "غير متوفر" : "أضف إلى السلة"}</span>
                </button>

                <button
                  className="buy-now-btn-fixed"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  <ZapIcon />
                  <span>{isOutOfStock ? "غير متوفر" : "اشتري الآن"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}