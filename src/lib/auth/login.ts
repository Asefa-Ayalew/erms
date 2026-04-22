import { userFromAccessToken } from "@/lib/auth/jwt";
import { loginResponseSchema, userProfileSchema } from "@/types/auth";
import type { User, LoginResponse, UserProfile } from "@/types/auth";

type ApiLoginBody = {
  accessToken?: string;
  token?: string;
  refreshToken?: string | null;
  user?: unknown;
};

function rolesList(roles: User["roles"]): string[] {
  if (!Array.isArray(roles)) return [];
  return roles
    .map((r) => {
      if (typeof r === "string") return r;
      if (r && typeof r === "object") return r.name ?? r.roleName ?? "";
      return "";
    })
    .filter(Boolean);
}

function displayName(p: User): string {
  const combined = [p.firstName, p.fatherName ?? p.lastName].filter(Boolean).join(" ").trim();
  return (p.name ?? p.fullName ?? combined) || String(p.username ?? "");
}

export function parseLoginResponse(body: unknown): LoginResponse {
  const r = body as ApiLoginBody;
  console.log(r);
  const access = r.accessToken ?? r.token ?? "";
  const refresh = r.refreshToken ?? null;
  const fromJwt = access ? userFromAccessToken(access) : null;

  const raw = r.user as User | undefined;
  const id = raw ? (raw.id ?? raw.userId ?? raw.sub) : undefined;
  const fromApi: UserProfile | null =
    raw && id
      ? userProfileSchema.parse({
          id: String(id),
          username: String(raw.username ?? raw.email ?? ""),
          name: displayName(raw) || String(raw.username ?? ""),
          roles: rolesList(raw.roles),
        })
      : null;

  const result = loginResponseSchema.parse({
    token: access,
    refreshToken: refresh,
    user: fromApi ?? fromJwt,
  });

  if (result.token && !result.user) {
    throw new Error("Could not read user from access token.");
  }

  return result;
}
