"use client";

import PageHeader from "@/partials/PageHeader";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

const Success = () => {
  const { clearCart } = useCart();
  
  useEffect(() => {
    // Clear cart content on successful payment checkout landing
    clearCart();
  }, [clearCart]);

  return (
    <>
      <PageHeader title="Order Successful" />
      <section className="section">
        <div className="container text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-4">Thank you for your purchase!</h2>
          <p className="mb-8 text-lg">Your order has been placed and is being processed.</p>
          <Link href="/product" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    </>
  );
};

export default Success;
