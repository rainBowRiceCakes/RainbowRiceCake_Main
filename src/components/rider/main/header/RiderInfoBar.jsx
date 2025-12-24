// components/rider/main/RiderInfoBar.jsx
import "./RiderInfoBar.css";
import { useNavigate, useParams } from "react-router-dom";

export default function RiderInfoBar() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ /rider/:id 에서 id 가져오기

  const externalImageUrl =
    "https://img.icons8.com/?size=100&id=81021&format=png&color=000000";

  const goMyPage = () => {
    navigate(`/rider/${id}/mypage`);
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
            김민재<span className="rider-info-title">기사님</span>
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
