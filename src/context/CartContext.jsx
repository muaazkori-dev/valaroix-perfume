'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('valaroix_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('valaroix_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('valaroix_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {}
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('valaroix_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    try {
      localStorage.setItem('valaroix_wishlist', JSON.stringify(newWishlist));
    } catch (e) {}
  };

  const addToCart = (product, size = '100ml', engraving = '') => {
    const cartItemId = `${product.id}-${size}-${engraving}`;
    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);

    let price = product.price;
    if (size === '50ml') price = Math.round(product.price * 0.65);
    if (size === '250ml Extrait') price = Math.round(product.price * 1.8);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const newItem = {
        cartItemId,
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        image: product.image,
        price,
        size,
        engraving,
        quantity: 1,
        color: product.color || '#d4af37'
      };
      saveCart([...cart, newItem]);
    }
    setIsCartOpen(true);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    saveWishlist(updated);
  };

  const updateQuantity = (cartItemId, delta) => {
    const updated = cart
      .map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const removeFromCart = (cartItemId) => {
    saveCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  const applyPromo = (code) => {
    if (code.toUpperCase() === 'VALAROIX10' || code.toUpperCase() === 'ROYAL') {
      setDiscount(0.15); // 15% off
      setPromoCode(code.toUpperCase());
      return { success: true, message: '15% Luxury VIP Discount Applied!' };
    }
    return { success: false, message: 'Invalid Promo Code' };
  };

  const addOrder = (orderData) => {
    const newOrders = [orderData, ...orders];
    setOrders(newOrders);
    try {
      localStorage.setItem('valaroix_orders', JSON.stringify(newOrders));
    } catch (e) {}
  };

  const clearCart = () => {
    saveCart([]);
    setDiscount(0);
    setPromoCode('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discount);
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductModal,
        setSelectedProductModal,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        isQuizOpen,
        setIsQuizOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyPromo,
        addOrder,
        promoCode,
        discount,
        subtotal,
        discountAmount,
        total,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
