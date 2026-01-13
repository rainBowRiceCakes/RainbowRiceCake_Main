/**
 * @file src/components/common/NotFound.jsx
 * @description 404 파일 
 * 251229 v1.1.0 sara init
 */

import { useTranslation } from '../../context/LanguageContext';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div>
      {t('notFound')}
    </div>
  );
}