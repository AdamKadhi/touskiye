import React, { useState } from "react";
import { ordersAPI } from "../services/api";
import "../styles/UserInterface.css";

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
      // Map Arabic city names to English for backend
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

      // ✅ FIXED: Send items as array, not concatenated string
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

  return (
    <div className="user-interface">
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="checkout-container">
        <div className="checkout-header">
          <div className="header-content">
            <div className="header-info">
              <div className="header-icon">🛒</div>
              <div className="header-text">
                <h1>إتمام الطلب</h1>
                <p>خطوة واحدة تفصلك عن منتجاتك المفضلة</p>
              </div>
            </div>
            <button className="back-btn" onClick={onClose}>
              <span>←</span>
              <span>العودة للمتجر</span>
            </button>
          </div>
        </div>

        <div className="checkout-content">
          <div className="section-card">
            <div className="section-header">
              <div className="section-icon">🛍️</div>
              <h2 className="section-title">منتجاتك</h2>
            </div>
            {Array.isArray(cartItems) && cartItems.length > 0 ? (
              <div className="cart-items-grid">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-left">
                      <div className="item-image">
                        <img
                          src={item.image || "https://via.placeholder.com/60"}
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
                            −
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
                            +
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
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>سلة التسوق فارغة</p>
              </div>
            )}
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-icon">📍</div>
              <h2 className="section-title">معلومات التوصيل</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <span className="required">*</span>
                  <span>الاسم الكامل</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
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
                    <span>⚠️</span>
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
                  <span className="input-icon">📱</span>
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
                    <span>⚠️</span>
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
                  <span className="input-icon">🏙️</span>
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
                    <span>⚠️</span>
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
                    📮
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
                    <span>⚠️</span>
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div>
            <div className="summary-card">
              <div className="summary-header">
                <div className="section-icon">💰</div>
                <h3 className="summary-header-text">ملخص الطلب</h3>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <span>📦</span>
                  <span>المجموع الفرعي</span>
                </span>
                <span className="summary-value">{subtotal} دينار</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <span>🚚</span>
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
                <span>🔒</span>
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