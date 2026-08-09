import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addItemToCart,
  decrementCartQuantity,
  deleteItemInCart,
  getCart,
  incrementCartQuantity,
} from "../controllers/cart.controller.js";
import {
  validateAddToCart,
  validateCartQuantity,
} from "../validators/cart.validator.js";

const cartRouter = Router();

cartRouter.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addItemToCart,
);
cartRouter.get("/", authenticateUser, getCart);
cartRouter.post(
  "/quantity/increment/:productId/:variantId",
  authenticateUser,
  validateCartQuantity,
  incrementCartQuantity,
);
cartRouter.post(
  "/quantity/decrement/:productId/:variantId",
  authenticateUser,
  validateCartQuantity,
  decrementCartQuantity,
);
cartRouter.delete(
  "/delete/:productId/:variantId",
  authenticateUser,
  validateCartQuantity,
  deleteItemInCart,
);

export default cartRouter;
