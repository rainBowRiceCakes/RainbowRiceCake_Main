// components/rider/navigation/RiderNavFlowPage.jsx
import "./RiderNavFlowPage.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RiderPhotoPage from "./RiderPhotoPage.jsx";

export default function RiderNavFlowPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const orders = useSelector((state) => state.orders?.orders ?? []);
  const order = useMemo(() => orders.find(o => String(o.id) === String(orderId)), [orders, orderId]);

  const [showPhotoUI, setShowPhotoUI] = useState(false);
  const [toast, setToast] = useState("");

  // 토스트 메시지 로직
  useEffect(() => {
    if (location.state?.justAccepted) {
      const msg = location.state.message || "배달이 시작됐어요!";
      const timer = setTimeout(() => {
        setToast(msg);
        window.history.replaceState({}, "");
      }, 10);
      const closeTimer = setTimeout(() => setToast(""), 1610);
      return () => { clearTimeout(timer); clearTimeout(closeTimer); };
    }
  }, [location.pathname, location.state]);

  if (!order) return <div style={{ padding: 16 }}>주문 정보를 찾을 수 없어요 😭</div>;

  const status = order.status; // mat | pick | com

  // 1. 배달 완료 화면 (com)
  if (status === "com") {
    return (
      <div className="rnp-container success-view">
        <div className="rpp-success-card">
          <div className="rpp-check">✓</div>
          <p className="rpp-success-text">배달 완료!</p>
          <button className="rnp-btn primary" onClick={() => navigate(`/riders`)}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 2. 사진 촬영 화면 (모달/오버레이 개념)
  // mat 상태에서 버튼 클릭 시 'pick' 전송용, pick 상태에서 클릭 시 'com' 전송용
  if (showPhotoUI) {
    return (
      <RiderPhotoPage
        mode={status === 'mat' ? 'pick' : 'com'}
        order={order}
        onClose={() => setShowPhotoUI(false)}
      />
    );
  }

  // 3. 이동 중 화면 (Navigation)
  const isAfterPickup = status === 'pick'; // pick이면 이미 물건 들고 호텔 가는 중

  const phone = isAfterPickup
    ? order.order_hotel?.phone ?? "02-123-4567"
    : order.order_partner?.phone ?? "010-1234-5678";

  const guideText = isAfterPickup ? "호텔로 이동해주세요" : "가게로 이동해주세요";
  const placeLabel = isAfterPickup ? "도착 호텔" : "픽업 장소";
  const placeName = isAfterPickup ? order.order_hotel?.krName : order.order_partner?.krName;
  const primaryBtnText = isAfterPickup ? "전달 완료 (사진)" : "픽업 완료 (사진)";

  return (
    <div className="rnp-container">
      <div className="rider-sub-header">
        <button className="rider-sub-back" onClick={() => navigate(`/riders`)}>📋</button>
        <div className="rider-sub-spacer" />
      </div>

      {toast && <div className="rnp-toast">{toast}</div>}

      <div className="rnp-map">
        <div className="rnp-map-placeholder">{isAfterPickup ? "HOTEL MAP" : "PARTNER MAP"}</div>
      </div>

      <div className="rnp-info">
        <button className="rnp-call" onClick={() => window.location.href = `tel:${phone}`}>
          📞 {isAfterPickup ? "호텔" : "가게"}전화
        </button>
        <p className="rnp-guide">{guideText}</p>
        <div className="rnp-row"><span>{placeLabel}</span><strong>{placeName}</strong></div>
        <div className="rnp-row"><span>주문 번호</span><strong>{order.id}</strong></div>

        <div className="rnp-actions">
          <button className="rnp-btn gray">도움요청</button>
          <button className="rnp-btn primary" onClick={() => setShowPhotoUI(true)}>
            {primaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}