import { check } from "express-validator";

export const vehicleInfoValidator = [
  check("carModel", "Car model is required").isString().notEmpty(),
  check("price", "Price is required and must be a number")
    .isNumeric()
    .withMessage("Price must be a number"),
  check("phoneNumber", "Phone number is required").isString().notEmpty(),
  check("images", "At least one image is required")
    .isArray()
    .withMessage("Images must be an array")
    .notEmpty(),
  check("images.*", "All images must be strings").isString(),
];
