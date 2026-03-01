import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

export default function ProductDetailPage({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getOne(id);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    if (product.stock === 0 || product.status === 'Out of Stock') {
      return;
    }

    addToCart({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
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
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600';
    return imagePath.startsWith('/uploads') 
      ? `http://localhost:5000${imagePath}` 
      : imagePath;
  };

  const isOutOfStock = product?.stock === 0 || product?.status === 'Out of Stock';

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner">⏳</div>
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">❌</div>
        <div>المنتج غير موجود</div>
        <button className="back-btn" onClick={() => navigate('/')}>
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  const displayImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div dir="rtl" className="product-detail-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .product-detail-container {
          min-height: 100vh;
          background: #f8f6f0;
          font-family: 'Cairo', sans-serif;
          padding: 2rem 0;
        }
        
        .detail-navbar {
          background: #2a2a2a;
          padding: 1.2rem 3rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .back-button {
          background: linear-gradient(135deg, #c4d600, #ff6b35);
          color: #2a2a2a;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(196, 214, 0, 0.4);
        }
        
        .detail-breadcrumb {
          color: #999;
          font-size: 0.9rem;
        }
        
        .detail-breadcrumb span {
          color: #c4d600;
          cursor: pointer;
        }
        
        .detail-breadcrumb span:hover {
          text-decoration: underline;
        }
        
        .detail-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        
        /* Image Section */
        .detail-images-section {
          position: sticky;
          top: 120px;
          height: fit-content;
        }
        
        .main-image-container {
          position: relative;
          width: 100%;
          height: 600px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
        }
        
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          z-index: 10;
        }
        
        .image-nav-btn:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }
        
        .image-nav-btn.prev { left: 15px; }
        .image-nav-btn.next { right: 15px; }
        
        .image-indicator {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        
        .indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .indicator-dot.active {
          background: white;
          width: 30px;
          border-radius: 5px;
        }
        
        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
        }
        
        .thumbnail {
          width: 100%;
          height: 100px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }
        
        .thumbnail:hover {
          border-color: #c4d600;
          transform: translateY(-2px);
        }
        
        .thumbnail.active {
          border-color: #ff6b35;
        }
        
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Info Section */
        .detail-info-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .product-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          color: #2a2a2a;
          letter-spacing: 2px;
          line-height: 1.2;
        }
        
        .product-category {
          display: inline-block;
          background: rgba(196, 214, 0, 0.1);
          color: #c4d600;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }
        
        .rating-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .stars {
          display: flex;
          gap: 0.3rem;
        }
        
        .star {
          font-size: 1.5rem;
        }
        
        .star.filled {
          color: #ff6b35;
        }
        
        .star.half {
          color: #ff6b35;
          opacity: 0.5;
        }
        
        .star.empty {
          color: #ddd;
        }
        
        .rating-text {
          color: #666;
          font-size: 0.9rem;
        }
        
        .price-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .current-price {
          font-size: 3rem;
          font-weight: 700;
          color: #ff6b35;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
        }
        
        .original-price {
          font-size: 1.5rem;
          color: #999;
          text-decoration: line-through;
        }
        
        .discount-badge {
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1rem;
        }
        
        .stock-info {
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .stock-info.in-stock {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
        
        .stock-info.out-of-stock {
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
        }
        
        .description-section {
          padding: 2rem 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #2a2a2a;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }
        
        .description-text {
          color: #666;
          line-height: 1.8;
          font-size: 1rem;
        }
        
        .video-section {
          padding: 2rem 0;
        }
        
        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 16px;
          background: #000;
        }
        
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .quantity-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem 0;
        }
        
        .quantity-label {
          font-weight: 600;
          color: #2a2a2a;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .quantity-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: linear-gradient(135deg, #c4d600, #ff6b35);
          color: white;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 700;
        }
        
        .quantity-btn:hover {
          transform: scale(1.1);
        }
        
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .quantity-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2a2a2a;
          min-width: 40px;
          text-align: center;
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .add-to-cart-main {
          flex: 1;
          padding: 1.2rem 2rem;
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
        }
        
        .add-to-cart-main:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }
        
        .add-to-cart-main:disabled {
          background: #999;
          cursor: not-allowed;
        }
        
        .notification {
          position: fixed;
          top: 100px;
          right: 25px;
          background: linear-gradient(135deg, #c4d600, #ff6b35);
          color: #2a2a2a;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 700;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .product-detail-loading,
        .product-detail-error {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f6f0;
          gap: 1rem;
          font-family: 'Cairo', sans-serif;
        }
        
        .loading-spinner {
          font-size: 3rem;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .error-icon {
          font-size: 4rem;
        }
        
        .back-btn {
          margin-top: 1rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .detail-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .detail-images-section {
            position: relative;
            top: 0;
          }
          
          .main-image-container {
            height: 400px;
          }
        }
        
        @media (max-width: 768px) {
          .detail-navbar {
            padding: 1rem 1.5rem;
          }
          
          .detail-content {
            padding: 1.5rem;
          }
          
          .product-title {
            font-size: 2rem;
          }
          
          .current-price {
            font-size: 2rem;
          }
          
          .main-image-container {
            height: 300px;
          }
          
          .thumbnail-grid {
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          }
          
          .thumbnail {
            height: 70px;
          }
        }
      `}</style>

      {/* Navbar */}
      <div className="detail-navbar">
        <button className="back-button" onClick={() => navigate('/')}>
          <span>←</span>
          <span>العودة</span>
        </button>
        <div className="detail-breadcrumb">
          <span onClick={() => navigate('/')}>الرئيسية</span> / المنتجات / {product.name}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="notification">
          تم إضافة المنتج إلى السلة! 🎉
        </div>
      )}

      {/* Main Content */}
      <div className="detail-content">
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
                <button className="image-nav-btn prev" onClick={handlePrevImage}>
                  ❮
                </button>
                <button className="image-nav-btn next" onClick={handleNextImage}>
                  ❯
                </button>
                
                <div className="image-indicator">
                  {displayImages.map((_, index) => (
                    <div 
                      key={index}
                      className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
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
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={getImageUrl(img)} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="detail-info-section">
          <div>
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="rating-section">
            <div className="stars">
              {renderStars(product.rating || 0)}
            </div>
            <span className="rating-text">
              ({product.numReviews || 0} تقييم)
            </span>
          </div>

          {/* Price */}
          <div className="price-section">
            <div className="current-price">{product.price} دت</div>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <div className="original-price">{product.originalPrice} دت</div>
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? (
              <>
                <span>❌</span>
                <span>نفذت الكمية</span>
              </>
            ) : (
              <>
                <span>✅</span>
                <span>متوفر في المخزون ({product.stock} وحدة)</span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="description-section">
              <h2 className="section-title">الوصف</h2>
              <p className="description-text">{product.description}</p>
            </div>
          )}

          {/* Video */}
          {product.videoUrl && (
            <div className="video-section">
              <h2 className="section-title">فيديو المنتج</h2>
              <div className="video-container">
                <iframe
                  src={product.videoUrl}
                  title={product.name}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="quantity-section">
              <div className="quantity-label">الكمية:</div>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <div className="quantity-value">{quantity}</div>
                <button 
                  className="quantity-btn" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="action-buttons">
            <button 
              className="add-to-cart-main"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <span>{isOutOfStock ? 'غير متوفر' : 'أضف إلى السلة'}</span>
              <span>{isOutOfStock ? '✕' : '🛒'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}