import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProductController,
  getSellerProductsController,
} from "../controllers/product.controller.js";
import { productValidator } from "../validators/product.validator.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  productValidator,
  createProductController,
);

productRouter.get("/seller", authenticateSeller, getSellerProductsController);

export default productRouter;
