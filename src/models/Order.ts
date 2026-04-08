import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        slug: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    stripeSessionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
