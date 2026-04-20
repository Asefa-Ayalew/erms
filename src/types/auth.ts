import { z } from "zod";

export const loginInputSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const userProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  roles: z.array(z.string()),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string().nullable().optional(),
  user: userProfileSchema.nullable().optional(),
});

export type LoginRequest = z.infer<typeof loginInputSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type AuthState = {
  user: UserProfile | null;
  token: string | null;
};
