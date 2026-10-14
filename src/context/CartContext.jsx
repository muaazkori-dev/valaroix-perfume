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
  const [lastAddedProduct, setLastAddedProduct] = useState(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('valaroix_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Normalize prices to full round hundreds (e.g. 2999 -> 3000, 3299 -> 3300, 3499 -> 3500)
        const normalized = (Array.isArray(parsed) ? parsed : []).map((item) => {
          const raw = item.price || item.exactPkr || 3000;
          const rounded = Math.ceil(raw / 100) * 100;
          return {
            ...item,
            price: rounded,
            exactPkr: rounded,
            displayPrice: item.displayPrice || raw
          };
        });
        setCart(normalized);
      }

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

  const addToCart = (product, size = '50ml', engraving = '', openDrawer = false) => {
    const cartItemId = `${product.id}-${size}`;
    const existingIndex = cart.findIndex((item) => (item.cartItemId === cartItemId || item.id === product.id));

    let rawPrice = 2999;
    if (product.exactPkr && product.exactPkr > 0) {
      rawPrice = product.exactPkr;
    } else if (product.startingPrice?.pkr && product.startingPrice.pkr > 0) {
      rawPrice = product.startingPrice.pkr;
    } else if (typeof product.price === 'number' && product.price > 100) {
      rawPrice = product.price;
    }

    // Psychological charm display price (e.g. 2999, 3299, 3499, 2499) vs Pure Count Money (3000, 3300, 3500, 2500)
    // Requirement: "dikhaye itne lekin count pure ho paise"
    const roundedPrice = Math.ceil(rawPrice / 100) * 100;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
      updated[existingIndex].price = roundedPrice;
      updated[existingIndex].exactPkr = roundedPrice;
      updated[existingIndex].displayPrice = rawPrice;
      saveCart(updated);
    } else {
      const newItem = {
        cartItemId,
        id: product.id,
        name: product.name,
        subtitle: product.subtitle || '',
        image: product.image || '/products/sauvage.jpg',
        price: roundedPrice, // Full round count for calculations (3000, 3300, 3500, 2500)
        displayPrice: rawPrice, // Psychological display tag (2999, 3299, 3499, 2499)
        exactPkr: roundedPrice,
        size,
        engraving,
        quantity: 1,
        color: product.color || '#d4af37'
      };
      saveCart([...cart, newItem]);
    }

    // Trigger smooth luxury animated feedback toast only (never open drawer automatically)
    setLastAddedProduct({
      id: Date.now(),
      name: product.name,
      image: product.image || '/products/sauvage.jpg',
      price: roundedPrice,
      displayPrice: rawPrice
    });
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
        const id = item.cartItemId || item.id;
        if (id === cartItemId) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const removeFromCart = (cartItemId) => {
    saveCart(cart.filter((item) => (item.cartItemId || item.id) !== cartItemId));
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

  const subtotal = cart.reduce((sum, item) => sum + Math.ceil((item.price || item.exactPkr || 3000) / 100) * 100 * (item.quantity || 1), 0);
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
        clearCart,
        lastAddedProduct,
        setLastAddedProduct
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
