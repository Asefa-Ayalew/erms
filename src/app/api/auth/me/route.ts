import { NextResponse } from "next/server";
import { getTokenFromRequest, verifySessionToken } from "@/lib/auth/server";

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ id: payload.id, email: payload.email, name: payload.name, roles: payload.roles }, { status: 200 });
}
