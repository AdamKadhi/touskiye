import React, { useState } from 'react';
import HomePage from './Components/HomePage';
import CheckoutCart from './Components/CheckoutCart';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Check if product already exists
      const existingIndex = prev.findIndex(item => item.name === product.name);
      if (existingIndex > -1) {
        // Update quantity if exists
        const updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        return updated;
      }
      // Add new product with quantity 1
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

  const goToCheckout = () => {
    setCurrentPage('checkout');
  };

  const goToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <HomePage 
          cartItems={cartItems}
          cartCount={cartCount}
          addToCart={addToCart}
          goToCheckout={goToCheckout}
        />
      ) : (
        <CheckoutCart 
          cartItems={cartItems}
          onClose={goToHome}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </div>
  );
}

export default App;