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

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItemToCart = async ({ productId, variantId }) => {
    const data = await addItemToCart({ productId, variantId });
    await handleGetCart();
    return data.cart;
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
    const data = await deleteItemInCart({ productId, variantId });
    await handleGetCart();
    return data;
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
    const data = await verifyPaymentOrder({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return data;
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
