import "./Footer01.css";

import "./Footer01.css";

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer__container home-footer__inner">
        <div className="home-footer__brand">
          <div className="home-footer__logo">BRAND</div>
          <p className="home-footer__slogan">Fast, Safe, Beyond Delivery</p>
        </div>

        <div className="home-footer__links">
          <a href="#policy">개인정보처리방침</a>
          <a href="#terms">이용약관</a>
          <a href="#location-terms">위치기반서비스 약관</a>
        </div>

        <div className="home-footer__meta">
          <p>회사명: 200 OK Co., Ltd.</p>
          <p>사업자 정보: 000-00-00000</p>
          <p>주소: Seoul, KR</p>
          <p className="home-footer__muted">© {new Date().getFullYear()} BRAND</p>
        </div>
      </div>
    </footer>
  );
}
