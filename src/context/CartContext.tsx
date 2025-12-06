import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import type { Book } from '../types/book';

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastAdded: CartItem | null;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, delta: number) => void;
  clearCart: () => void;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const addToCart = (book: Book) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === book.id);
      if (existing) {
        const updated = prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setLastAdded({ ...existing, quantity: existing.quantity + 1 });
        return updated;
      } else {
        const newItem: CartItem = { ...book, quantity: 1 };
        setLastAdded(newItem);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id !== bookId) return item;
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
    setLastAdded(null);
  };

  const clearLastAdded = () => {
    setLastAdded(null);
  };

  const value: CartContextType = {
    items,
    total,
    itemCount,
    lastAdded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearLastAdded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
