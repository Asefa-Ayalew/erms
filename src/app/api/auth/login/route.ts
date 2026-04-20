import { NextResponse } from "next/server";

const EXTERNAL_AUTH_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://lr24j6p3-3001.uks1.devtunnels.ms";
const LOGIN_URL = EXTERNAL_AUTH_URL.endsWith("/") ? `${EXTERNAL_AUTH_URL}auth/login` : `${EXTERNAL_AUTH_URL}/auth/login`;

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
  const response = new NextResponse(responseBody, {
    status: externalResponse.status,
    headers: {
      "content-type": externalResponse.headers.get("content-type") ?? "application/json",
    },
  });

  const setCookie = externalResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
