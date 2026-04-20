import { NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/server";

const EXTERNAL_AUTH_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://lr24j6p3-3001.uks1.devtunnels.ms";
const USER_DETAIL_URL = EXTERNAL_AUTH_URL.endsWith("/")
  ? `${EXTERNAL_AUTH_URL}auth/user-detail`
  : `${EXTERNAL_AUTH_URL}/auth/user-detail`;

type UserDetailResponse = {
  id?: string;
  userId?: string;
  sub?: string;
  username?: string;
  email?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  roles?: string[] | Array<{ name?: string; roleName?: string }>;
};

function normalizeRoles(roles: UserDetailResponse["roles"]): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => {
      if (typeof role === "string") {
        return role;
      }

      if (role && typeof role === "object") {
        return role.name ?? role.roleName ?? "";
      }

      return "";
    })
    .filter(Boolean);
}

function normalizeName(payload: UserDetailResponse) {
  const combinedName = [payload.firstName, payload.fatherName ?? payload.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return payload.name ?? payload.fullName ?? combinedName;
}

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const externalResponse = await fetch(USER_DETAIL_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const responseText = await externalResponse.text();
  if (!externalResponse.ok) {
    return new NextResponse(responseText, {
      status: externalResponse.status,
      headers: {
        "content-type": externalResponse.headers.get("content-type") ?? "application/json",
      },
    });
  }

  try {
    const parsed = JSON.parse(responseText) as UserDetailResponse;
    const normalized = {
      id: parsed.id ?? parsed.userId ?? parsed.sub ?? "",
      username: parsed.username ?? parsed.email ?? "",
      name: normalizeName(parsed) ?? "",
      roles: normalizeRoles(parsed.roles),
    };

    return NextResponse.json(normalized, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid user detail response." }, { status: 500 });
  }
}
