import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(250, "Email exceeds the character limit")
    .email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Min 6 characters")
    .max(250, "Max 250 characters are allowed"),
});

export const VehicleSchema = z.object({
  userId: z.string(),
  carModel: z.string().min(3, "Car model must have at least 3 letters"),
  price: z.coerce.number(),
  phoneNumber: z
    .string()
    .length(11, "Phone number must be exactly 11 characters long"),
  images: z.array(z.any()),
});
