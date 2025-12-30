export default function TrashBinBoldShort({ size = 22, color = "currentColor", strokeWidth = 13, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <g transform="scale(1, 0.8) translate(0, 32)">
        {/* handle */}
        <path
          d="M92 66c10-18 22-26 36-26s26 8 36 26"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* lid */}
        <path
          d="M56 86h144"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* bin body (rounded bottom) */}
        <path
          d="M78 96l10 116c1 12 10 20 22 20h36c12 0 21-8 22-20l10-116"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* inner lines */}
        <path d="M108 128v58" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M128 122v70" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M148 128v58" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </g>
    </svg>
  );
}