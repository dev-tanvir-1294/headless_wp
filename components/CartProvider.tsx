'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/lib/cart';
import { cartSubtotal } from '@/lib/cart';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'stichyx-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue['addItem'] = (item) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    };

    const removeItem: CartContextValue['removeItem'] = (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity: CartContextValue['updateQuantity'] = (id, quantity) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    };

    const clear = () => setItems([]);

    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: cartSubtotal(items),
      addItem,
      removeItem,
      updateQuantity,
      clear,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
