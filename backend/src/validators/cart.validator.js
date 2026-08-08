import { param, body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }

  next();
};

export const validateAddToCart = [
  param("productId").isMongoId().withMessage("Invalid productId"),
  param("variantId").isMongoId().withMessage("Invalid variantId"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];
