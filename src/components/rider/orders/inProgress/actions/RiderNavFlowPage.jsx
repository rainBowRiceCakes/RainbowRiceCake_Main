// components/rider/navigation/RiderNavFlowPage.jsx
import "./RiderNavFlowPage.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RiderPhotoPage from "./RiderPhotoPage.jsx";
import { orderShowThunk } from "../../../../../store/thunks/orders/orderShowThunk.js";
import KakaoMapView from "./kakaoMapView.jsx";

export default function RiderNavFlowPage() {
  const { orderCode } = useParams(); // ✅ Route에서 :orderCode로 정의됨
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [riderLoc, setRiderLoc] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setRiderLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("GPS 위치를 가져올 수 없습니다:", err),
      { enableHighAccuracy: true } // 높은 정확도 모드
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ✅ ordersDetail에서 주문 정보 가져오기 (orderShowThunk 사용)
  const order = useSelector((state) => state.ordersDetail?.orderDetail);
  const loading = useSelector((state) => state.ordersDetail?.loading);
  console.log('📦 order 정보:', order, 'orderCode:', orderCode);

  const [showPhotoUI, setShowPhotoUI] = useState(false);
  const [toast, setToast] = useState("");

  // ✅ 주문 상세 정보 가져오기
  useEffect(() => {
    if (orderCode) {
      dispatch(orderShowThunk(orderCode));
    }
  }, [orderCode, dispatch]);

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

  // 로딩 중
  if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;

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
        // ✅ success 파라미터를 받아서 처리
        onClose={(success) => {
          setShowPhotoUI(false);
          if (success) {
            // 💡 가벼운 알림 메시지 세팅
            setToast("📸 사진 업로드 성공! 이제 호텔로 출발하세요.");

            dispatch(orderShowThunk(orderCode));

            // 3초 뒤 토스트 사라지게 함 (기존 로직이 있다면 활용)
            setTimeout(() => setToast(""), 3000);
          }
        }}
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
  const targetLoc = isAfterPickup
    ? { lat: order.order_hotel?.lat, lng: order.order_hotel?.lng }
    : { lat: order.order_partner?.lat, lng: order.order_partner?.lng };
  const primaryBtnText = isAfterPickup ? "전달 완료 (사진)" : "픽업 완료 (사진)";
  const targetName = isAfterPickup ? "호텔 도착" : "가게 픽업";

  return (
    <div className="rnp-container">
      <div className="rider-sub-header">
        <button className="rider-sub-back" onClick={() => navigate(`/riders`)}>📋</button>
        <div className="rider-sub-spacer" />
      </div>

      {toast && <div className="rnp-toast">{toast}</div>}

      <div className="rnp-map">
        <div className="rnp-map-area">
          <KakaoMapView
            riderLoc={riderLoc}
            targetLoc={targetLoc}
            targetName={targetName}
          />
        </div>
      </div>

      <div className="rnp-info">
        <button className="rnp-call" onClick={() => window.location.href = `tel:${phone}`}>
          📞 {isAfterPickup ? "호텔" : "가게"}전화
        </button>
        <p className="rnp-guide">{guideText}</p>
        <div className="rnp-row"><span>{placeLabel}</span><strong>{placeName}</strong></div>
        <div className="rnp-row"><span>주문 번호</span><strong>#{orderCode?.slice(-4)}</strong></div>

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