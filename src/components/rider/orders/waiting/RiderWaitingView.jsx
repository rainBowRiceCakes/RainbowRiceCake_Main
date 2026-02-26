// components/rider/main/waiting/RiderWaitingView.jsx
import "./RiderWaitingView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { acceptOrder } from "../../../../store/slices/ordersSlice.js";
import axiosInstance from "../../../../api/axiosInstance.js";
import dayjs from "dayjs";

const RIDER_FEE_RATE = 0.8;

// 날짜 포맷 안전 함수
const formatTime = (value) => {
  if (!value) return "—";
  const d = dayjs(value);
  if (!d.isValid()) return "—";
  return d.format("A hh:mm");
};

// 기사 보수 계산 함수
const calcRiderFee = (price) =>
  Math.floor((Number(price) || 0) * RIDER_FEE_RATE);

export default function RiderWaitingView({
  orders = [],
  ongoingCount // ✅ props로 받기
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const profileData = useSelector((state) => state.profile?.profileData);
  const isWorking = profileData?.isWorking ?? false;

  const MAX_ORDER_LIMIT = 3;
  const isOverLimit = ongoingCount >= MAX_ORDER_LIMIT; // ✅ props 사용

  if (orders.length === 0 && isWorking) {
    return <div className="rw-empty">현재 수락 가능한 오더가 없습니다.</div>;
  }

  const handleOpenModal = (order) => {
    if (!isWorking) return;

    // ✅ 프론트 검증 (UX 개선용)
    if (isOverLimit) {
      alert(`최대 ${MAX_ORDER_LIMIT}개까지만 동시에 배달할 수 있습니다.\n기존 주문을 먼저 완료해주세요!`);
      return;
    }

    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOrder) return;

    const orderCode = selectedOrder.orderCode;

    try {
      const response = await axiosInstance.put(`/api/orders/${orderCode}`);

      dispatch(
        acceptOrder({
          id: orderCode,
          riderId: response.data?.data?.riderId || response.data?.riderId || response.data?.data?.rider_id || response.data?.rider_id,
        })
      );

      navigate(`/riders/orders/${orderCode}/nav`, {
        state: {
          justAccepted: true,
          message: "배달이 시작됐어요 🚴‍♂️",
        },
      });
    } catch (error) {
      // ✅ 백엔드 에러 메시지 표시
      const errorMsg = error.response?.data?.message ||
        error.response?.data?.msg ||
        "주문 수락에 실패했습니다.";
      alert(errorMsg);

      // ✅ 에러 발생 시 페이지 새로고침으로 상태 동기화
      window.location.reload();
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="rider-waiting-view">
      {/* ✅ 3개 제한 경고 */}
      {isWorking && isOverLimit && (
        <div className="rw-status-alert limit-warning">
          <div className="alert-content">
            <span className="icon">⚠️</span>
            <span>
              현재 <strong>{ongoingCount}개</strong>의 주문을 진행 중입니다.
              더 이상 수락할 수 없습니다.
            </span>
          </div>
        </div>
      )}

      {/* 퇴근 상태 안내 */}
      {!isWorking && (
        <div className="rw-status-alert">
          <div className="alert-content">
            <span className="icon">⛔</span>
            <span>현재 <strong>퇴근 상태</strong>입니다.</span>
          </div>

          <button
            className="rw-go-mypage"
            onClick={() => navigate("/riders/mypage")}
          >
            출근하러 가기
          </button>
        </div>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className={`rw-item ${(!isWorking || isOverLimit) ? "rw-disabled" : ""}`}
        >
          <div className="rw-card">
            <div className="rw-left">
              <p className="rw-time">
                접수된 시간: {formatTime(order.createdAt)}
              </p>

              <div className="rw-summary">
                <div className="rw-summary-item">
                  <span className="icon">📦</span>
                  <span>
                    {order.cntS === 1 && '베이직 (쇼핑백 1개)'}
                    {order.cntM === 1 && '스탠다드 (쇼핑백 2개)'}
                    {order.cntL === 1 && '프리미엄 (쇼핑백 3개)'}
                  </span>
                </div>

                <div className="rw-summary-item">
                  <span className="icon">📍</span>
                  <span>
                    {order.order_partner?.krName || "가게"} →{" "}
                    {order.order_hotel?.krName || "호텔"}
                  </span>
                </div>

                <div className="rw-summary-item reward">
                  <span className="icon">💰</span>
                  <span>
                    보수 {calcRiderFee(order.price).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`rw-accept ${(!isWorking || isOverLimit) ? "is-off" : ""}`}
              disabled={!isWorking || isOverLimit}
              onClick={() => handleOpenModal(order)}
            >
              {!isWorking ? "퇴근중" : isOverLimit ? "수락 불가" : "수락"}
            </button>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className="rip-modal-overlay">
          <div className="rip-modal">
            <p className="rip-modal-title">이 오더를 수락하시겠습니까?</p>
            <p className="rip-modal-desc">
              [{selectedOrder?.order_partner?.krName}] → [
              {selectedOrder?.order_hotel?.krName}]
            </p>

            <div className="rip-modal-btns">
              <button
                className="rip-modal-btn cancel"
                onClick={() => setIsModalOpen(false)}
              >
                아니오
              </button>
              <button
                className="rip-modal-btn confirm"
                onClick={handleConfirm}
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}