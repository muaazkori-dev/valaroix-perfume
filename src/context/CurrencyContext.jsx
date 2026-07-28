'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATE_PKR = 280;

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'PKR'
  const [exchangeRate, setExchangeRate] = useState(EXCHANGE_RATE_PKR);

  // Auto-detect visitor location on mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('valaroix_currency');
      if (savedCurrency) {
        setCurrency(savedCurrency);
        return;
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timezone.includes('Karachi') || timezone.includes('Islamabad') || timezone.includes('Pakistan')) {
        setCurrency('PKR');
        return;
      }

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

  // Flexible Helper: accepts numeric USD OR explicit { pkr, usd } object
  const formatPrice = (priceVal) => {
    if (typeof priceVal === 'object' && priceVal !== null) {
      if (currency === 'PKR') {
        const val = priceVal.pkr ?? Math.round((priceVal.usd || 0) * exchangeRate);
        return `Rs. ${val.toLocaleString('en-PK')}`;
      } else {
        const val = priceVal.usd ?? Math.round((priceVal.pkr || 0) / exchangeRate);
        return `$${val.toLocaleString('en-US')}`;
      }
    }

    const num = Number(priceVal) || 0;
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
