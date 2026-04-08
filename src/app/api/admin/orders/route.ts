import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
