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

const registerValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body(["fullName", "fullname"]).custom((value, { req }) => {
    const fullName = req.body.fullName || req.body.fullname;

    if (!fullName || fullName.trim().length < 2) {
      throw new Error("Full name is required");
    }

    return true;
  }),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact is required")
    .isLength({ min: 7, max: 15 })
    .withMessage("Contact must be between 7 and 15 characters")
    .matches(/^\+?[0-9\s-]+$/)
    .withMessage("Contact must contain only numbers, spaces, hyphens, or +"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["buyer", "seller"])
    .withMessage("Role must be either buyer or seller"),

  checkValidation,
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Password is required"),

  checkValidation,
];

export { registerValidator, loginValidator };
