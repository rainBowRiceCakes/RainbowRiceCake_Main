// components/rider/mypage/RiderMyPage.jsx
import "./RiderMyPage.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getProfileThunk } from "../../../store/thunks/profile/getProfileThunk.js";
import { logoutThunk } from "../../../store/thunks/authThunk.js";
import { updateWorkStatusThunk } from "../../../store/thunks/riders/updateWorkStatusThunk.js";
import { clearAuth } from "../../../store/slices/authSlice.js";

const externalImageUrl = "https://img.icons8.com/?size=100&id=81021&format=png&color=000000";

export default function RiderMyPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { profileData, isLoading } = useSelector((state) => state.profile);

  const isWorking = profileData?.isWorking || false;
  const userName = profileData?.rider_user?.name || "Guest";

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // 2. 이벤트 핸들러 정의
  const handleToggleWorkStatus = (e) => {
    const nextStatus = e.target.checked;
    dispatch(updateWorkStatusThunk(nextStatus));
  };

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        // 1. 서버 로그아웃 요청 (성공 여부와 관계없이 진행하려면 try-catch)
        await dispatch(logoutThunk()).unwrap();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        // 2. Redux 상태를 먼저 초기화 (인증 정보 제거)
        dispatch(clearAuth());

        // 3. 페이지 이동을 마지막에 수행
        // replace: true를 사용하면 뒤로가기로 다시 마이페이지에 오는 것을 방지합니다.
        nav('/', { replace: true });
      }
    }
  };

  if (isLoading && !profileData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mypage">
      {/* 상단 프로필 영역 */}
      <div className="header">
        <div className="profile">
          <div className="avatar" style={{ backgroundImage: `url("${externalImageUrl}")` }} />
          <div className="info">
            <div className="name">{userName}<span className="rider-info-sub-title">기사님</span></div> {/* 추후 수정 {user.name} */}
          </div>

          <label className="clockInAndOutToggle"> {/* 기사들의 출근 on and off 기능 */}
            <input type="checkbox" checked={isWorking} onChange={handleToggleWorkStatus} />
            <span className="clockInAndOutToggleUi" />
          </label>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="menu">
        <div className="mypageSection">
          <button className="navigation" onClick={() => nav(`/riders/mypage/profile`)}>
            <span className="icon">👤</span>
            <span className="label">내 정보</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/riders/mypage/settlement`)}>
            <span className="icon">💸</span>
            <span className="label">정산 내역</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/riders/mypage/orders`)}>
            <span className="icon">🕘</span>
            <span className="label">배송 히스토리</span>
            <span className="chev">›</span>
          </button>
        </div>

        <div className="mypageSection">
          <button className="navigation" onClick={() => nav(`/riders/mypage/help`)}>
            <span className="icon">✅</span>
            <span className="label">고객센터</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/riders/mypage/inquiry`)}>
            <span className="icon">❓</span>
            <span className="label">내 문의 내역</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/riders/mypage/notices`)}>
            <span className="icon">📢</span>
            <span className="label">공지사항</span>
            <span className="chev">›</span>
          </button>

        </div>

        <div className="mypageSection">
          <button className="navigation navigationLogout" onClick={handleLogout}>
            <span className="icon iconLogout">🚪</span>
            <span className="label">로그아웃</span>
            <span className="chev">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
