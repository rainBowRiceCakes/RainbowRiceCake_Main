import React from 'react';
import { FaDollarSign, FaStar } from 'react-icons/fa6'; // Added FaDollarSign

const HamburgerIcon = ({ icon }) => {
  const svgProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 24 24",
    fill: "none", // Default for stroked icons
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (icon) {
    case 'plans':
      return <FaDollarSign {...svgProps} fill="currentColor" stroke="none" />; // Used FaDollarSign, explicitly set fill and stroke
    case 'promotion':
      return <FaStar {...svgProps} fill="currentColor" stroke="none" />; // Explicitly set fill and stroke
    case 'info':
      return (
        <svg {...svgProps} fill="currentColor">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2"/>
          <path d="M12 10.5v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7.5" r="1" fill="currentColor"/>
        </svg>
      );
    case 'search':
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
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z" fill="currentColor"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z" fill="currentColor"></path>
            </svg>
        );
    default:
      return null;
  }
};

export default HamburgerIcon;
