// components/rider/account/myPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import "./MyPage.css";

const externalImageUrl = "https://img.icons8.com/?size=100&id=81021&format=png&color=000000";

export default function MyPage() {
  const nav = useNavigate();
  const { riderId } = useParams();

  return (
    <div className="mypage">
      {/* 상단 프로필 영역 */}
      <div className="header">
        <div className="profile">
          <div className="avatar" style={{ backgroundImage: `url("${externalImageUrl}")` }} />
          <div className="info">
            <div className="name">김민재<span className="rider-info-sub">기사님</span></div> {/* 추후 수정 {user.name} */}
          </div>

          <label className="clockInAndOutToggle"> {/* 기사들의 출근 on and off 기능 */}
            <input type="checkbox" defaultChecked />
            <span className="clockInAndOutToggleUi" />
          </label>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <main className="menu">
        <section className="mypageSection">
          <button className="navigation" onClick={() => nav(`/rider/${riderId}/account/profile`)}>
            <span className="icon">👤</span>
            <span className="label">내 정보 수정</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/rider/${riderId}/account/settlement`)}>
            <span className="icon">💸</span>
            <span className="label">정산</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/rider/${riderId}/history`)}>
            <span className="icon">🕘</span>
            <span className="label">배송 히스토리</span>
            <span className="chev">›</span>
          </button>
        </section>

        <section className="mypageSection">
          <button className="navigation" onClick={() => nav(`/rider/${riderId}/account/help`)}>
            <span className="icon">✅</span>
            <span className="label">도움말 / 문의하기</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/rider/${riderId}/account/policy`)}>
            <span className="icon">✅</span>
            <span className="label">정책</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/rider/${riderId}/account/notices`)}>
            <span className="icon">📢</span>
            <span className="label">공지사항</span>
            <span className="chev">›</span>
          </button>
        </section>

        <section className="mypageSection">
          <button className="navigation navigationLogout" onClick={() => nav("/logout")}>
            <span className="icon iconLogout">🚪</span>
            <span className="label">로그아웃</span>
            <span className="chev">›</span>
          </button>
        </section>
      </main>
    </div>
  );
}
