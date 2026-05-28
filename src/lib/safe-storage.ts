import type { StateStorage } from "zustand/middleware";

/** localStorage wrapper that survives malformed JSON and quota errors. */
export const safeLocalStorage: StateStorage = {
  getItem(name) {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      JSON.parse(raw);
      return raw;
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem(name, value) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // Private mode or quota exceeded — app continues without persistence.
    }
  },
  removeItem(name) {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};
