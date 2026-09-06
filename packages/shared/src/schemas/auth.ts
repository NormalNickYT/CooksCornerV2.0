import { z } from "zod";

/**
 * Email/password credentials. The rules here are enforced on both sides, so
 * the browser never lets through something the server will reject.
 */

const password = z
  .string()
  .min(10, "Gebruik minstens 10 tekens")
  .max(200, "Wachtwoord is te lang");

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Vul je naam in").max(80),
    username: z
      .string()
      .trim()
      .min(3, "Minstens 3 tekens")
      .max(30, "Maximaal 30 tekens")
      .regex(/^[a-z0-9_.-]+$/i, "Alleen letters, cijfers, _ . en -"),
    email: z.string().trim().toLowerCase().email("Dat is geen geldig e-mailadres"),
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Dat is geen geldig e-mailadres"),
  password: z.string().min(1, "Vul je wachtwoord in"),
});

export type RegisterInput = z.input<typeof registerSchema>;
export type LoginInput = z.input<typeof loginSchema>;

export interface PublicUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string | null;
  /** True when the account can sign in with a password (vs Google only). */
  hasPassword: boolean;
  createdAt: string;
}
