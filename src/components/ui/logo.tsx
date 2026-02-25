"use client";

/**
 * CekCV.Ai logo – stylized "CV" letters with a checkmark accent.
 * Clean, professional design using the brand gradient.
 */
export function CekCVLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = { sm: 22, md: 30, lg: 40 }[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CekCV.Ai logo"
    >
      <defs>
        <linearGradient id="cekcv-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill="url(#cekcv-g)" />
      {/* "CV" letterforms */}
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="20"
        fill="white"
        letterSpacing="-0.5"
      >
        CV
      </text>
    </svg>
  );
}
