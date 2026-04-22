import { NextResponse } from "next/server";
import { getTokenFromRequest, verifySessionToken } from "@/lib/auth/server";
import { buildExternalUserDetail, readDb } from "@/lib/local-api/db";

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.id === payload.id);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(buildExternalUserDetail(user), { status: 200 });
}
