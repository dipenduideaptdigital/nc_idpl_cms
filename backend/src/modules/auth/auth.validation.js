import { z } from "zod";
import { passwordSchema } from "../../shared/validations/password.validation.js";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: passwordSchema,
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required").optional()
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required").optional()
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required").optional()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});