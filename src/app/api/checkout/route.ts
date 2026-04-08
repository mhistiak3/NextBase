import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

// @ts-ignore - Stripe type definitions mismatch in some environments
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as any, // fallback for newest types if necessary
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerInfo } = body;

    await dbConnect();

    // Calculate total amount in cents
    let totalAmount = 0;
    const lineItems = items.map((item: any) => {
      const unitAmount = Math.round(parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * 100);
      totalAmount += (unitAmount * item.quantity);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/cart`,
      customer_email: customerInfo.email,
    });

    // Save preliminary order
    const newOrder = await Order.create({
      customerInfo,
      items,
      totalAmount: totalAmount / 100,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    return NextResponse.json({ url: session.url, sessionId: session.id, orderId: newOrder._id });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
