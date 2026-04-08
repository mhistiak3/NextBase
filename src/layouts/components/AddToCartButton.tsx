"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: { slug: string; title: string; price: string; image: string };
}) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <button className="btn btn-primary" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
