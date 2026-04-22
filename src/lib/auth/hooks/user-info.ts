"use client";

import { useAuthContext } from "../providers/auth-provider";

export function useUserInfo() {
  return useAuthContext();
}
