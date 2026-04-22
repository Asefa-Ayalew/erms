/** Authorization: whether the user has this role (case-insensitive). */
export function hasRole(userRoles: string[] | undefined, role: string): boolean {
  const r = role.trim().toLowerCase();
  return (userRoles ?? []).some((x) => x.trim().toLowerCase() === r);
}

/** Whether the user has at least one of the allowed roles. */
export function hasAnyRole(userRoles: string[] | undefined, allowed: string[]): boolean {
  return allowed.some((a) => hasRole(userRoles, a));
}
