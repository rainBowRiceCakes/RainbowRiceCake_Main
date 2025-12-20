import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import './CardNav.css';

export default function CardNav({ navItems, goSection }) {
  const { t } = useContext(LanguageContext);
  const icons = { info: '💡', search: '📍', fee: '💳', dlvs: '🚚', cs: '📞', ptns: '🤝' };
  return (
    <div className="card-nav-grid">
      {navItems.map((item) => (
        <div key={item.id} className="card-nav-item" onClick={() => goSection(item.id)}>
          <div className="card-nav-icon-placeholder">{icons[item.id]}</div>
          <div className="card-nav-label">{t(item.key)}</div>
        </div>
      ))}
    </div>
  );
}