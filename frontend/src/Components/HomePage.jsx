import React, { useState, useEffect  } from 'react';
import { productsAPI } from '../services/api';

export default function HomePage({ cartItems, cartCount, addToCart, goToCheckout }) {
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
      image: product.image
    });
    setLastAddedProduct({ 
      name: product.name, 
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image 
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
    showNotification('تم إضافة المنتج بنجاح!');
  };

  const proceedToCheckout = () => {
    closeCartModal();
    goToCheckout();
  };
  
  const handleCart = () => {
    if (cartCount === 0) {
      showNotification('سلة التسوق فارغة!');
    } else {
      goToCheckout();
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 3));
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
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setHasDragged(true);
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
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
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // ✅ NEW: Check if product is out of stock
  const isOutOfStock = (product) => {
    return product.stock === 0 || product.status === 'Out of Stock';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#f4edd8',
        fontSize: '1.5rem',
        fontFamily: "'Cairo', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <div>جاري تحميل المنتجات...</div>
        </div>
      </div>
    );
  }

  return (
    
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #f8f6f0;
          overflow-x: hidden;
        }

        .navbar {
          background: #2a2a2a;
          padding: 1.2rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-image {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

        .cart-container {
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .cart-container:hover {
          transform: translateY(-3px);
        }

        .cart-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          position: relative;
        }

        .cart-icon svg {
          width: 22px;
          height: 22px;
          fill: white;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          left: -8px;
          background: #c4d600;
          color: #2a2a2a;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          border: 2px solid #2a2a2a;
          transition: transform 0.2s ease;
        }

        .cart-badge.animate {
          animation: badgePop 0.3s ease;
        }

        @keyframes badgePop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .hero {
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          padding: 3rem 3rem 4.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(196, 214, 0, 0.1), transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 107, 53, 0.1), transparent 50%);
          animation: gradientShift 8s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem;
          color: #f4edd8;
          letter-spacing: 4px;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          color: #c4d600;
          font-size: 1rem;
          font-weight: 500;
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .products-section {
          padding: 4rem 3rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          color: #2a2a2a;
          text-align: center;
          margin-bottom: 2.5rem;
          letter-spacing: 3px;
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #ff6b35, #c4d600);
          border-radius: 2px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #ff6b35, #c4d600);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .product-card:hover::before {
          opacity: 0.03;
        }

        .product-image-container {
          position: relative;
          height: 300px;
          background: #f4edd8;
          overflow: hidden;
          cursor: pointer;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover .product-image {
          transform: scale(1.08);
        }

        .product-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #c4d600;
          color: #2a2a2a;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(196, 214, 0, 0.3);
        }

        .discount-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .product-info {
          padding: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .product-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          color: #2a2a2a;
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
        }

        .product-description {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 1.2rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.2rem;
        }

        .product-price-section {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .product-old-price {
          font-size: 1rem;
          color: #999;
          text-decoration: line-through;
          font-weight: 500;
        }

        .product-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ff6b35;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
        }

        .product-price span {
          font-size: 1rem;
          color: #999;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
          background: linear-gradient(135deg, #e85d2a, #ff6b35);
        }

        .add-to-cart-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        /* ✅ NEW: Out of Stock Styles */
        .product-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
          border-radius: 20px 20px 0 0;
        }

        .out-of-stock-badge {
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.8rem;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
          letter-spacing: 1px;
        }

        .coming-soon-message {
          color: #c4d600;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .product-card.out-of-stock {
          opacity: 0.85;
        }

        .product-card.out-of-stock .product-image {
          filter: grayscale(0.3);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #999;
        }

        .add-to-cart-btn:disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .footer {
          background: #2a2a2a;
          color: #f4edd8;
          padding: 3rem 3rem 1.5rem;
          margin-top: 5rem;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 2.5rem;
        }

        .footer-logo-section {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .footer-logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #c4d600, #ff6b35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .footer-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          letter-spacing: 2px;
        }

        .footer-tagline {
          color: #999;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .footer-section h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          color: #c4d600;
          margin-bottom: 1.2rem;
          letter-spacing: 2px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #ccc;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .contact-item:hover {
          color: #c4d600;
        }

        .contact-icon {
          font-size: 1.1rem;
        }

        .social-media {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #f4edd8;
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          padding: 0.4rem;
          border-radius: 8px;
        }

        .social-link:hover {
          color: #c4d600;
          background: rgba(196, 214, 0, 0.1);
          transform: translateX(-5px);
        }

        .social-icon {
          font-size: 1.3rem;
        }

        .footer-bottom {
          border-top: 1px solid rgba(244, 237, 216, 0.1);
          padding-top: 1.5rem;
          text-align: center;
          color: #999;
          font-size: 0.85rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .image-modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          animation: slideUpModal 0.3s ease;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        @keyframes slideUpModal {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .modal-close:hover {
          background: white;
          transform: rotate(90deg) scale(1.1);
        }

        .modal-image-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 90vw;
          max-height: 90vh;
          overflow: hidden;
          border-radius: 12px;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.1s ease-out;
          border-radius: 12px;
          cursor: zoom-in;
        }

        .modal-image.zoomed {
          cursor: zoom-out;
        }

        .zoom-controls {
          position: absolute;
          bottom: 15px;
          right: 15px;
          display: flex;
          gap: 10px;
          z-index: 20;
        }

        .zoom-btn {
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-weight: bold;
        }

        .zoom-btn:hover {
          background: white;
          transform: scale(1.15);
        }

        .zoom-btn:active {
          transform: scale(0.95);
        }

        /* Cart Confirmation Modal */
        .cart-modal-content {
          background: white;
          border-radius: 24px;
          max-width: 450px;
          width: 90%;
          overflow: hidden;
          position: relative;
          animation: slideUpModal 0.3s ease;
        }

        .cart-modal-header {
          background: linear-gradient(135deg, #c4d600, #ff6b35);
          padding: 2rem;
          text-align: center;
          position: relative;
        }

        .cart-modal-icon {
          width: 65px;
          height: 65px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.8rem;
          font-size: 2rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          animation: checkmarkPop 0.5s ease 0.2s backwards;
        }

        @keyframes checkmarkPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .cart-modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          color: white;
          letter-spacing: 2px;
          margin: 0;
        }

        .cart-modal-body {
          padding: 2rem;
        }

        .added-product-showcase {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%);
          border-radius: 18px;
          padding: 1.5rem;
          margin-bottom: 1.8rem;
          border: 2px solid #f4edd8;
          position: relative;
          overflow: hidden;
        }

        .added-product-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #c4d600, #ff6b35);
        }

        .product-image-preview {
          width: 90px;
          height: 90px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          position: relative;
        }

        .product-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: imageZoomIn 0.4s ease 0.3s backwards;
        }

        @keyframes imageZoomIn {
          from {
            transform: scale(0.7);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .product-image-preview::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(196, 214, 0, 0.1), rgba(255, 107, 53, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .added-product-showcase:hover .product-image-preview::after {
          opacity: 1;
        }

        .added-product-details {
          flex: 1;
        }

        .added-product-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #2a2a2a;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .added-product-price {
          font-size: 1.5rem;
          color: #ff6b35;
          font-weight: 700;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
        }

        .added-product-price-label {
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.3rem;
        }

        .cart-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .cart-action-btn {
          border: none;
          padding: 1rem 1.8rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
        }

        .cart-action-btn.primary {
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .cart-action-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        .cart-action-btn.secondary {
          background: white;
          color: #2a2a2a;
          border: 2px solid #e0e0e0;
        }

        .cart-action-btn.secondary:hover {
          background: #f8f6f0;
          border-color: #c4d600;
          transform: translateY(-2px);
        }

        .cart-action-btn:active {
          transform: translateY(0);
        }

        .notification {
          position: fixed;
          top: 90px;
          left: 25px;
          background: linear-gradient(135deg, #c4d600, #ff6b35);
          color: #2a2a2a;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: slideInLeft 0.3s ease-out;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .navbar {
            padding: 1.2rem 2rem;
          }

          .products-section {
            padding: 3.5rem 2rem;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .hero h1 {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 768px) {
          .logo-image {
            height: 45px;
          }

          .cart-icon {
            width: 40px;
            height: 40px;
          }

          .cart-icon svg {
            width: 20px;
            height: 20px;
          }

          .cart-badge {
            width: 20px;
            height: 20px;
            font-size: 0.65rem;
          }

          .hero {
            padding: 2.5rem 2rem 3.5rem;
          }

          .hero h1 {
            font-size: 2.2rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .product-image-container {
            height: 250px;
          }

          .footer {
            padding: 2.5rem 2rem 1.5rem;
          }

          .cart-modal-content {
            max-width: 95%;
          }

          .added-product-showcase {
            flex-direction: column;
            text-align: center;
          }

          .product-image-preview {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

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
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className={`cart-badge ${cartCount > 0 ? 'animate' : ''}`}>
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
            <div key={product._id || product.id} className={`product-card ${isOutOfStock(product) ? 'out-of-stock' : ''}`}>
              <div 
                className="product-image-container"
                onClick={() => openImageModal(product)}
              >
                <img 
                  src={product.image} 
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
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <div className="product-price-section">
                    {product.originalPrice && product.originalPrice > product.price && (
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
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock(product)}
                  >
                    <span>{isOutOfStock(product) ? 'غير متوفر' : 'أضف للسلة'}</span>
                    <span>{isOutOfStock(product) ? '✕' : '+'}</span>
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
          <p>&copy; 2026 TOUSKIYE TN. جميع الحقوق محفوظة. صنع بـ ❤️ في تونس</p>
        </div>
      </footer>

      {/* Image Modal */}
      {showImageModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>×</button>
            
            <div 
              className="modal-image-container"
              onWheel={handleWheel}
            >
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className={`modal-image ${zoomLevel > 1 ? 'zoomed' : ''}`}
                style={{ 
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center center'
                }}
                draggable="false"
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <div className="zoom-controls">
                <button className="zoom-btn" onClick={zoomOut}>−</button>
                <button className="zoom-btn" onClick={zoomIn}>+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Confirmation Modal */}
      {showCartModal && lastAddedProduct && (
        <div className="modal-overlay" onClick={closeCartModal}>
          <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <div className="cart-modal-icon">✓</div>
              <h2 className="cart-modal-title">تمت الإضافة بنجاح!</h2>
            </div>

            <div className="cart-modal-body">
              <div className="added-product-showcase">
                <div className="product-image-preview">
                  <img src={lastAddedProduct.image} alt={lastAddedProduct.name} />
                </div>
                <div className="added-product-details">
                  <div className="added-product-name">{lastAddedProduct.name}</div>
                  <div className="added-product-price-label">السعر</div>
                  {lastAddedProduct.originalPrice && (
                    <div className="product-old-price" style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {lastAddedProduct.originalPrice} دينار
                    </div>
                  )}
                  <div className="added-product-price">
                    {lastAddedProduct.price} دينار
                    {lastAddedProduct.discount && (
                      <span style={{ 
                        fontSize: '0.9rem', 
                        marginRight: '0.5rem',
                        background: 'linear-gradient(135deg, #ff6b35, #e85d2a)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        color: 'white'
                      }}>
                        -{lastAddedProduct.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="cart-modal-actions">
                <button className="cart-action-btn primary" onClick={proceedToCheckout}>
                  <span>إتمام عملية الشراء</span>
                  <span>💳</span>
                </button>
                <button className="cart-action-btn secondary" onClick={continueShopping}>
                  <span>متابعة التسوق</span>
                  <span>🛍️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}