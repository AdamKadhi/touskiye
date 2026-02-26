import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

export default function HomePage({ onAddToCart, onOpenCheckout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getPublic();
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddToCart = (product) => {
    onAddToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: getImageUrl(product.image),
      quantity: 1
    });
    setShowModal(false);
  };

  const handleImageClick = (imagePath) => {
    setZoomedImage(getImageUrl(imagePath));
  };

  const isOutOfStock = (product) => {
    return product.stock === 0 || product.status === 'Out of Stock';
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .home-container { background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%); min-height: 100vh; padding: 2rem 0; }
        
        .products-section { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
        
        .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: #2a2a2a; text-align: center; letter-spacing: 3px; margin-bottom: 0.5rem; }
        
        .section-subtitle { text-align: center; color: #666; font-size: 1rem; margin-bottom: 3rem; }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
        
        .product-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer; position: relative; }
        
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        
        .product-card.out-of-stock { opacity: 0.85; }
        
        .product-image-container { width: 100%; height: 300px; overflow: hidden; background: #f8f6f0; position: relative; }
        
        .product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        
        .product-card:hover .product-image { transform: scale(1.1); }
        
        .discount-badge { position: absolute; top: 1rem; right: 1rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 0.5rem 1rem; border-radius: 30px; font-weight: 700; font-size: 0.9rem; z-index: 1; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); }
        
        .out-of-stock-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; }
        
        .out-of-stock-text { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 0.8rem 1.5rem; border-radius: 30px; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); }
        
        .coming-soon-text { color: #f4edd8; font-size: 0.9rem; font-weight: 600; }
        
        .product-info { padding: 1.5rem; }
        
        .product-name { font-weight: 700; font-size: 1.3rem; color: #2a2a2a; margin-bottom: 0.5rem; }
        
        .product-price-row { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
        
        .product-price { font-weight: 700; font-size: 1.8rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .product-old-price { color: #999; text-decoration: line-through; font-size: 1.2rem; }
        
        .product-savings { color: #ff6b35; font-size: 0.9rem; font-weight: 600; margin-top: 0.5rem; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; padding: 2rem; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-content { background: white; border-radius: 30px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; position: relative; }
        
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .modal-close { position: absolute; top: 1.5rem; left: 1.5rem; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.1); border: none; border-radius: 50%; font-size: 1.8rem; cursor: pointer; z-index: 10; transition: all 0.3s ease; color: #2a2a2a; }
        
        .modal-close:hover { background: #ff6b35; color: white; transform: rotate(90deg); }
        
        .modal-image { width: 100%; height: 400px; object-fit: cover; border-radius: 30px 30px 0 0; cursor: zoom-in; }
        
        .modal-body { padding: 2rem; }
        
        .modal-product-name { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: #2a2a2a; letter-spacing: 2px; margin-bottom: 1rem; }
        
        .modal-price-section { display: flex; align-items: center; gap: 1.5rem; margin: 1.5rem 0; padding: 1.5rem; background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%); border-radius: 20px; }
        
        .modal-price { font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, #ff6b35, #e85d2a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .modal-old-price { font-size: 1.5rem; color: #999; text-decoration: line-through; }
        
        .modal-discount-badge { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; font-size: 1rem; }
        
        .modal-savings { color: #ff6b35; font-weight: 700; font-size: 1.1rem; margin-top: 0.5rem; }
        
        .modal-description { color: #666; line-height: 1.8; margin: 1.5rem 0; font-size: 1.05rem; }
        
        .stock-info { display: flex; align-items: center; gap: 0.8rem; padding: 1rem; background: rgba(196, 214, 0, 0.1); border-radius: 15px; margin: 1.5rem 0; }
        
        .stock-info.out { background: rgba(255, 107, 53, 0.1); }
        
        .stock-icon { font-size: 1.5rem; }
        
        .stock-text { font-weight: 600; color: #2a2a2a; }
        
        .stock-count { font-weight: 700; color: #c4d600; }
        
        .stock-count.out { color: #ff6b35; }
        
        .coming-soon-badge { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 1rem 1.5rem; border-radius: 15px; text-align: center; font-weight: 700; font-size: 1.1rem; margin: 1.5rem 0; }
        
        .add-to-cart-btn { width: 100%; padding: 1.2rem; background: linear-gradient(135deg, #c4d600, #ff6b35); color: #2a2a2a; border: none; border-radius: 50px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 2px; }
        
        .add-to-cart-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(196, 214, 0, 0.6); }
        
        .add-to-cart-btn:disabled { background: #ccc; color: #666; cursor: not-allowed; transform: none; }
        
        .add-to-cart-btn:disabled:hover { box-shadow: none; }
        
        .zoom-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.95); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 2rem; }
        
        .zoom-image { max-width: 90%; max-height: 90vh; object-fit: contain; border-radius: 15px; }
        
        .zoom-close { position: absolute; top: 2rem; right: 2rem; width: 50px; height: 50px; background: white; border: none; border-radius: 50%; font-size: 2rem; cursor: pointer; }
        
        .loading-state { text-align: center; padding: 4rem; color: #999; }
        
        .loading-spinner { font-size: 3rem; margin-bottom: 1rem; animation: spin 1s linear infinite; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .products-section { padding: 0 1rem; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
          .modal-content { margin: 1rem; }
          .modal-image { height: 300px; }
        }
      `}</style>

      <div className="home-container">
        <div className="products-section">
          <h2 className="section-title">منتجاتنا المميزة</h2>
          <p className="section-subtitle">اكتشف أفضل المنتجات بأسعار لا تُقاوم</p>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">⏳</div>
              <div>جاري التحميل...</div>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const outOfStock = isOutOfStock(product);
                return (
                  <div 
                    key={product._id} 
                    className={`product-card ${outOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-image-container">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="product-image"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                      />
                      {outOfStock && (
                        <div className="out-of-stock-overlay">
                          <div className="out-of-stock-text">نفذت الكمية</div>
                          <div className="coming-soon-text">🔄 سيعود قريباً</div>
                        </div>
                      )}
                      {!outOfStock && product.discount > 0 && (
                        <div className="discount-badge">-{product.discount}%</div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price-row">
                        <span className="product-price">{product.price} دينار</span>
                        {product.originalPrice > product.price && (
                          <span className="product-old-price">{product.originalPrice} دينار</span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <div className="product-savings">
                          وفر {(product.originalPrice - product.price).toFixed(2)} دينار
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <img 
              src={getImageUrl(selectedProduct.image)} 
              alt={selectedProduct.name} 
              className="modal-image"
              onClick={() => handleImageClick(selectedProduct.image)}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
            />

            <div className="modal-body">
              <h3 className="modal-product-name">{selectedProduct.name}</h3>

              <div className="modal-price-section">
                <div className="modal-price">{selectedProduct.price} دينار</div>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <>
                    <div className="modal-old-price">{selectedProduct.originalPrice} دينار</div>
                    <div className="modal-discount-badge">-{selectedProduct.discount}%</div>
                  </>
                )}
              </div>

              {selectedProduct.discount > 0 && (
                <div className="modal-savings">
                  ✨ توفر {(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)} دينار
                </div>
              )}

              {selectedProduct.description && (
                <div className="modal-description">{selectedProduct.description}</div>
              )}

              {isOutOfStock(selectedProduct) ? (
                <>
                  <div className="stock-info out">
                    <span className="stock-icon">📦</span>
                    <span className="stock-text">الحالة:</span>
                    <span className="stock-count out">نفذت الكمية</span>
                  </div>
                  <div className="coming-soon-badge">
                    🔄 المنتج سيعود قريباً - نعمل على توفيره
                  </div>
                  <button className="add-to-cart-btn" disabled>
                    غير متوفر حالياً
                  </button>
                </>
              ) : (
                <>
                  <div className="stock-info">
                    <span className="stock-icon">✅</span>
                    <span className="stock-text">متوفر في المخزون:</span>
                    <span className="stock-count">{selectedProduct.stock} قطعة</span>
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    أضف إلى السلة 🛒
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="zoom-modal" onClick={() => setZoomedImage(null)}>
          <button className="zoom-close" onClick={() => setZoomedImage(null)}>×</button>
          <img src={zoomedImage} alt="Zoomed" className="zoom-image" />
        </div>
      )}
    </div>
  );
}