/**
 * @file src/components/common/ToastNotification.jsx
 * @description top 버튼 (웹/ 앱 공용) - match PartnerApplyButton01 tone (black + subtle rainbow) with airy opacity
 * 251216 v1.0.0 sara init
 * 260112 v2.0.0 sara update - tone match
 */

import { useEffect } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className="toast-notification">
      {message}
    </div>
  );
};

export default ToastNotification;
