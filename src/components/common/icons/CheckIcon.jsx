/**
 * @file src/components/common/icons/CheckIcon.jsx
 * @description A simple SVG icon for CheckIcon in promotion section
 * 260111 v1.0.0 sara init
 */

const CheckIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 메인 체크 경로: 진한 블랙 */}
    <path
      d="M8.5 12.5L10.5 14.5L15.5 9.5"
      stroke="#111111"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckIcon;
