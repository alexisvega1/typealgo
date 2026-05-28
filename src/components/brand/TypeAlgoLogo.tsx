"use client";

import { useId } from "react";
import clsx from "clsx";

interface TypeAlgoLogoProps {
  size?: number;
  className?: string;
  /** Static mark for favicons / export — no motion classes */
  static?: boolean;
}

/**
 * Yellow typewriter mark — on hover the paper lifts, twirls, and feeds back in.
 */
export function TypeAlgoLogo({ size = 32, className, static: isStatic }: TypeAlgoLogoProps) {
  const uid = useId().replace(/:/g, "");
  const bodyGrad = `ta-body-${uid}`;
  const bodyShine = `ta-body-shine-${uid}`;
  const paperGrad = `ta-paper-${uid}`;
  const paperPath = `ta-paper-path-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("typealgo-logo", isStatic && "typealgo-logo-static", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={bodyGrad} x1="8" y1="14" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5d547" />
          <stop offset="0.45" stopColor="#e2b714" />
          <stop offset="1" stopColor="#a67c00" />
        </linearGradient>
        <linearGradient id={bodyShine} x1="10" y1="16" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={paperGrad} x1="14" y1="4" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#faf8f2" />
          <stop offset="1" stopColor="#e8e4d9" />
        </linearGradient>
        {/* Flight loop anchor — vertical tangent at slot so paper stays upright at rest */}
        <path
          id={paperPath}
          d="M 20 11.5 C 20 2.5 35 1 35 10.5 C 35 18 20 15.5 20 11.5 Z"
          fill="none"
          visibility="hidden"
        />
      </defs>

      <ellipse
        className="logo-glow"
        cx="20"
        cy="22"
        rx="15"
        ry="12"
        fill="#e2b714"
        opacity="0"
      />

      <rect x="5" y="17" width="30" height="17" rx="3.5" fill={`url(#${bodyGrad})`} />
      <rect
        x="5"
        y="17"
        width="30"
        height="8"
        rx="3.5"
        fill={`url(#${bodyShine})`}
        opacity="0.55"
      />
      <rect className="logo-keyboard-well" x="7.5" y="19.5" width="25" height="11.5" rx="2" fill="#141418" opacity="0.92" />

      <g className="logo-keys">
        <rect className="logo-key logo-key-1" x="9.5" y="21" width="3.6" height="2.4" rx="0.55" />
        <rect className="logo-key logo-key-2" x="14.2" y="21" width="3.6" height="2.4" rx="0.55" />
        <rect className="logo-key logo-key-3" x="18.9" y="21" width="3.6" height="2.4" rx="0.55" />
        <rect className="logo-key logo-key-4" x="23.6" y="21" width="3.6" height="2.4" rx="0.55" />
        <rect className="logo-key logo-key-5" x="28.3" y="21" width="2.4" height="2.4" rx="0.55" />
      </g>

      <rect x="9" y="25.2" width="22" height="1.2" rx="0.6" fill="#0d0d0f" opacity="0.35" />
      <circle className="logo-knob" cx="33" cy="26.5" r="2.1" fill="#c9970c" stroke="#f0d060" strokeWidth="0.5" />

      <path
        d="M8 34h24"
        stroke="#a67c00"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Paper — straight in slot at rest; magical lift + twirl on hover */}
      <g className="logo-paper-orbit">
        <g className="logo-paper-spin">
          <path
            d="M13 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V7a1.5 1.5 0 0 1 1-1.5Z"
            fill={`url(#${paperGrad})`}
            className="logo-paper-sheet"
          />
          <path
            d="M13 5.5c0-1.2 2.2-2 7-2s7 .8 7 2"
            stroke="#d4cfc2"
            strokeWidth="0.6"
            fill="none"
          />
          <rect x="15" y="8.5" width="6" height="0.9" rx="0.45" fill="#c9c4b8" opacity="0.85" />
          <rect x="15" y="10.4" width="4.2" height="0.9" rx="0.45" fill="#c9c4b8" opacity="0.6" />
          <rect className="logo-cursor" x="19.4" y="10.1" width="0.85" height="1.5" rx="0.2" fill="#e2b714" />
          <circle className="logo-sparkle logo-sparkle-1" cx="24" cy="3" r="0.65" fill="#f5d547" />
          <circle className="logo-sparkle logo-sparkle-2" cx="27" cy="5" r="0.45" fill="#e2b714" />
          <circle className="logo-sparkle logo-sparkle-3" cx="21" cy="2" r="0.4" fill="#fff" />
        </g>
      </g>

      {/* Slot lip — paper reads as fed through the platen */}
      <rect className="logo-slot-lip" x="10.5" y="15.6" width="19" height="2.4" rx="0.4" fill="#141418" />
      <rect x="10.5" y="15.6" width="19" height="0.6" rx="0.2" fill="#0a0a0c" opacity="0.55" />
    </svg>
  );
}
