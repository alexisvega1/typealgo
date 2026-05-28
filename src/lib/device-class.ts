export type DeviceClass = "desktop-keyboard" | "mobile-touch" | "tablet";

export function detectDeviceClass(): DeviceClass {
  if (typeof window === "undefined") return "desktop-keyboard";

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const wide = window.matchMedia("(min-width: 769px)").matches;
  const touch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    coarsePointer;

  const ua = navigator.userAgent;
  const tabletUa = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua);

  if (tabletUa || (touch && wide && coarsePointer)) {
    return "tablet";
  }

  if (narrow && touch) {
    return "mobile-touch";
  }

  return "desktop-keyboard";
}

export function isTouchDeviceClass(device: DeviceClass): boolean {
  return device === "mobile-touch" || device === "tablet";
}

export function deviceClassLabel(device: DeviceClass): string {
  switch (device) {
    case "mobile-touch":
      return "Mobile";
    case "tablet":
      return "Tablet";
    default:
      return "Desktop";
  }
}
