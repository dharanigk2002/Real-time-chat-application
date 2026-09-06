import { z } from "zod";

export const signupRequestBodySchema = z.object({
  firstName: z.string("First name is required"),
  lastName: z.string("Last name is required"),
  email: z.email("Please enter a valid email"),
  password: z
    .string("Password is required")
    .min(8, "Password must be atleast 3 characters long"),
});

export const loginRequestBodySchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string("Password is required")
    .min(8, "Password must be atleast 3 characters long"),
});
