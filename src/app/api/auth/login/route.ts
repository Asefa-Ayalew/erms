import { NextResponse } from "next/server";
import { loginInputSchema } from "@/types/auth";
import { findUserByEmail, buildCookie, createSessionToken, sanitizeUser } from "@/lib/auth/server";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userRecord = findUserByEmail(parsed.data.email);
  if (!userRecord || userRecord.password !== parsed.data.password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const user = sanitizeUser(userRecord);
  const token = createSessionToken(user);
  const response = NextResponse.json({ token, user }, { status: 200 });
  response.headers.append("Set-Cookie", buildCookie(token));
  return response;
}
