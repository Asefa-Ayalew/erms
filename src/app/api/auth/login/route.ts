import { NextResponse } from "next/server";
import crypto from "crypto";
import { buildCookie, createSessionToken, sanitizeUser } from "@/lib/auth/server";
import { buildExternalUserDetail, readDb } from "@/lib/local-api/db";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  if (!payload?.username || !payload?.password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const db = await readDb();
  const candidate = db.users.find((user) => {
    const normalized = payload.username!.trim().toLowerCase();
    return (
      (user.username?.toLowerCase() === normalized || user.email?.toLowerCase() === normalized) &&
      user.password === payload.password
    );
  });

  if (!candidate) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const userDetail = buildExternalUserDetail(candidate);
  const sanitized = sanitizeUser({
    id: userDetail.id,
    username: userDetail.username,
    email: userDetail.email,
    name: userDetail.name,
    roles: userDetail.roles,
  });

  const accessToken = createSessionToken(sanitized, 60 * 60);
  const refreshToken = crypto.randomBytes(32).toString("base64url");
  const response = NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  response.headers.set("set-cookie", buildCookie(accessToken));
  return response;
}
