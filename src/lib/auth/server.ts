import crypto from "crypto";
import { UserProfile } from "@/types/auth";

const AUTH_SECRET = process.env.AUTH_SECRET ?? "erms_dev_secret_change_me";
const COOKIE_NAME = "erms_token";

export type SessionPayload = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  iat: number;
  exp: number;
};

export const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "Password123!",
    name: "Admin User",
    roles: ["admin", "user"],
  },
  {
    id: "2",
    email: "employee@example.com",
    password: "Password123!",
    name: "Team Member",
    roles: ["user"],
  },
];

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function createSessionToken(profile: UserProfile, expiresInSeconds = 60 * 60 * 24 * 7) {
  const payload: SessionPayload = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    roles: profile.roles,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string) {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) {
      return null;
    }

    const expected = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    const safeEqual = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!safeEqual) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function buildCookie(token: string) {
  const secure = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; ${secure ? "Secure;" : ""} Max-Age=${60 * 60 * 24 * 7}`;
}

export function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
  return tokenCookie?.split("=")[1] ?? null;
}

export function sanitizeUser(user: { id: string; email: string; name: string; roles: string[] | readonly string[] }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: Array.isArray(user.roles) ? [...user.roles] : [],
  } as UserProfile;
}
