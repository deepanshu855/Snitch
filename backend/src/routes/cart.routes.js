import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addItemToCart, getCart } from "../controllers/cart.controller.js";
import { validateAddToCart } from "../validators/cart.validator.js";

const cartRouter = Router();

cartRouter.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addItemToCart,
);

cartRouter.get("/", authenticateUser, getCart);

export default cartRouter;
