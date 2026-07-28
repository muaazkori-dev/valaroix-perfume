'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Default Exchange Rate: 1 USD = 280 PKR
const EXCHANGE_RATE_PKR = 280;

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'PKR'
  const [exchangeRate, setExchangeRate] = useState(EXCHANGE_RATE_PKR);

  // Auto-detect visitor location on mount
  useEffect(() => {
    try {
      // 1. Check saved user preference in localStorage
      const savedCurrency = localStorage.getItem('valaroix_currency');
      if (savedCurrency) {
        setCurrency(savedCurrency);
        return;
      }

      // 2. Auto-detect via Browser Timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timezone.includes('Karachi') || timezone.includes('Islamabad') || timezone.includes('Pakistan')) {
        setCurrency('PKR');
        return;
      }

      // 3. Fallback IP Geo-location API check
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_code === 'PK') {
            setCurrency('PKR');
            localStorage.setItem('valaroix_currency', 'PKR');
          } else {
            setCurrency('USD');
            localStorage.setItem('valaroix_currency', 'USD');
          }
        })
        .catch(() => {
          // If API fails, check navigator language
          if (navigator.language && navigator.language.includes('pk')) {
            setCurrency('PKR');
          }
        });
    } catch (e) {
      console.error('Currency auto-detection error', e);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem('valaroix_currency', newCurrency);
    } catch (e) {}
  };

  // Helper function to format price based on selected currency
  const formatPrice = (amountInUSD) => {
    const num = Number(amountInUSD) || 0;
    if (currency === 'PKR') {
      const pkrAmount = Math.round(num * exchangeRate);
      return `Rs. ${pkrAmount.toLocaleString('en-PK')}`;
    }
    return `$${num.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        formatPrice,
        exchangeRate,
        setExchangeRate
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
