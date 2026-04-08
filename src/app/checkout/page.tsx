"use client";

import { useCart } from "@/context/CartContext";
import PageHeader from "@/partials/PageHeader";
import { useState } from "react";

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, customerInfo: formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="section text-center py-20">
        <h2 className="mb-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Checkout" />
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="lg:col-7 mb-10 lg:mb-0">
              <h3 className="mb-6">Billing Details</h3>
              <form onSubmit={handleCheckout}>
                <div className="mb-4">
                  <label className="mb-2 block font-semibold text-text-dark" htmlFor="name">Full Name</label>
                  <input required className="form-input w-full" type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="row">
                  <div className="mb-4 md:col-6">
                    <label className="mb-2 block font-semibold text-text-dark" htmlFor="email">Email Address</label>
                    <input required className="form-input w-full" type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="mb-4 md:col-6">
                    <label className="mb-2 block font-semibold text-text-dark" htmlFor="phone">Phone Number</label>
                    <input required className="form-input w-full" type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2 block font-semibold text-text-dark" htmlFor="address">Address</label>
                  <input required className="form-input w-full" type="text" name="address" id="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block font-semibold text-text-dark" htmlFor="country">Country</label>
                  <input required className="form-input w-full" type="text" name="country" id="country" value={formData.country} onChange={handleChange} />
                </div>

                <div className="mt-8">
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? "Processing..." : "Pay with Stripe"}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="lg:col-5">
              <div className="rounded-lg bg-light p-8 dark:bg-darkmode-light">
                <h3 className="mb-6 h4">Order Summary</h3>
                <ul className="mb-6">
                  {cart.map((item) => (
                    <li key={item.slug} className="mb-4 flex justify-between border-b pb-4 last:border-0 last:pb-0 border-border dark:border-darkmode-border">
                      <div>
                        <span className="font-semibold text-text-dark">{item.title}</span>
                        <span className="ml-2 text-sm">x{item.quantity}</span>
                      </div>
                      <span>
                        ${(parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between border-t border-border pt-4 font-bold text-text-dark dark:border-darkmode-border">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
