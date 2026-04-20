"use client"
import { useAuthContext } from "../providers/auth-provider";

export function userInfo() {
  return useAuthContext();
}
