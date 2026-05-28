"use client";

import { useEffect, useState } from "react";
import { detectDeviceClass, type DeviceClass } from "@/lib/device-class";

export function useDeviceClass(): DeviceClass {
  const [deviceClass, setDeviceClass] = useState<DeviceClass>("desktop-keyboard");

  useEffect(() => {
    const update = () => setDeviceClass(detectDeviceClass());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return deviceClass;
}

export function useIsMobileLayout(): boolean {
  const device = useDeviceClass();
  return device === "mobile-touch" || device === "tablet";
}
