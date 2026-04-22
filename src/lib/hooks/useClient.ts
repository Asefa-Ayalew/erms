import { useSyncExternalStore } from "react";

/** `true` in the browser after mount; `false` on the server (avoids hydration issues). */
export function useClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
