import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI } from "../services/api";
import "../styles/UserInterface.css";

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
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
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
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>,
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="star half">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="star empty">
            ☆
          </span>,
        );
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
  // ✅ Video URL helper
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
        <button className="back-btn" onClick={() => navigate("/")}>
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  const displayImages =
    product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="user-interface">  {/* ✅ ADD THIS */}
    <div dir="rtl" className="product-detail-container">
      {/* Navbar */}
      <div className="detail-navbar">
        <button className="back-button" onClick={() => navigate("/")}>
          <span>←</span>
          <span>العودة</span>
        </button>
        <div className="detail-breadcrumb">
          <span onClick={() => navigate("/")}>الرئيسية</span> / المنتجات /{" "}
          {product.name}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="notification">تم إضافة المنتج إلى السلة! 🎉</div>
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
          <div>
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="rating-section">
            <div className="stars">{renderStars(product.rating || 0)}</div>
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
          <div
            className={`stock-info ${isOutOfStock ? "out-of-stock" : "in-stock"}`}
          >
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
          {/* Video Player Section */}
          {(product.videoFile || product.videoUrl) && (
            <div className="video-player-section">
              <h2 className="section-title">فيديو المنتج</h2>
              {product.videoFile ? (
                <div>
                  <div className="video-player-container">
                    <video
                      className="video-player"
                      controls
                      controlsList="nodownload"
                      preload="metadata"
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
                  <a
                    href={getVideoUrl(product.videoFile)}
                    download
                    className="video-download-btn"
                  >
                    <span>📥</span>
                    <span>تحميل الفيديو</span>
                  </a>
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

          {/* Video */}
          {/* {product.videoUrl && (
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
          )} */}

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
              <span>{isOutOfStock ? "غير متوفر" : "أضف إلى السلة"}</span>
              <span>{isOutOfStock ? "✕" : "🛒"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
