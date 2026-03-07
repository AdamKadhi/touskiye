import React, { useState } from "react";
import { ordersAPI } from "../services/api";
import "../styles/UserInterface.css";

// SVG Icons
const ShoppingBagIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const DollarSignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
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

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default function CheckoutCart({
  cartItems = [],
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onOrderComplete,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const tunisianCities = [
    "تونس",
    "أريانة",
    "بن عروس",
    "منوبة",
    "نابل",
    "زغوان",
    "بنزرت",
    "باجة",
    "جندوبة",
    "الكاف",
    "سليانة",
    "القيروان",
    "القصرين",
    "سوسة",
    "المنستير",
    "المهدية",
    "صفاقس",
    "قابس",
    "مدنين",
    "تطاوين",
    "قفصة",
    "توزر",
    "قبلي",
    "سيدي بوزيد",
  ];

  const deliveryFee = 7;
  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0,
      )
    : 0;
  const total = subtotal + deliveryFee;

  const handleRemoveItem = (index) => {
    if (onRemoveItem) {
      onRemoveItem(index);
    }
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    if (onUpdateQuantity) {
      onUpdateQuantity(index, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "الرجاء إدخال الاسم الكامل";
    if (!formData.phone.trim()) {
      newErrors.phone = "الرجاء إدخال رقم الهاتف";
    } else if (!/^[0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "رقم الهاتف يجب أن يكون 8 أرقام";
    }
    if (!formData.city) newErrors.city = "الرجاء اختيار المدينة";
    if (!formData.address.trim()) newErrors.address = "الرجاء إدخال العنوان";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const cityMapping = {
        تونس: "Tunis",
        أريانة: "Ariana",
        "بن عروس": "Ben Arous",
        منوبة: "Manouba",
        نابل: "Nabeul",
        زغوان: "Zaghouan",
        بنزرت: "Bizerte",
        باجة: "Beja",
        جندوبة: "Jendouba",
        الكاف: "Kef",
        سليانة: "Siliana",
        القيروان: "Kairouan",
        القصرين: "Kasserine",
        سوسة: "Sousse",
        المنستير: "Monastir",
        المهدية: "Mahdia",
        صفاقس: "Sfax",
        قابس: "Gabes",
        مدنين: "Medenine",
        تطاوين: "Tataouine",
        قفصة: "Gafsa",
        توزر: "Tozeur",
        قبلي: "Kebili",
        "سيدي بوزيد": "Sidi Bouzid",
      };

      const orderData = {
        customerName: formData.fullName,
        phone: formData.phone,
        items: cartItems.map(item => ({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          originalPrice: item.originalPrice,
          discount: item.discount
        })),
        city: cityMapping[formData.city] || formData.city,
        address: formData.address,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
      };

      console.log("📤 Sending order data:", orderData);

      const response = await ordersAPI.create(orderData);

      console.log("✅ Order created:", response.data);

      const completeOrderData = {
        orderId: response.data.data._id,
        formData: {
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
        },
        cartItems: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
      };

      console.log("📦 Sending to Thank You page:", completeOrderData);

      if (onOrderComplete) {
        onOrderComplete(completeOrderData);
      }
    } catch (error) {
      console.error("❌ Full error:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error data:", error.response?.data);
      alert("حدث خطأ في إنشاء الطلب. يرجى المحاولة مرة أخرى.");
    }
  };
const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400';
    return imagePath.startsWith('/uploads')
      ? `http://localhost:5000${imagePath}`
      : imagePath;
  };
  return (
    <div className="user-interface">
      <div dir="rtl">
        <div className="checkout-container">
          <div className="checkout-header">
            <div className="header-content">
              <div className="header-info">
                <div className="header-icon">
                  <ShoppingBagIcon />
                </div>
                <div className="header-text">
                  <h1>إتمام الطلب</h1>
                  <p>خطوة واحدة تفصلك عن منتجاتك المفضلة</p>
                </div>
              </div>
              <button className="back-btn" onClick={onClose}>
                <ArrowLeftIcon />
                <span>العودة للمتجر</span>
              </button>
            </div>
          </div>

          <div className="checkout-content">
            <div className="section-card">
              <div className="section-header">
                <div className="section-icon">
                  <PackageIcon />
                </div>
                <h2 className="section-title">منتجاتك</h2>
              </div>
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                <div className="cart-items-grid">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-left">
                        <div className="item-image">
                          <img
                            src={getImageUrl(item.image) || "https://via.placeholder.com/60"}
                            alt={item.name}
                          />
                        </div>
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          {(item.originalPrice || item.discount) && (
                            <div className="item-price-info">
                              {item.originalPrice && (
                                <span className="item-old-price">
                                  {item.originalPrice} دينار
                                </span>
                              )}
                              {item.discount && (
                                <span className="item-discount-badge">
                                  -{item.discount}%
                                </span>
                              )}
                            </div>
                          )}
                          <div className="item-quantity-control">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleUpdateQuantity(
                                  index,
                                  (item.quantity || 1) - 1,
                                )
                              }
                            >
                              <MinusIcon />
                            </button>
                            <span className="quantity-display">
                              {item.quantity || 1}
                            </span>
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleUpdateQuantity(
                                  index,
                                  (item.quantity || 1) + 1,
                                )
                              }
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="item-price-section">
                        <div className="item-price">
                          {item.price * (item.quantity || 1)} <span>دينار</span>
                        </div>
                        {item.discount && item.originalPrice && (
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "#ff6b35",
                              fontWeight: "600",
                              marginTop: "0.2rem",
                            }}
                          >
                            وفرت{" "}
                            {(item.originalPrice - item.price) *
                              (item.quantity || 1)}{" "}
                            دت
                          </div>
                        )}
                        <button
                          className="delete-btn"
                          onClick={() => handleRemoveItem(index)}
                          title="حذف"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-cart">
                  <div className="empty-cart-icon">
                    <PackageIcon />
                  </div>
                  <p>سلة التسوق فارغة</p>
                </div>
              )}
            </div>

            <div className="section-card">
              <div className="section-header">
                <div className="section-icon">
                  <MapPinIcon />
                </div>
                <h2 className="section-title">معلومات التوصيل</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span>
                    <span>الاسم الكامل</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon"><UserIcon /></span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.fullName ? "error" : ""}`}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  {errors.fullName && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span>
                    <span>رقم الهاتف</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon"><PhoneIcon /></span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phone ? "error" : ""}`}
                      placeholder="12345678"
                      maxLength="8"
                    />
                  </div>
                  {errors.phone && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span>
                    <span>المدينة</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon"><HomeIcon /></span>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-select ${errors.city ? "error" : ""}`}
                    >
                      <option value="">اختر المدينة</option>
                      {tunisianCities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.city && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{errors.city}</span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span>
                    <span>العنوان الكامل</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon" style={{ top: "1.2rem" }}>
                      <MapPinIcon />
                    </span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`form-textarea ${errors.address ? "error" : ""}`}
                      placeholder="الشارع، رقم المنزل، تفاصيل إضافية..."
                    />
                  </div>
                  {errors.address && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div>
              <div className="summary-card">
                <div className="summary-header">
                  <div className="section-icon">
                    <DollarSignIcon />
                  </div>
                  <h3 className="summary-header-text">ملخص الطلب</h3>
                </div>
                <div className="summary-row">
                  <span className="summary-label">
                    <PackageIcon />
                    <span>المجموع الفرعي</span>
                  </span>
                  <span className="summary-value">{subtotal} دينار</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">
                    <TruckIcon />
                    <span>رسوم التوصيل</span>
                  </span>
                  <span className="summary-value">{deliveryFee} دينار</span>
                </div>
                <div className="summary-total">
                  <span className="total-label">المجموع الكلي</span>
                  <span className="total-value">{total} دينار</span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={handleSubmit}
                  disabled={!Array.isArray(cartItems) || cartItems.length === 0}
                >
                  تأكيد الطلب الآن ✓
                </button>
                <div className="secure-payment">
                  <LockIcon />
                  <span>دفع آمن ومضمون 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}