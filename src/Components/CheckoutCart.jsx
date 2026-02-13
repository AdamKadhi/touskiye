import React, { useState } from 'react';

export default function CheckoutCart({ cartItems = [], onClose, onRemoveItem, onUpdateQuantity, onOrderComplete }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const tunisianCities = [
    'تونس', 'أريانة', 'بن عروس', 'منوبة', 'نابل', 'زغوان', 'بنزرت', 'باجة',
    'جندوبة', 'الكاف', 'سليانة', 'القيروان', 'القصرين', 'سوسة', 'المنستير',
    'المهدية', 'صفاقس', 'قابس', 'مدنين', 'تطاوين', 'قفصة', 'توزر', 'قبلي', 'سيدي بوزيد'
  ];

  const deliveryFee = 7;
  const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) : 0;
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'الرجاء إدخال الاسم الكامل';
    if (!formData.phone.trim()) {
      newErrors.phone = 'الرجاء إدخال رقم الهاتف';
    } else if (!/^[0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون 8 أرقام';
    }
    if (!formData.city) newErrors.city = 'الرجاء اختيار المدينة';
    if (!formData.address.trim()) newErrors.address = 'الرجاء إدخال العنوان';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const orderData = {
        formData,
        cartItems,
        subtotal,
        deliveryFee,
        total
      };
      
      if (onOrderComplete) {
        onOrderComplete(orderData);
      } else {
        alert('تم تأكيد طلبك بنجاح! سنتصل بك قريباً.');
        console.log('Order data:', orderData);
      }
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .checkout-container { min-height: 100vh; background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%); }
        .checkout-header { background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 1.2rem 2.5rem; position: relative; overflow: hidden; }
        .checkout-header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(196, 214, 0, 0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.15), transparent 50%); }
        .header-content { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
        .header-info { display: flex; align-items: center; gap: 0.8rem; }
        .header-icon { width: 45px; height: 45px; background: linear-gradient(135deg, #c4d600, #ff6b35); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 15px rgba(196, 214, 0, 0.3); }
        .header-text h1 { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: #f4edd8; letter-spacing: 2px; margin-bottom: 0.15rem; }
        .header-text p { color: #c4d600; font-size: 0.75rem; }
        .back-btn { background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(244, 237, 216, 0.3); color: #f4edd8; padding: 0.6rem 1.3rem; border-radius: 50px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 0.4rem; }
        .back-btn:hover { background: rgba(255, 255, 255, 0.2); border-color: #c4d600; transform: translateX(-5px); }
        .checkout-content { max-width: 1400px; margin: 1.5rem auto; padding: 0 2.5rem; display: grid; grid-template-columns: 1fr 1fr 0.75fr; gap: 1.5rem; }
        .section-card { background: white; border-radius: 20px; padding: 1.8rem; box-shadow: 0 4px 25px rgba(0,0,0,0.08); }
        .section-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; padding-bottom: 0.8rem; border-bottom: 2px solid #f8f6f0; }
        .section-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #c4d600, #ff6b35); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #2a2a2a; letter-spacing: 1.5px; }
        .cart-items-grid { display: flex; flex-direction: column; gap: 0.8rem; max-height: 400px; overflow-y: auto; padding: 0.2rem; margin: -0.2rem; }
        .cart-items-grid::-webkit-scrollbar { width: 6px; }
        .cart-items-grid::-webkit-scrollbar-track { background: #f8f6f0; border-radius: 10px; }
        .cart-items-grid::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #c4d600, #ff6b35); border-radius: 10px; }
        .cart-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: linear-gradient(135deg, #f8f6f0 0%, #fff 100%); border-radius: 14px; border: 2px solid transparent; transition: all 0.3s ease; }
        .cart-item:hover { border-color: #c4d600; transform: translateX(-3px); box-shadow: 0 2px 8px rgba(196, 214, 0, 0.15); }
        .cart-item-left { display: flex; align-items: center; gap: 1rem; flex: 1; }
        .item-image { width: 60px; height: 60px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
        .item-image img { width: 100%; height: 100%; object-fit: cover; }
        .item-details { flex: 1; }
        .item-details h4 { font-size: 0.95rem; color: #2a2a2a; margin-bottom: 0.3rem; }
        .item-price-info { display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.3rem; }
        .item-old-price { font-size: 0.75rem; color: #999; text-decoration: line-through; }
        .item-discount-badge { 
          display: inline-block;
          background: linear-gradient(135deg, #ff6b35, #e85d2a);
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          margin-right: 0.3rem;
        }
        .item-quantity-control { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; }
        .quantity-btn { width: 24px; height: 24px; border-radius: 6px; border: none; background: linear-gradient(135deg, #c4d600, #ff6b35); color: white; font-size: 0.9rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
        .quantity-btn:hover { transform: scale(1.1); }
        .quantity-btn:active { transform: scale(0.95); }
        .quantity-display { font-size: 0.85rem; font-weight: 700; color: #2a2a2a; min-width: 25px; text-align: center; }
        .item-price-section { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
        .item-price { font-size: 1.1rem; font-weight: 700; color: #ff6b35; }
        .item-price span { font-size: 0.75rem; color: #999; }
        .delete-btn { background: rgba(255, 107, 53, 0.1); border: none; width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; }
        .delete-btn:hover { background: #ff6b35; color: white; transform: scale(1.1); }
        .form-group { margin-bottom: 1.2rem; }
        .form-label { display: flex; align-items: center; gap: 0.4rem; font-weight: 700; font-size: 0.85rem; color: #2a2a2a; margin-bottom: 0.5rem; }
        .required { color: #ff6b35; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 1rem; color: #999; }
        .form-input, .form-select, .form-textarea { width: 100%; padding: 0.8rem 2.8rem 0.8rem 1.2rem; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 0.85rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; background: #f8f6f0; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #c4d600; background: white; box-shadow: 0 0 0 3px rgba(196, 214, 0, 0.1); }
        .form-input.error, .form-select.error, .form-textarea.error { border-color: #ff6b35; }
        .form-error { color: #ff6b35; font-size: 0.75rem; margin-top: 0.4rem; display: flex; align-items: center; gap: 0.3rem; }
        .form-textarea { min-height: 90px; resize: vertical; }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath fill='%232a2a2a' d='M7 10L2 5h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 1rem center; cursor: pointer; }
        .summary-card { background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); border-radius: 20px; padding: 1.8rem; box-shadow: 0 10px 40px rgba(0,0,0,0.3); position: sticky; top: 1.5rem; height: fit-content; }
        .summary-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; padding-bottom: 1.2rem; border-bottom: 2px solid rgba(244, 237, 216, 0.1); }
        .summary-header-text { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #f4edd8; letter-spacing: 1.5px; }
        .summary-row { display: flex; justify-content: space-between; padding: 0.8rem 0; }
        .summary-label { color: #ccc; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }
        .summary-value { color: #f4edd8; font-size: 1rem; font-weight: 700; }
        .summary-total { background: linear-gradient(135deg, rgba(196, 214, 0, 0.2), rgba(255, 107, 53, 0.2)); border-radius: 14px; padding: 1.2rem; margin: 1.2rem 0 1.5rem; display: flex; justify-content: space-between; border: 2px solid rgba(196, 214, 0, 0.3); }
        .total-label { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: #c4d600; }
        .total-value { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; background: linear-gradient(135deg, #c4d600, #ff6b35); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .checkout-btn { width: 100%; background: linear-gradient(135deg, #c4d600, #ff6b35); color: #2a2a2a; border: none; padding: 1.1rem; border-radius: 50px; font-weight: 900; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1.5px; }
        .checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(196, 214, 0, 0.6); }
        .checkout-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .secure-payment { display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #999; font-size: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(244, 237, 216, 0.1); }
        .empty-cart { text-align: center; padding: 2rem; color: #999; }
        .empty-cart-icon { font-size: 4rem; margin-bottom: 0.8rem; opacity: 0.3; }
        @media (max-width: 1200px) { .checkout-content { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 1024px) { .checkout-content { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .checkout-header { padding: 1rem 1.5rem; } .checkout-content { padding: 0 1.5rem; } .section-card { padding: 1.5rem; } }
      `}</style>

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
                        <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        {(item.originalPrice || item.discount) && (
                          <div className="item-price-info">
                            {item.originalPrice && (
                              <span className="item-old-price">{item.originalPrice} دينار</span>
                            )}
                            {item.discount && (
                              <span className="item-discount-badge">-{item.discount}%</span>
                            )}
                          </div>
                        )}
                        <div className="item-quantity-control">
                          <button className="quantity-btn" onClick={() => handleUpdateQuantity(index, (item.quantity || 1) - 1)}>−</button>
                          <span className="quantity-display">{item.quantity || 1}</span>
                          <button className="quantity-btn" onClick={() => handleUpdateQuantity(index, (item.quantity || 1) + 1)}>+</button>
                        </div>
                      </div>
                    </div>
                    <div className="item-price-section">
                      <div className="item-price">{(item.price * (item.quantity || 1))} <span>دينار</span></div>
                      {item.discount && item.originalPrice && (
                        <div style={{ fontSize: '0.7rem', color: '#ff6b35', fontWeight: '600', marginTop: '0.2rem' }}>
                          وفرت {((item.originalPrice - item.price) * (item.quantity || 1))} دت
                        </div>
                      )}
                      <button className="delete-btn" onClick={() => handleRemoveItem(index)} title="حذف">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart"><div className="empty-cart-icon">🛒</div><p>سلة التسوق فارغة</p></div>
            )}
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-icon">📍</div>
              <h2 className="section-title">معلومات التوصيل</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label"><span className="required">*</span><span>الاسم الكامل</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`form-input ${errors.fullName ? 'error' : ''}`} placeholder="أدخل اسمك الكامل" />
                </div>
                {errors.fullName && <div className="form-error"><span>⚠️</span><span>{errors.fullName}</span></div>}
              </div>
              <div className="form-group">
                <label className="form-label"><span className="required">*</span><span>رقم الهاتف</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="12345678" maxLength="8" />
                </div>
                {errors.phone && <div className="form-error"><span>⚠️</span><span>{errors.phone}</span></div>}
              </div>
              <div className="form-group">
                <label className="form-label"><span className="required">*</span><span>المدينة</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">🏙️</span>
                  <select name="city" value={formData.city} onChange={handleInputChange} className={`form-select ${errors.city ? 'error' : ''}`}>
                    <option value="">اختر المدينة</option>
                    {tunisianCities.map((city, index) => (<option key={index} value={city}>{city}</option>))}
                  </select>
                </div>
                {errors.city && <div className="form-error"><span>⚠️</span><span>{errors.city}</span></div>}
              </div>
              <div className="form-group">
                <label className="form-label"><span className="required">*</span><span>العنوان الكامل</span></label>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ top: '1.2rem' }}>📮</span>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} className={`form-textarea ${errors.address ? 'error' : ''}`} placeholder="الشارع، رقم المنزل، تفاصيل إضافية..." />
                </div>
                {errors.address && <div className="form-error"><span>⚠️</span><span>{errors.address}</span></div>}
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
                <span className="summary-label"><span>📦</span><span>المجموع الفرعي</span></span>
                <span className="summary-value">{subtotal} دينار</span>
              </div>
              <div className="summary-row">
                <span className="summary-label"><span>🚚</span><span>رسوم التوصيل</span></span>
                <span className="summary-value">{deliveryFee} دينار</span>
              </div>
              <div className="summary-total">
                <span className="total-label">المجموع الكلي</span>
                <span className="total-value">{total} دينار</span>
              </div>
              <button className="checkout-btn" onClick={handleSubmit} disabled={!Array.isArray(cartItems) || cartItems.length === 0}>
                تأكيد الطلب الآن ✓
              </button>
              <div className="secure-payment"><span>🔒</span><span>دفع آمن ومضمون 100%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}