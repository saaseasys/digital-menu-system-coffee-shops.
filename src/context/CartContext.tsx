'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/order';

interface CartContextType {
  items: CartItem[];
  tableId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setTableId: (id: string) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableId, setTableIdState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedTable = localStorage.getItem('tableId');
    if (savedCart) setItems(JSON.parse(savedCart));
    if (savedTable) setTableIdState(savedTable);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const setTableId = (id: string) => {
    setTableIdState(id);
    localStorage.setItem('tableId', id);
  };

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === item.product.id);
      if (existing) {
        return prev.map(i => 
          i.product.id === item.product.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(i => 
      i.product.id === productId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, tableId, addItem, removeItem, 
      updateQuantity, clearCart, setTableId, total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};