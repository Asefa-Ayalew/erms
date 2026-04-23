import type { UserProfile } from "@/types/auth";

function payload(accessToken: string): Record<string, unknown> | null {
  if (!accessToken) return null;
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    const padded = b64 + (pad ? "=".repeat(4 - pad) : "");
    if (typeof atob !== "function") return null;
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function tokenExpired(accessToken: string, skewMs = 30_000): boolean {
  const p = payload(accessToken);
  if (!p) return true;
  if (typeof p.exp !== "number") return false;
  return p.exp * 1000 < Date.now() - skewMs;
}

export function userFromAccessToken(accessToken: string): UserProfile | null {
  if (!accessToken || tokenExpired(accessToken)) return null;
  const p = payload(accessToken);
  if (!p) return null;

  const id = String(p.sub ?? p.id ?? p.userId ?? "").trim();
  const username = String(p.username ?? p.email ?? "").trim();
  if (!id || !username) return null;

  const name = (() => {
    if (typeof p.name === "string" && p.name.trim()) return p.name.trim();
    if (typeof p.fullName === "string" && p.fullName.trim()) return p.fullName.trim();
    const first = typeof p.firstName === "string" ? p.firstName : "";
    const rest =
      (typeof p.fatherName === "string" && p.fatherName) ||
      (typeof p.lastName === "string" && p.lastName) ||
      "";
    const combined = [first, rest].filter(Boolean).join(" ").trim();
    return combined || username;
  })();

  const roles = Array.isArray(p.roles) ? p.roles.map(String) : [];
  return { id, username, name, roles };
}
