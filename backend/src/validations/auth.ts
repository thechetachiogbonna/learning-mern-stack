import z from "zod";

export const loginValidation = z.object({
  email: z.email().max(255),
  password: z.string().min(6).max(255),
  ip: z.string().optional(),
  userAgent: z.string().optional()
})

export const registerValidation = loginValidation.extend({
  confirmPassword: z.string().min(6).max(255)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
