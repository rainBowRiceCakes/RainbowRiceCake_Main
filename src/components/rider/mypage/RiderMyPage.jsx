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
      await dispatch(logoutThunk());
      nav('/');         // 2. 로그인 화면으로 이동
      dispatch(clearAuth()); // 1. Redux 상태 초기화  
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
            <span className="label">문의하기</span>
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
