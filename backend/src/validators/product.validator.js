import { body, validationResult } from "express-validator";

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }

  next();
};

export const productValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("seller")
    .notEmpty()
    .withMessage("Seller is required")
    .isMongoId()
    .withMessage("Invalid seller ID"),

  body("price.amount")
    .notEmpty()
    .withMessage("Price amount is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("price.currency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "INR", "JPY"])
    .withMessage("Invalid currency"),

  checkValidation,
];
