// components/rider/navigation/RiderNavFlowPage.jsx
import "./RiderNavFlowPage.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../../../store/slices/ordersSlice";

export default function RiderNavFlowPage({ mode = "pickup" }) {
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders?.orders ?? []);
  const order = useMemo(
    () => orders.find((o) => String(o.orderNo) === String(orderId)),
    [orders, orderId]
  );

  const [toast, setToast] = useState("");

  console.log('Location State:', location.state);
  
  useEffect(() => {
  // 1. state가 존재하는지 확인
  const state = location.state;
  if (state?.justAccepted) {
    const msg = state.message || "배달이 시작됐어요!";

    // 2. 리액트의 현재 렌더링이 완전히 끝난 후 실행되도록 예약
    const timer = setTimeout(() => {
      // 토스트 메시지 설정
      setToast(msg);
      
      // ✅ 여기서 바로 state를 비워주어 뒤로가기 시 재발생 방지
      // 이 시점에선 이미 변수(msg)에 값을 담아뒀으므로 안전합니다.
      window.history.replaceState({}, "");
    }, 10); 

    // 3. 1.6초 뒤 토스트 닫기
    const closeTimer = setTimeout(() => {
      setToast("");
    }, 1610); // openTimer(10ms) 이후부터 1.6초를 맞춤

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }
}, [location.pathname]); // 경로 진입 시 1회 실행

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

  const handleBackToInProgress = () => {
    dispatch(setActiveTab("inProgress"));
    navigate(`/rider/${id}`);
  };

  return (
    <div className="rnp-container">
        <div className="rider-sub-header">
          <button
            type="button"
            className="rider-sub-back"
            onClick={handleBackToInProgress}
            aria-label="진행 목록으로 가기"
          >
            📋
          </button>
          {/* 기존 rod-spacer 역할 */}
          <div className="rider-sub-spacer" />
        </div>
      {toast && <div className="rnp-toast">{toast}</div>}

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
