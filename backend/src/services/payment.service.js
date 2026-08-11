import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const createOrder = async ({ amount, currency = "INR" }) => {
  const options = {
    amount: amount * 100, // To get amount in ruppees
    currency,
  };

  const order = await razorpay.orders.create(options);

  return order;
};

export default createOrder;
