import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import './CustomAlertModal.css';

const CustomAlertModal = ({ isOpen, onClose, message, title }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="custom-alert-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="custom-alert-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            {title && <h3 className="custom-alert-title">{title}</h3>}
            <p className="custom-alert-message" dangerouslySetInnerHTML={{ __html: message }} />
            <button className="custom-alert-button" onClick={onClose}>
              {t('alertConfirm')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomAlertModal;
