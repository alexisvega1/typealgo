/** One-time migration from AlgoType → TypeAlgo localStorage keys. */
const KEY_MIGRATIONS: [string, string][] = [
  ["algotype-stats", "typealgo-stats"],
  ["algotype-settings", "typealgo-settings"],
];

export function migrateLegacyStorageKeys(): void {
  if (typeof window === "undefined") return;

  for (const [legacyKey, nextKey] of KEY_MIGRATIONS) {
    try {
      const legacy = localStorage.getItem(legacyKey);
      if (!legacy) continue;
      if (!localStorage.getItem(nextKey)) {
        localStorage.setItem(nextKey, legacy);
      }
      localStorage.removeItem(legacyKey);
    } catch {
      // Private mode or quota — continue without migration.
    }
  }
}
