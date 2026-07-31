import { Router } from "express";
import multer from "multer";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProductController } from "../controllers/product.controller.js";
import { productValidator } from "../validators/product.validator.js";

const storage = multer.memoryStorage;
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const productRouter = Router();

productRouter.post(
  "/create",
  authenticateSeller,
  upload.array("images", 7),
  productValidator,
  createProductController,
);

export default productRouter;
