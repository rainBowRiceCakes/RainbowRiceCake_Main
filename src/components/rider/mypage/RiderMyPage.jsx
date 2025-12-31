// components/rider/mypage/RiderMyPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import { getProfileThunk } from "../../../store/thunks/profile/getProfileThunk.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "./RiderMyPage.css";

const externalImageUrl = "https://img.icons8.com/?size=100&id=81021&format=png&color=000000";

export default function RiderMyPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { id } = useParams();

  const profileData = useSelector((state) => state.profile?.profileData);
  const profile = profileData?.rider_user;

  useEffect(() => {
    if (!profile) {
      dispatch(getProfileThunk());
    }
  }, [dispatch, profile]);

  return (
    <div className="mypage">
      {/* 상단 프로필 영역 */}
      <div className="header">
        <div className="profile">
          <div className="avatar" style={{ backgroundImage: `url("${externalImageUrl}")` }} />
          <div className="info">
            <div className="name">{profile?.name || "Guest"}<span className="rider-info-sub-title">기사님</span></div> {/* 추후 수정 {user.name} */}
          </div>

          <label className="clockInAndOutToggle"> {/* 기사들의 출근 on and off 기능 */}
            <input type="checkbox" defaultChecked />
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

          <button className="navigation" onClick={() => nav(`/riders/mypage/history`)}>
            <span className="icon">🕘</span>
            <span className="label">배송 히스토리</span>
            <span className="chev">›</span>
          </button>
        </div>

        <div className="mypageSection">
          <button className="navigation" onClick={() => nav(`/riders/mypage/help`)}>
            <span className="icon">✅</span>
            <span className="label">자주 묻는 질문</span>
            <span className="chev">›</span>
          </button>

          <button className="navigation" onClick={() => nav(`/riders/mypage/notices`)}>
            <span className="icon">📢</span>
            <span className="label">공지사항</span>
            <span className="chev">›</span>
          </button>
        </div>

        <div className="mypageSection">
          <button className="navigation navigationLogout" onClick={() => nav("/logout")}>
            <span className="icon iconLogout">🚪</span>
            <span className="label">로그아웃</span>
            <span className="chev">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
