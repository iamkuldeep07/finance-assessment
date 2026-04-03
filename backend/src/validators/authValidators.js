import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail({
      gmail_remove_dots: false,
    }),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain an uppercase letter, a number, and a symbol",
    ),

  body("role")
    .optional()
    .isIn(["viewer", "analyst"])
    .withMessage("Invalid role requested"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail({
      gmail_remove_dots: false,
    }),

  body("password").notEmpty().withMessage("Password is required"),
];

export const requestOtpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email required"),
];
