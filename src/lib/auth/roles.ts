export function hasRole(userRoles: string[] | undefined, role: string): boolean {
  const r = role.trim().toLowerCase();
  return (userRoles ?? []).some((x) => x.trim().toLowerCase() === r);
}

export function hasAnyRole(userRoles: string[] | undefined, allowed: string[]): boolean {
  return allowed.some((a) => hasRole(userRoles, a));
}
