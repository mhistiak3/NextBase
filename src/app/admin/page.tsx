"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/partials/PageHeader";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          const data = await res.json();
          setError(data.message || "Something went wrong.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return <div className="py-20 text-center h4">Loading Dashboard...</div>;
  }

  return (
    <>
      <PageHeader title="Admin Dashboard - Orders" />
      <section className="section">
        <div className="container">
          {error ? (
             <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="overflow-x-auto bg-light p-6 rounded-lg dark:bg-darkmode-light">
              <table className="w-full text-left bg-white dark:bg-darkmode-body overflow-hidden rounded-lg">
                <thead className="border-b bg-gray-100 dark:bg-darkmode-border">
                  <tr>
                    <th className="py-4 px-4 font-semibold">Order ID</th>
                    <th className="py-4 px-4 font-semibold">Customer</th>
                    <th className="py-4 px-4 font-semibold">Amount</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-text-light">No orders found.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="border-b last:border-0 border-border dark:border-darkmode-border">
                        <td className="py-4 px-4 text-sm text-text-light">{order._id}</td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-text-dark dark:text-darkmode-text-dark">{order.customerInfo.name}</div>
                          <div className="text-xs text-text-light">{order.customerInfo.email}</div>
                          <div className="text-xs text-text-light">{order.customerInfo.phone}</div>
                        </td>
                        <td className="py-4 px-4 font-bold text-primary">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            order.paymentStatus === 'paid' ? 'bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#a7f3d0]' :
                            order.paymentStatus === 'failed' ? 'bg-[#fee2e2] text-[#991b1b] dark:bg-[#7f1d1d] dark:text-[#fecaca]' :
                            'bg-[#fef3c7] text-[#92400e] dark:bg-[#78350f] dark:text-[#fde68a]'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-text-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
