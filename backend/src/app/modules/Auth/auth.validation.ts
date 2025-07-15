import { z } from "zod";

const registrationValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required and cannot be empty"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(28, "Password must be at most 28 characters long"),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(28, "Password must be at most 28 characters long"),
  }),
});

export const authValidation = {
  registrationValidation,
  loginValidation,
};
