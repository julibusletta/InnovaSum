'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthView = 'login' | 'register';

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthView;
  callbackUrl: string;
  openLogin: (callbackUrl?: string) => void;
  openRegister: (callbackUrl?: string) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>('login');
  const [callbackUrl, setCallbackUrl] = useState('/');

  const openLogin = (url = '/') => {
    setCallbackUrl(url);
    setView('login');
    setIsOpen(true);
  };

  const openRegister = (url = '/') => {
    setCallbackUrl(url);
    setView('register');
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider 
      value={{ 
        isOpen, 
        view, 
        callbackUrl, 
        openLogin, 
        openRegister, 
        closeModal, 
        setView 
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
