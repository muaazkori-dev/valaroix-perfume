'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Exchange rate: 1 USD = 280 PKR
const EXCHANGE_RATE_PKR = 280;

export function CurrencyProvider({ children }) {
  // Default to PKR for local dev/testing
  const [currency, setCurrency] = useState('PKR'); 
  const [exchangeRate, setExchangeRate] = useState(EXCHANGE_RATE_PKR);

  // Background Automatic IP Geo-Location Detector
  useEffect(() => {
    try {
      // 1. Check browser timezone first
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timezone.includes('Karachi') || timezone.includes('Islamabad') || timezone.includes('Pakistan')) {
        setCurrency('PKR');
      }

      // 2. Fetch IP Geo-Location API
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_code) {
            if (data.country_code === 'PK') {
              setCurrency('PKR'); // Pakistan visitor -> PKR (Rs.)
            } else {
              setCurrency('USD'); // Foreign IP visitor -> USD ($)
            }
          }
        })
        .catch(() => {
          // If IP API blocked, fallback check
          if (navigator.language && !navigator.language.toLowerCase().includes('pk')) {
            // Keep PKR default if inside PK
          }
        });
    } catch (e) {
      console.error('IP Currency detection error:', e);
    }
  }, []);

  /**
   * Automatic Converter & Formatter:
   * Accepts PKR price (e.g. 2499) or price object { pkr: 2499, usd: 9 }
   * Converts PKR to USD automatically for foreign visitors!
   */
  const formatPrice = (priceVal) => {
    let pkrAmount = 0;
    let usdAmount = 0;

    if (typeof priceVal === 'object' && priceVal !== null) {
      pkrAmount = priceVal.pkr || 0;
      usdAmount = priceVal.usd || Math.max(1, Math.round(pkrAmount / exchangeRate));
    } else {
      pkrAmount = Number(priceVal) || 0;
      usdAmount = Math.max(1, Math.round(pkrAmount / exchangeRate));
    }

    if (currency === 'PKR') {
      return `Rs. ${pkrAmount.toLocaleString('en-PK')}`;
    }

    // Foreign IP -> USD ($)
    return `$${usdAmount.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
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
