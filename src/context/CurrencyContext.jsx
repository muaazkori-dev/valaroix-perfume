'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATE_PKR = 280;

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('PKR'); 
  const [exchangeRate, setExchangeRate] = useState(EXCHANGE_RATE_PKR);

  // Background Automatic IP Geo-Location Detector
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timezone.includes('Karachi') || timezone.includes('Islamabad') || timezone.includes('Pakistan')) {
        setCurrency('PKR');
      }

      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_code) {
            if (data.country_code === 'PK') {
              setCurrency('PKR');
            } else {
              setCurrency('USD');
            }
          }
        })
        .catch(() => {});
    } catch (e) {}
  }, []);

  /**
   * Automatic Converter & Formatter:
   * Accepts PKR price (e.g. 2499) or USD price (e.g. 9)
   * Safely formats without producing Rs. 16 bug!
   */
  const formatPrice = (priceVal) => {
    let pkrAmount = 0;
    let usdAmount = 0;

    if (typeof priceVal === 'object' && priceVal !== null) {
      pkrAmount = priceVal.pkr || 0;
      usdAmount = priceVal.usd || Math.max(1, Math.round(pkrAmount / exchangeRate));
    } else {
      const num = Number(priceVal) || 0;
      if (num < 100 && num > 0) {
        // Provided in USD
        usdAmount = num;
        pkrAmount = Math.round(num * exchangeRate);
      } else {
        // Provided in PKR
        pkrAmount = num;
        usdAmount = Math.max(1, Math.round(num / exchangeRate));
      }
    }

    if (currency === 'PKR') {
      return `Rs. ${pkrAmount.toLocaleString('en-PK')}`;
    }

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
