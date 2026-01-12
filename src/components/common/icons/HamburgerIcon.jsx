/**
 * @file src/components/common/icons/HamburgerIcon.jsx
 * @description A simple SVG icon for HamburgerIcons
 * 260110 v1.0.0 sara init
 */

const HamburgerIcon = ({ icon }) => {
  const svgProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };


switch (icon) {
    case 'plans':
      return (
        <svg {...svgProps}>
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      );
    case 'promotion':
      return (
        <svg {...svgProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    case 'info':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="12" y1="7" x2="12.01" y2="7" />
        </svg>
      );
    case 'search': // Branches 아이콘으로 보임
      return (
        <svg {...svgProps}>
          <path d="M12 21s6-4.7 6-10a6 6 0 1 0-12 0c0 5.3 6 10 6 10Z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      );
    case 'cs':
      return (
        <svg {...svgProps}>
          <path d="M6 11a6 6 0 0 1 12 0" />
          <path d="M7 12v4a2 2 0 0 0 2 2h1v-7H9a2 2 0 0 0-2 2Z" />
          <path d="M17 12v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z" />
          <path d="M10.5 18.5c.6.7 1.4 1 2.3 1 1.6 0 2.8-.9 2.8-2" />
        </svg>
      );
    case 'ptns':
      return (
        <svg {...svgProps}>
          <path d="M8 12l2-2a3 3 0 0 1 4 0l2 2" />
          <path d="M4 13l3.5-3.5 4.5 4.5-3.5 3.5L4 13Z" />
          <path d="M20 13l-3.5-3.5-4.5 4.5 3.5 3.5L20 13Z" />
        </svg>
      );
    case 'dlvs':
        return (
            <svg {...svgProps}>
                <path d="M4 8h10v10H4V8Z" />
                <path d="M14 11h4l2 2v5h-6v-7Z" />
                <circle cx="7" cy="19" r="1.5" />
                <circle cx="17" cy="19" r="1.5" />
                <path d="M7 12h4" />
            </svg>
        );
    case 'mypage':
        return (
            <svg {...svgProps} fill="none">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
        );
    default:
      return null;
  }
};

export default HamburgerIcon;