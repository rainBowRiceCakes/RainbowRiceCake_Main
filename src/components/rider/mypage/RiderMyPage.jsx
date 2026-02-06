// components/rider/mypage/RiderMyPage.jsx
import "./RiderMyPage.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getProfileThunk } from "../../../store/thunks/profile/getProfileThunk.js";
import { logoutThunk } from "../../../store/thunks/authThunk.js";
import { updateWorkStatusThunk } from "../../../store/thunks/riders/updateWorkStatusThunk.js";
import { clearAuth } from "../../../store/slices/authSlice.js";
import rider_icon from "/resource/rider_icon.png?url";

export default function RiderMyPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { isLoggedIn, isAuthChecked } = useSelector((state) => state.auth);
  const { profileData, isLoading } = useSelector((state) => state.profile);

  // isWorking이 rider_user 안에 있거나, profileData 최상위에 있을 수 있음 (구조 불일치 대응)
  const isWorking = profileData?.rider_user?.isWorking ?? profileData?.isWorking ?? false;
  const userName = profileData?.rider_user?.name || "Guest";

  const [showModal, setShowModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [modalType, setModalType] = useState(null); // "in" | "out"

  useEffect(() => {
    // 로그인 상태라면 프로필 정보 호출 (토큰 갱신은 인터셉터가 담당)
    if (isLoggedIn) {
      dispatch(getProfileThunk());
    }
  }, [dispatch, isLoggedIn]);

  const handleToggleWorkStatus = async () => {
    const next = !isWorking;

    try {
      await dispatch(updateWorkStatusThunk(next)).unwrap();

      setModalType(next ? "in" : "out");
      setShowModal(true);
      setFadeOut(false);

      setTimeout(() => setFadeOut(true), 2000);
      setTimeout(() => setShowModal(false), 2600);
    } catch (e) {
      alert("서버 통신에 실패했습니다. 현재 출퇴근 상태가 반영되지 않았습니다.");
      console.error("Critical Error:", e);
    }
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
    return <div></div>;
  }

  if (!isAuthChecked) {
    return <div className="mypage-loading">로그인 확인 중...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="mypage">
      {/* 상단 프로필 영역 */}
      <div className="header">
        <div className="profile">
          <div className="avatar" style={{ backgroundImage: `url("${rider_icon}")` }} />
          <div className="info">
            <div className="name">{userName}<span className="rider-info-sub-title">기사님</span></div> {/* 추후 수정 {user.name} */}
          </div>

          <label className="clockInAndOutToggle">
            {!isAuthChecked ? (
              <div className="toggle-placeholder">
                <span className="mini-loader-inside" />
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={isWorking}
                  onChange={handleToggleWorkStatus}
                  disabled={isLoading}
                />
                <span className="clockInAndOutToggleUi" />
                {isLoading && <div className="mini-loader" title="처리 중..." />}
                {showModal && (
                  <div className={`modal ${modalType} ${fadeOut ? "fade-out" : "fade-in"}`}>
                    {modalType === "in" ? "출근이 되었습니다" : "퇴근이 완료되었습니다"}
                  </div>
                )}
              </>
            )}
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
