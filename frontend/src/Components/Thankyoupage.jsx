import React from 'react';

export default function ThankYouPage({ orderData, onBackToHome }) {
  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .thankyou-container { min-height: 100vh; background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%); display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .thankyou-card { background: white; border-radius: 24px; padding: 3rem; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.15); text-align: center; animation: slideUp 0.5s ease; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        
        .success-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #c4d600, #ff6b35); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 3.5rem; animation: popIn 0.6s ease 0.3s backwards; box-shadow: 0 10px 30px rgba(196, 214, 0, 0.3); }
        
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
        
        .thankyou-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: #2a2a2a; letter-spacing: 2px; margin-bottom: 1rem; animation: fadeIn 0.5s ease 0.5s backwards; }
        
        .thankyou-subtitle { color: #666; font-size: 1.1rem; margin-bottom: 2.5rem; line-height: 1.8; animation: fadeIn 0.5s ease 0.6s backwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .order-summary { background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%); border-radius: 18px; padding: 2rem; margin-bottom: 2rem; border: 2px solid #f4edd8; text-align: right; animation: fadeIn 0.5s ease 0.7s backwards; }
        
        .order-summary h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #2a2a2a; letter-spacing: 1.5px; margin-bottom: 1.5rem; text-align: center; }
        
        .order-row { display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid #e0e0e0; }
        
        .order-row:last-child { border-bottom: none; padding-top: 1rem; margin-top: 0.5rem; border-top: 2px solid #e0e0e0; }
        
        .order-label { color: #666; font-size: 0.95rem; }
        
        .order-value { color: #2a2a2a; font-weight: 700; font-size: 0.95rem; }
        
        .order-total { font-size: 1.3rem !important; color: #ff6b35 !important; font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; }
        
        .order-items { margin-top: 1.5rem; }
        
        .order-item { display: flex; justify-content: space-between; padding: 0.6rem 0; font-size: 0.9rem; color: #666; }
        
        .item-name { flex: 1; }
        
        .item-quantity { color: #999; margin: 0 1rem; }
        
        .item-price { color: #ff6b35; font-weight: 600; }
        
        .contact-info { background: linear-gradient(135deg, rgba(196, 214, 0, 0.1), rgba(255, 107, 53, 0.1)); border-radius: 18px; padding: 1.5rem; margin-bottom: 2rem; animation: fadeIn 0.5s ease 0.8s backwards; }
        
        .contact-info h4 { font-size: 1.1rem; color: #2a2a2a; margin-bottom: 1rem; font-weight: 700; }
        
        .contact-row { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem 0; color: #666; font-size: 0.9rem; }
        
        .contact-icon { font-size: 1.2rem; }
        
        .action-buttons { display: flex; gap: 1rem; animation: fadeIn 0.5s ease 0.9s backwards; }
        
        .btn { flex: 1; border: none; padding: 1rem; border-radius: 50px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; font-family: 'Cairo', sans-serif; }
        
        .btn-primary { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3); }
        
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .btn-secondary { background: white; color: #2a2a2a; border: 2px solid #e0e0e0; }
        
        .btn-secondary:hover { background: #f8f6f0; border-color: #c4d600; transform: translateY(-2px); }
        
        .divider { height: 1px; background: linear-gradient(90deg, transparent, #e0e0e0, transparent); margin: 2rem 0; }
        
        .estimated-delivery { background: white; border: 2px solid #c4d600; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.8rem; animation: fadeIn 0.5s ease 0.75s backwards; }
        
        .estimated-delivery-icon { font-size: 1.5rem; }
        
        .estimated-delivery-text { color: #2a2a2a; font-weight: 600; }
        
        @media (max-width: 768px) { 
          .thankyou-card { padding: 2rem; }
          .thankyou-title { font-size: 2rem; }
          .success-icon { width: 80px; height: 80px; font-size: 2.5rem; }
          .action-buttons { flex-direction: column; }
        }
      `}</style>

      <div className="thankyou-container">
        <div className="thankyou-card">
          <div className="success-icon">✓</div>
          
          <h1 className="thankyou-title">شكراً لك!</h1>
          <p className="thankyou-subtitle">
            تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الطلب وترتيب التوصيل.
          </p>

          <div className="estimated-delivery">
            <span className="estimated-delivery-icon">🚚</span>
            <span className="estimated-delivery-text">التوصيل المتوقع: 2-3 أيام عمل</span>
          </div>

          <div className="order-summary">
            <h3>ملخص الطلب</h3>
            
            {orderData?.cartItems && orderData.cartItems.length > 0 && (
              <div className="order-items">
                {orderData.cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">× {item.quantity || 1}</span>
                    <span className="item-price">{item.price * (item.quantity || 1)} دت</span>
                  </div>
                ))}
              </div>
            )}

            <div className="divider" />

            <div className="order-row">
              <span className="order-label">المجموع الفرعي:</span>
              <span className="order-value">{orderData?.subtotal || 0} دينار</span>
            </div>
            
            <div className="order-row">
              <span className="order-label">رسوم التوصيل:</span>
              <span className="order-value">{orderData?.deliveryFee || 7} دينار</span>
            </div>
            
            <div className="order-row">
              <span className="order-label">المجموع الكلي:</span>
              <span className="order-value order-total">{orderData?.total || 0} دينار</span>
            </div>
          </div>

          <div className="contact-info">
            <h4>معلومات التوصيل</h4>
            <div className="contact-row">
              <span className="contact-icon">👤</span>
              <span>{orderData?.formData?.fullName || 'غير متوفر'}</span>
            </div>
            <div className="contact-row">
              <span className="contact-icon">📱</span>
              <span>{orderData?.formData?.phone || 'غير متوفر'}</span>
            </div>
            <div className="contact-row">
              <span className="contact-icon">🏙️</span>
              <span>{orderData?.formData?.city || 'غير متوفر'}</span>
            </div>
            <div className="contact-row">
              <span className="contact-icon">📮</span>
              <span>{orderData?.formData?.address || 'غير متوفر'}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={onBackToHome}>
              العودة للمتجر 🛍️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}