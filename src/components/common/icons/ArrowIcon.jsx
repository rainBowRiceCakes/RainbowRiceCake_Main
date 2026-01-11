/**
 * @file src/components/common/icons/ArrowIcon.jsx
 * @description A simple SVG icon for ArrowIcon in mainCS
 * 260111 v1.0.0 sara init
 */

export default function ArrowIcon({ isOpen, size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
      }}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
