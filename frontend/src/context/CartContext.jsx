import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('ecopocket_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ecopocket_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product._id === product._id || item.product.slug === product.slug
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          id: product._id || product.slug,
          product,
          quantity,
          price: product.price,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.url || '/images/products/quilted-sandwich-pocket.jpg',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id && item.product._id !== id && item.product.slug !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id || item.product._id === id || item.product.slug === id) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const shippingFee = subtotal >= 999 ? 0 : (subtotal > 0 ? 79 : 0);
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

