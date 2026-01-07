// components/rider/main/RiderInfoBar.jsx
import "./RiderInfoBar.css";
import { getProfileThunk } from "../../../../store/thunks/profile/getProfileThunk.js";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function RiderInfoBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const profileData = useSelector((state) => state.profile?.profileData);
  const profile = profileData?.rider_user;

  useEffect(() => {
    if (!profile) {
      dispatch(getProfileThunk());
    }
  }, [dispatch, profile]);

  const externalImageUrl =
    "https://img.icons8.com/?size=100&id=81021&format=png&color=000000";

  const goMyPage = () => {
    navigate(`/riders/mypage`);
  };

  return (
    <section className="rider-info-bar">
      <div className="rider-info-left">
        <div
          className="rider-info-avatar"
          style={{ backgroundImage: `url("${externalImageUrl}")` }}
        />
        <div className="rider-info-text">
          <p className="rider-info-sub">오늘도 화이팅!</p>
          <p className="rider-info-name">
            {profile?.name || "Guest"}<span className="rider-info-title">기사님</span>
          </p>
        </div>
      </div>

      <div className="rider-info-right">
        <button
          type="button"
          className="rider-info-profile-btn"
          onClick={goMyPage}
          aria-label="마이페이지로 이동"
        >
          👤
        </button>
      </div>
    </section>
  );
}

// TODO: 더미 데이터랑 연결하기!!
// {/* {user?.name ? `${user.name}` : "라이더"} */}
// backgroundImage: `url(${user?.profileImage || "/default.png"})`,
