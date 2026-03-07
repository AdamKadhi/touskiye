import React from "react";
import "../styles/UserInterface.css";

// SVG Icons
const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default function ThankYouPage({ orderData, onBackToHome }) {
  return (
    <div className="user-interface">
      <div dir="rtl">
        <div className="thankyou-container">
          <div className="thankyou-card">
            <div className="success-icon">
              <CheckCircleIcon />
            </div>

            <h1 className="thankyou-title">شكراً لك!</h1>
            <p className="thankyou-subtitle">
              تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الطلب وترتيب
              التوصيل.
            </p>

            <div className="estimated-delivery">
              <span className="estimated-delivery-icon">
                <TruckIcon />
              </span>
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
                <span className="contact-icon">
                  <UserIcon />
                </span>
                <span>{orderData?.formData?.fullName || "غير متوفر"}</span>
              </div>
              <div className="contact-row">
                <span className="contact-icon">
                  <PhoneIcon />
                </span>
                <span>{orderData?.formData?.phone || "غير متوفر"}</span>
              </div>
              <div className="contact-row">
                <span className="contact-icon">
                  <HomeIcon />
                </span>
                <span>{orderData?.formData?.city || "غير متوفر"}</span>
              </div>
              <div className="contact-row">
                <span className="contact-icon">
                  <MapPinIcon />
                </span>
                <span>{orderData?.formData?.address || "غير متوفر"}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={onBackToHome}>
                <ShoppingBagIcon />
                <span>العودة للمتجر</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}