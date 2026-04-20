import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.string()),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userProfileSchema,
});

export type LoginRequest = z.infer<typeof loginInputSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type AuthState = {
  user: UserProfile | null;
  token: string | null;
};
