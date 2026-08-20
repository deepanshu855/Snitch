import {
  setCart,
  incrementCartItem,
  decrementCartItem,
} from "../state/cart.slice";
import {
  addItemToCart,
  getCart,
  incrementQuantity,
  decrementQuantity,
  deleteItemInCart,
  createOrder,
  verifyPaymentOrder,
} from "../services/cart.api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const showToast = (message, type = "success") => {
  toast[type](message, {
    style: {
      backgroundColor: "#fbf9f5",
      color: "#1b1c1a",
      fontFamily: "'Inter', sans-serif",
      fontSize: "13px",
      fontWeight: "500",
      border: `1px solid ${type === "error" ? "#ffdad6" : "#e4e2de"}`,
      borderRadius: "8px",
      boxShadow: "0 12px 24px -4px rgba(0,0,0,0.04)",
    },
    progressStyle: {
      background: type === "error" ? "#ba1a1a" : "#060607"
    }
  });
};

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItemToCart = async ({ productId, variantId }) => {
    try {
      const data = await addItemToCart({ productId, variantId });
      await handleGetCart();
      showToast("Product added to cart", "success");
      return data.cart;
    } catch (error) {
      // showToast(error.message || "Failed to add product", "error");
      throw error;
    }
  };

  const handleGetCart = async () => {
    const data = await getCart();
    dispatch(setCart(data.cart || []));
    return data.cart;
  };

  const handleIncrementItemQuantity = async ({ productId, variantId }) => {
    const data = await incrementQuantity({ productId, variantId });
    await handleGetCart();
    return data;
  };

  const handleDecrementItemQuantity = async ({ productId, variantId }) => {
    const data = await decrementQuantity({ productId, variantId });
    await handleGetCart();
    return data;
  };

  const handleDeleteItemInCart = async ({ productId, variantId }) => {
    try {
      const data = await deleteItemInCart({ productId, variantId });
      await handleGetCart();
      showToast("Product removed from cart", "success");
      return data;
    } catch (error) {
      showToast(error.message || "Failed to remove product", "error");
      throw error;
    }
  };

  const handleCreateCartOrder = async () => {
    const data = await createOrder();
    return data;
  };

  const handleVerifyPaymentOrder = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) => {
    try {
      const data = await verifyPaymentOrder({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      showToast("Order successful", "success");
      return data;
    } catch (error) {
      showToast(error.message || "Payment verification failed", "error");
      throw error;
    }
  };

  return {
    handleAddItemToCart,
    handleGetCart,
    handleIncrementItemQuantity,
    handleDecrementItemQuantity,
    handleDeleteItemInCart,
    handleCreateCartOrder,
    handleVerifyPaymentOrder,
  };
};
