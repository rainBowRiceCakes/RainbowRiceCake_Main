// components/rider/navigation/RiderNavFlowPage.jsx
import "./RiderNavFlowPage.css";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RiderPhotoPage from "./RiderPhotoPage.jsx";
import { orderShowThunk } from "../../../../../store/thunks/orders/orderShowThunk.js";
import KakaoMapView from "./KakaoMapView.jsx";

export default function RiderNavFlowPage() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 1. 모든 State 선언 (최상단)
  const [riderLoc, setRiderLoc] = useState(null);
  const [showPhotoUI, setShowPhotoUI] = useState(false);
  const [toast, setToast] = useState("");

  // 2. Redux 데이터 가져오기
  const order = useSelector((state) => state.ordersDetail?.orderDetail);
  const loading = useSelector((state) => state.ordersDetail?.loading);

  // 3. 변수 계산 (Hook에서 참조할 수 있도록 상단 배치)
  // order가 없을 때를 대비해 옵셔널 체이닝(?.) 사용
  const status = order?.status;
  const isAfterPickup = status === 'pick';

  const targetLoc = useMemo(() => {
    if (!order) return { lat: null, lng: null };
    return isAfterPickup
      ? { lat: order.order_hotel?.lat, lng: order.order_hotel?.lng }
      : { lat: order.order_partner?.lat, lng: order.order_partner?.lng };
  }, [order, isAfterPickup]);

  const placeName = isAfterPickup ? order?.order_hotel?.krName : order?.order_partner?.krName;

  // 4. 위치 갱신 함수
  const refreshLocation = () => {
    if (!navigator.geolocation) {
      setToast("🚫 위치 서비스가 지원되지 않습니다.");
      return;
    }
    setToast("🔄 위치를 갱신 중입니다...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 GPS 수신 성공:", latitude, longitude); // 성공 로그
        setRiderLoc({ lat: latitude, lng: longitude });
        setToast("✅ 위치가 갱신되었습니다.");
        setTimeout(() => {
          setToast("");
        }, 1500);
      },
      (err) => {
        console.error("❌ GPS 에러 상세:", err.code, err.message);
        setTimeout(() => setToast(""), 2000);

        switch (err.code) {
          case 1: setToast("🚫 위치 권한이 거부되었습니다. 설정에서 허용해주세요."); break;
          case 2: setToast("📡 위치 정보를 사용할 수 없습니다. (신호 약함)"); break;
          case 3: setToast("⏳ 위치 정보 요청 시간이 초과되었습니다."); break;
          default: setToast("❌ 알 수 없는 위치 오류가 발생했습니다.");
        }
      },
      {
        enableHighAccuracy: false, // 데스크탑 테스트용
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 5. 모든 useEffect 모음 (조건부 리턴(if)보다 무조건 위에 있어야 함)
  useEffect(() => {
    refreshLocation();
  }, []);

  useEffect(() => {
    if (orderCode) dispatch(orderShowThunk(orderCode));
  }, [orderCode, dispatch]);

  useEffect(() => {
    if (location.state?.justAccepted) {
      const msg = location.state.message || "배달이 시작됐어요!";
      setToast(msg);
      window.history.replaceState({}, "");
      const closeTimer = setTimeout(() => setToast(""), 2000);
      return () => clearTimeout(closeTimer);
    }
  }, [location.pathname, location.state]);

  // 디버깅 로그 (이제 targetLoc이 위에서 정의되어 에러가 나지 않음)
  useEffect(() => {
    if (riderLoc || targetLoc.lat) {
      console.log("📱 Rider GPS:", riderLoc);
      console.log("🏨 Target GPS:", targetLoc);
    }
  }, [riderLoc, targetLoc]);

  // 6. 조건부 리턴 (모든 Hook 선언이 끝난 후 배치)
  if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
  if (!order) return <div style={{ padding: 16 }}>주문 정보를 찾을 수 없어요 😭</div>;

  if (status === "com") {
    return (
      <div className="rnp-container success-view">
        <div className="rpp-success-card">
          <div className="rpp-check">✓</div>
          <p className="rpp-success-text">배달 완료!</p>
          <button className="rnp-btn primary" onClick={() => navigate(`/riders`)}>목록으로 돌아가기</button>
        </div>
      </div>
    );
  }

  if (showPhotoUI) {
    return (
      <RiderPhotoPage
        mode={status === 'mat' ? 'pick' : 'com'}
        order={order}
        onClose={(success) => {
          setShowPhotoUI(false);
          if (success) {
            setToast("📸 사진 업로드 성공!");
            dispatch(orderShowThunk(orderCode));
            setTimeout(() => setToast(""), 3000);
          }
        }}
      />
    );
  }

  // 7. 메인 UI 리턴
  const phone = isAfterPickup
    ? order.order_hotel?.phone ?? "02-123-4567"
    : order.order_partner?.phone ?? "010-1234-5678";
  const guideText = isAfterPickup ? "호텔로 이동해주세요" : "가게로 이동해주세요";
  const placeLabel = isAfterPickup ? "도착 호텔" : "픽업 장소";
  const primaryBtnText = isAfterPickup ? "전달 완료 (사진)" : "픽업 완료 (사진)";

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
            targetName={placeName}
          />
          {/* 위치 새로고침 버튼 */}
          <button
            className="rnp-map-refresh-btn"
            onClick={refreshLocation}
          >
            📍 내 위치 찾기
          </button>
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