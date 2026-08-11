import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProductController,
  getAllProductsControler,
  getSellerProductsController,
  productDetailsController,
  addProductVariant,
  updateProductDetails,
  deleteProduct,
  deleteVariant,
} from "../controllers/product.controller.js";
import { productValidator } from "../validators/product.validator.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.post(
  "/",
  authenticateSeller,
  upload.array("images", 2),
  productValidator,
  createProductController,
);

productRouter.get("/seller", authenticateSeller, getSellerProductsController);
productRouter.get("/", getAllProductsControler);
productRouter.get("/:productId", productDetailsController);
productRouter.post(
  "/:productId/variants",
  authenticateSeller,
  upload.array("images", 7),
  addProductVariant,
);

productRouter.patch(
  "/update/:productId",
  authenticateSeller,
  productValidator,
  updateProductDetails,
);

productRouter.delete(
  "/delete/:productId",
  authenticateSeller,
  deleteProduct
)

productRouter.delete("/delete/:productId/:variantId", authenticateSeller, deleteVariant)


export default productRouter;
