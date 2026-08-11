import axios from "axios";

const instance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItemToCart = async ({ productId, variantId }) => {
  const response = instance.post(`/add/${productId}/${variantId}`, {
    quantity: 1,
  });
  return response.data;
};

export const getCart = async () => {
  const response = await instance.get("/");
  // console.log("API", response.data)
  return response.data;
};

export const incrementQuantity = async ({ productId, variantId }) => {
  const response = await instance.post(
    `/quantity/increment/${productId}/${variantId}`,
  );
  return response.data;
};

export const decrementQuantity = async ({ productId, variantId }) => {
  const response = await instance.post(
    `/quantity/decrement/${productId}/${variantId}`,
  );
  return response.data;
};

export const deleteItemInCart = async ({ productId, variantId }) => {
  const response = await instance.delete(`/delete/${productId}/${variantId}`);
  return response.data;
};

export const createOrder = async () => {
  const response = await instance.post("/payment/create/order");
  return response.data;
};

export const verifyPaymentOrder = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const response = await instance.post("/payment/verify/order", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};
