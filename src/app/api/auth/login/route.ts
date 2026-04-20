import { NextResponse } from "next/server";

const EXTERNAL_AUTH_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://lr24j6p3-3001.uks1.devtunnels.ms";
const LOGIN_URL = EXTERNAL_AUTH_URL.endsWith("/") ? `${EXTERNAL_AUTH_URL}auth/login` : `${EXTERNAL_AUTH_URL}/auth/login`;

type JwtPayload = {
  sub?: string;
  username?: string;
  firstName?: string;
  fatherName?: string;
  organizationId?: string | null;
  roles?: string[];
  iat?: number;
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as JwtPayload;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("content-type") ?? "application/json",
    Accept: request.headers.get("accept") ?? "application/json",
  };

  const externalResponse = await fetch(LOGIN_URL, {
    method: "POST",
    headers,
    body,
    credentials: "include",
  });

  const responseBody = await externalResponse.text();
  let normalizedBody = responseBody;

  if (externalResponse.ok) {
    try {
      const parsed = JSON.parse(responseBody) as {
        accessToken?: string;
        refreshToken?: string;
      };

      const accessTokenPayload = parsed.accessToken ? decodeJwtPayload(parsed.accessToken) : null;
      const refreshTokenPayload = parsed.refreshToken ? decodeJwtPayload(parsed.refreshToken) : null;

      if (parsed.accessToken && accessTokenPayload) {
        const name = [accessTokenPayload.firstName, accessTokenPayload.fatherName]
          .filter(Boolean)
          .join(" ")
          .trim();

        normalizedBody = JSON.stringify({
          token: parsed.accessToken,
          refreshToken: parsed.refreshToken ?? null,
          user: {
            id: accessTokenPayload.sub ?? "",
            username: accessTokenPayload.username ?? "",
            name,
            roles: Array.isArray(accessTokenPayload.roles) ? accessTokenPayload.roles : [],
          },
          decoded: {
            accessToken: accessTokenPayload,
            refreshToken: refreshTokenPayload,
          },
        });
      }
    } catch {
      normalizedBody = responseBody;
    }
  }

  const response = new NextResponse(normalizedBody, {
    status: externalResponse.status,
    headers: {
      "content-type": "application/json",
    },
  });

  const setCookie = externalResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
