import type { MenuTree } from "./side-menu";

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

/** True if `allowedRoles` is unset/empty (any authenticated user), or the user has at least one matching role. */
function isMenuAllowed(allowedRoles: string[] | undefined, userRoles: string[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  if (userRoles.length === 0) {
    return false;
  }
  const userSet = new Set(userRoles.map(normalizeRole));
  return allowedRoles.some((allowed) => userSet.has(normalizeRole(allowed)));
}

/**
 * Returns a copy of the tree with items the user is not allowed to see removed.
 * Empty groups (no visible children, no link) are removed.
 */
export function filterMenusByRole(menus: MenuTree[], userRoles: string[] | undefined): MenuTree[] {
  const roles = userRoles ?? [];
  return menus
    .filter((item) => isMenuAllowed(item.allowedRoles, roles))
    .map((item) => ({
      ...item,
      children: item.children ? filterMenusByRole(item.children, roles) : undefined,
    }))
    .filter((item) => {
      if (item.children && item.children.length === 0 && !item.link) {
        return false;
      }
      return true;
    });
}
