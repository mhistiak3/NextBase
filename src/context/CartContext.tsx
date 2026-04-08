"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  slug: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("nextbase_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("nextbase_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((i) => i.slug === item.slug);
      if (existingProduct) {
        return prevCart.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (slug: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.slug !== slug));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );
  };
  
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cart.reduce((total, item) => {
    // Assuming price is formatted as "$199.99"
    const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return total + priceValue * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
