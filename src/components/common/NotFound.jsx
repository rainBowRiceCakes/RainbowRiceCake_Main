import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div>
      {t('notFound')}
    </div>
  );
}