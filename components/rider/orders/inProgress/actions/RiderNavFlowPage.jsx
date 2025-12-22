// components/rider/navigation/RiderNavFlowPage.jsx
import "./RiderNavFlowPage.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RiderNavFlowPage({ mode = "pickup" }) {
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const orders = useSelector((state) => state.orders?.orders ?? []);
  const order = useMemo(
    () => orders.find((o) => String(o.orderNo) === String(orderId)),
    [orders, orderId]
  );

  const [toast, setToast] = useState("");

  useEffect(() => {
    if (mode !== "pickup") return;
    if (!location.state?.justAccepted) return;

    const msg = location.state.message || "배달이 시작됐어요!";

    const openId = setTimeout(() => setToast(msg), 0);
    const closeId = setTimeout(() => setToast(""), 1600);

    window.history.replaceState({}, "");

    return () => {
      clearTimeout(openId);
      clearTimeout(closeId);
    };
  }, [location.state, mode]);

  if (!order) {
    return (
      <div style={{ padding: 16 }}>
        <p>주문 정보를 찾을 수 없어요 😭</p>
        <p>orderId: {orderId}</p>
      </div>
    );
  }

  const isPickup = mode === "pickup";

  const phone = isPickup
    ? order.pickupPlacePhone ?? "010-1234-5678"
    : order.destinationHotelPhone ?? "02-123-4567";

  const callLabel = isPickup ? "📞 가게전화" : "📞 호텔전화";
  const guideText = isPickup ? "가게로 이동해주세요" : "호텔로 이동해주세요";

  const placeLabel = isPickup ? "픽업 장소" : "도착 호텔";
  const placeName = isPickup ? order.pickupPlaceName : order.destinationHotelName;

  const primaryBtnText = isPickup ? "픽업 완료" : "전달 완료";

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handlePrimary = () => {
    if (isPickup) {
      // ✅ 상태 변경은 "픽업 사진 업로드 완료"에서만 한다 (DELIVERING)
      navigate(`/rider/${id}/pickup-photo/${order.orderNo}`);
      return;
    }

    // ✅ 전달 완료 -> 전달 사진 업로드 화면으로
    navigate(`/rider/${id}/dropoff-photo/${order.orderNo}`);
  };

  return (
    <div className="rnp-container">
      {isPickup && toast && <div className="rnp-toast">{toast}</div>}

      <div className="rnp-map">
        <div className="rnp-map-placeholder">MAP</div>
      </div>

      <div className="rnp-info">
        <button type="button" className="rnp-call" onClick={handleCall}>
          {callLabel}
        </button>

        <p className="rnp-guide">{guideText}</p>

        <div className="rnp-row">
          <span>{placeLabel}</span>
          <strong>{placeName}</strong>
        </div>

        <div className="rnp-row">
          <span>주문 번호</span>
          <strong>{order.orderNo}</strong>
        </div>

        <div className="rnp-actions">
          <button className="rnp-btn gray">도움요청</button>
          <button className="rnp-btn primary" onClick={handlePrimary}>
            {primaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}
