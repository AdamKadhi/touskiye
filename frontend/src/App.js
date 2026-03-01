import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './Components/HomePage';
import ProductDetailPage from './Components/ProductDetailPage';
import CheckoutCart from './Components/CheckoutCart';
import ThankYouPage from './Components/Thankyoupage';
import AdminLogin from './Components/Adminlogin';
import AdminDashboard from './Components/Admindashboard';
import './App.css';

// Wrapper component to handle navigation
function AppContent() {
  // Shopping cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderData, setOrderData] = useState(null);
  
  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const navigate = useNavigate();

  // Check localStorage for admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

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
    navigate('/checkout');
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToAdminLogin = () => {
    navigate('/admin');
  };

  const handleOrderComplete = (data) => {
    setOrderData(data);
    navigate('/thankyou');
  };

  const handleBackToHomeFromThankYou = () => {
    setCartItems([]);
    setCartCount(0);
    setOrderData(null);
    navigate('/');
  };

  // Admin authentication functions
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminSession', 'true');
    navigate('/admin/dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  // Protected route for admin
  const ProtectedAdminRoute = ({ children }) => {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      <Routes>
        {/* Home page */}
        <Route 
          path="/" 
          element={
            <HomePage 
              cartItems={cartItems}
              cartCount={cartCount}
              addToCart={addToCart}
              goToCheckout={goToCheckout}
              goToAdmin={goToAdminLogin}
            />
          } 
        />

        {/* Product detail page - NEW! */}
        <Route 
          path="/product/:id" 
          element={
            <ProductDetailPage 
              addToCart={addToCart}
            />
          } 
        />

        {/* Checkout page */}
        <Route 
          path="/checkout" 
          element={
            <CheckoutCart 
              cartItems={cartItems}
              onClose={goToHome}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onOrderComplete={handleOrderComplete}
            />
          } 
        />

        {/* Thank you page */}
        <Route 
          path="/thankyou" 
          element={
            <ThankYouPage
              orderData={orderData}
              onBackToHome={handleBackToHomeFromThankYou}
            />
          } 
        />

        {/* Admin login */}
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminLogin onLogin={handleAdminLogin} />
          } 
        />

        {/* Admin dashboard - protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard onLogout={handleAdminLogout} />
            </ProtectedAdminRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;