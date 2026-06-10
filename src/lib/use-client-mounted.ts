"use client";

import { useSyncExternalStore } from "react";

/** True after client hydration; false during SSR/static generation. */
export function useClientMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
