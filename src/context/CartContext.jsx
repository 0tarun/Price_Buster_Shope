import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CartContext } from './cart-context';
const STORAGE_KEY = 'price-buster-cart';

function readStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = useCallback((message, duration = 1800) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), duration);
  }, []);

  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + safeQuantity } : item,
        );
      }

      return [...current, { ...product, quantity: safeQuantity }];
    });

    showToast('Added to bag', 1200);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toast,
      showToast,
      dismissToast,
    }),
    [addToCart, cartItems, itemCount, removeFromCart, toast, updateQuantity, clearCart, showToast, dismissToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
