import React, { useState, useEffect } from 'react';
import HomePage from './Components/HomePage';
import CheckoutCart from './Components/CheckoutCart';
import ThankYouPage from './Components/Thankyoupage';
import AdminLogin from './Components/Adminlogin';
import AdminDashboard from './Components/Admindashboard';
import './App.css';

function App() {
  // Page navigation state
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'checkout', 'thankyou', 'admin-login', 'admin'
  
  // Shopping cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderData, setOrderData] = useState(null);
  
  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check localStorage for admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // Check URL on mount to see if accessing admin
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path === '/admin' || hash === '#admin') {
      if (isAdminAuthenticated) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('admin-login');
      }
    }
  }, [isAdminAuthenticated]);

  // Shopping cart functions
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.name === product.name);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartCount(prev => prev + 1);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => {
      const updated = [...prev];
      const removedItem = updated[index];
      const removedQuantity = removedItem.quantity || 1;
      updated.splice(index, 1);
      setCartCount(prevCount => prevCount - removedQuantity);
      return updated;
    });
  };

  const updateQuantity = (index, newQuantity) => {
    setCartItems(prev => {
      const updated = [...prev];
      const oldQuantity = updated[index].quantity || 1;
      updated[index].quantity = newQuantity;
      setCartCount(prevCount => prevCount - oldQuantity + newQuantity);
      return updated;
    });
  };

  // Navigation functions
  const goToCheckout = () => {
    setCurrentPage('checkout');
  };

  const goToHome = () => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const goToAdminLogin = () => {
    setCurrentPage('admin-login');
    window.history.pushState({}, '', '/admin');
  };

  const handleOrderComplete = (data) => {
    setOrderData(data);
    setCurrentPage('thankyou');
  };

  const handleBackToHomeFromThankYou = () => {
    setCartItems([]);
    setCartCount(0);
    setOrderData(null);
    setCurrentPage('home');
  };

  // Admin authentication functions
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminSession', 'true');
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminSession');
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            cartItems={cartItems}
            cartCount={cartCount}
            addToCart={addToCart}
            goToCheckout={goToCheckout}
            goToAdmin={goToAdminLogin}
          />
        );

      case 'checkout':
        return (
          <CheckoutCart 
            cartItems={cartItems}
            onClose={goToHome}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onOrderComplete={handleOrderComplete}
          />
        );

      case 'thankyou':
        return (
          <ThankYouPage
            orderData={orderData}
            onBackToHome={handleBackToHomeFromThankYou}
          />
        );

      case 'admin-login':
        return (
          <AdminLogin onLogin={handleAdminLogin} />
        );

      case 'admin':
        // Double-check authentication before showing admin
        if (!isAdminAuthenticated) {
          setCurrentPage('admin-login');
          return <AdminLogin onLogin={handleAdminLogin} />;
        }
        return (
          <AdminDashboard onLogout={handleAdminLogout} />
        );

      default:
        return (
          <HomePage 
            cartItems={cartItems}
            cartCount={cartCount}
            addToCart={addToCart}
            goToCheckout={goToCheckout}
            goToAdmin={goToAdminLogin}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;