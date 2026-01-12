import React, { useEffect } from 'react';
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
