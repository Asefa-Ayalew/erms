import type { MenuTree } from "@/lib/core/shell/side-menu";

function norm(r: string): string {
  return r.trim().toLowerCase();
}

function canSee(allowed: string[] | undefined, userRoles: string[]): boolean {
  if (!allowed?.length) return true;
  if (!userRoles.length) return false;
  const set = new Set(userRoles.map(norm));
  return allowed.some((a) => set.has(norm(a)));
}

export function filterMenusByRole(menus: MenuTree[], userRoles: string[] | undefined): MenuTree[] {
  const roles = userRoles ?? [];
  return menus
    .filter((m) => canSee(m.allowedRoles, roles))
    .map((m) => ({
      ...m,
      children: m.children ? filterMenusByRole(m.children, roles) : undefined,
    }))
    .filter((m) => {
      if (m.children && m.children.length === 0 && !m.link) return false;
      return true;
    });
}
