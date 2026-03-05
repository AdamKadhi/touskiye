import React from "react";
import "../styles/UserInterface.css";

export default function ThankYouPage({ orderData, onBackToHome }) {
  return (
    <div className="user-interface">
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="thankyou-container">
        <div className="thankyou-card">
          <div className="success-icon">✓</div>

          <h1 className="thankyou-title">شكراً لك!</h1>
          <p className="thankyou-subtitle">
            تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الطلب وترتيب
            التوصيل.
          </p>

          <div className="estimated-delivery">
            <span className="estimated-delivery-icon">🚚</span>
            <span className="estimated-delivery-text">
              التوصيل المتوقع: 2-3 أيام عمل
            </span>
          </div>

          <div className="order-summary">
            <h3>ملخص الطلب</h3>

            {orderData?.cartItems && orderData.cartItems.length > 0 && (
              <div className="order-items">
                {orderData.cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">
                      × {item.quantity || 1}
                    </span>
                    <span className="item-price">
                      {item.price * (item.quantity || 1)} دت
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="divider" />

            <div className="order-row">
              <span className="order-label">المجموع الفرعي:</span>
              <span className="order-value">
                {orderData?.subtotal || 0} دينار
              </span>
            </div>

            <div className="order-row">
              <span className="order-label">رسوم التوصيل:</span>
              <span className="order-value">
                {orderData?.deliveryFee || 7} دينار
              </span>
            </div>

            <div className="order-row">
              <span className="order-label">المجموع الكلي:</span>
              <span className="order-value order-total">
                {orderData?.total || 0} دينار
              </span>
            </div>
          </div>

          <div className="contact-info">
            <h4>معلومات التوصيل</h4>
            <div className="contact-row">
              <span className="contact-icon">👤</span>
              <span>{orderData?.formData?.fullName || "غير متوفر"}</span>
            </div>
            <div className="contact-row">
              <span className="contact-icon">📱</span>
              <span>{orderData?.formData?.phone || "غير متوفر"}</span>
            </div>
            <div className="contact-row">
              <span className="contact-icon">🏙️</span>
              <span>{orderData?.formData?.city || "غير متوفر"}</span>
            </div>
            <div className="contact-row">
              <span className="contact-icon">📮</span>
              <span>{orderData?.formData?.address || "غير متوفر"}</span>
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
    </div>
  );
}
