"use client";

import { useCart } from "@/context/CartContext";
import PageHeader from "@/partials/PageHeader";
import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <PageHeader title="Your Cart" />
      <section className="section">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-8">
              {cart.length === 0 ? (
                <div className="text-center mt-10">
                  <p className="mb-6 h4">Your cart is empty.</p>
                  <Link href="/product" className="btn btn-primary">
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2">Product</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.slug} className="border-b">
                          <td className="py-4">
                            <div className="flex items-center">
                              {item.image && (
                                <ImageFallback
                                  src={item.image}
                                  width={60}
                                  height={60}
                                  alt={item.title}
                                  className="mr-4 rounded"
                                />
                              )}
                              <Link href={`/product/${item.slug}`} className="font-semibold text-primary">
                                {item.title}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4">{item.price}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <button
                                className="px-2 border rounded"
                                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="px-4">{item.quantity}</span>
                              <button
                                className="px-2 border rounded"
                                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                              >
                                +
                              </button>
                              <button
                                className="ml-4 text-red-500"
                                onClick={() => removeFromCart(item.slug)}
                                aria-label="Remove item"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            ${(parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-8 flex justify-end">
                    <div className="w-full max-w-sm rounded bg-light p-6 dark:bg-darkmode-light">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-primary text-xl">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Link href="/checkout" className="btn btn-primary block w-full text-center">
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
