/**
 * @file src/components/common/FullScreenLoader.jsx
 * @description Full screen loading UI (blank)
 * 260127 v1.0.0 sara init 
 */

import "./FullScreenLoader.css";

export default function FullScreenLoader({ message = "Loading..." }) {
  return (
    <div className="fs-loader">
      <div className="fs-loader__box">
        <div className="fs-loader__spinner" />
        <div className="fs-loader__text">{message}</div>
      </div>
    </div>
  );
}