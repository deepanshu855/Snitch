import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "failed", "paid"],
    default: "pending",
  },
  price: {
    type: priceSchema,
    requred: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  orders: [
    {
      title: String,
      productId: mongoose.Schema.Types.ObjectId,
      variantId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      images: [{ url: String }],
      description: String,
      price: priceSchema,
    },
  ],
});

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
