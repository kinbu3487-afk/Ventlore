'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentMode } from '@ventlore/api-client';

export interface PaymentInitialData {
  targetTitle?: string;
  targetId?: string; // postId or planCode
  revisionId?: string;
  authorHandle?: string;
  authorDisplayName?: string;
  authorWalletAddress?: string;
  isEligibleForTip?: boolean;
  ineligibleReason?: string;
  defaultAmount?: string;
  planPriceUsdCents?: number;
  termMonths?: number;
}

interface PaymentContextType {
  isOpen: boolean;
  mode: PaymentMode;
  initialData?: PaymentInitialData;
  openPayment: (mode: PaymentMode, data?: PaymentInitialData) => void;
  closePayment: () => void;
}

const PaymentContext = createContext<PaymentContextType>({
  isOpen: false,
  mode: 'PROJECT',
  openPayment: () => {},
  closePayment: () => {},
});

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PaymentMode>('PROJECT');
  const [initialData, setInitialData] = useState<PaymentInitialData | undefined>(undefined);

  const openPayment = (m: PaymentMode, data?: PaymentInitialData) => {
    setMode(m);
    setInitialData(data);
    setIsOpen(true);
  };

  const closePayment = () => {
    setIsOpen(false);
  };

  return (
    <PaymentContext.Provider value={{ isOpen, mode, initialData, openPayment, closePayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}
