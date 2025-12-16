/**
 * @file src/components/common/Footer01.jsx
 * @description 푸터
 * 251216 v1.0.0 sara init 
 */

import "./Footer01.css";

export default function Footer01() {
  return (
<div className="footer01-frame">
      <div className="footer01-container footer01-inner-group">
        <div className="footer01-brand-group">
          <div className="footer01-logo-text">BRAND</div>
          <p className="footer01-slogan-text">Fast, Safe, Beyond Delivery</p>
        </div>

        <div className="footer01-links-group">
          <a href="#policy">개인정보처리방침</a>
          <a href="#terms">이용약관</a>
          <a href="#location-terms">위치기반서비스 약관</a>
        </div>

        <div className="footer01-meta-info">
          <p>회사명: 200 OK Co., Ltd.</p>
          <p>사업자 정보: 000-00-00000</p>
          <p>주소: Seoul, KR</p>
          <p className="footer01-muted-text">© {new Date().getFullYear()} BRAND</p>
        </div>
      </div>
    </div>
  );
}
