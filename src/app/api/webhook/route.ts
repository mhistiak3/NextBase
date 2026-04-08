import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

// @ts-ignore - Stripe type definitions mismatch 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    if (!sig || !endpointSecret) return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  await dbConnect();

  if (event.type === "checkout.session.completed") {
    // @ts-ignore
    const session = event.data.object as any;
    
    // Fulfill the order
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { paymentStatus: "paid" }
    );
  }

  return NextResponse.json({ received: true });
}
