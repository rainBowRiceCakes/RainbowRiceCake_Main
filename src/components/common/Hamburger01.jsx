/**
 * @file src/components/common/Hamburger01.jsx
 * @description hamburger menu
 * 251217 v1.0.0 sara init 
 */

import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import './Hamburger01.css';

export default function Hamburger01({ navItems, goSection }) {
  const { t } = useContext(LanguageContext);

  return (
    // 1. 전체 네비게이션 메뉴를 감싸는 컨테이너입니다.
    <nav className="hamburger01-nav">
      {/* 2. 상위 컴포넌트로부터 받은 navItems 배열을 순회하며 각 메뉴 항목을 생성합니다. */}
      {navItems.map((item) => (
        // 3. 각 메뉴 항목 링크입니다. 클릭 시 기본 동작(페이지 이동)을 막고 goSection 함수를 호출합니다.
        <a 
          key={item.id} 
          href={`#${item.id}`} 
          onClick={(e) => {
            e.preventDefault();
            goSection(item.id);
          }} 
          className="hamburger01-nav-item"
        >
          {/* 4. 아이콘을 표시하는 영역입니다. */}
          <div className="hamburger01-nav-icon">
            {/* 사용자가 제공할 아이콘 이미지를 렌더링합니다. */}
            <img src={`/src/assets/resource/nav-icons/${item.icon}`} alt="" />
          </div>
          {/* 5. 메뉴 항목의 텍스트(레이블)입니다. 다국어 지원을 위해 t 함수를 사용합니다. */}
          <span className="hamburger01-nav-label">{t(item.key)}</span>
        </a>
      ))}
    </nav>
  );
}