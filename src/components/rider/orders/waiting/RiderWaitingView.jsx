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

// 기사 보수 계산
const calcRiderFee = (price) =>
  Math.floor((Number(price) || 0) * RIDER_FEE_RATE);

export default function RiderWaitingView({ orders = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const profileData = useSelector((state) => state.profile?.profileData);
  const isWorking = profileData?.rider_user?.isWorking ?? false;

  const handleOpenModal = (order) => {
    if (!isWorking) return;
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
          riderId: response.data?.data?.riderId || response.data?.riderId,
        })
      );

      navigate(`/riders/orders/${orderCode}/nav`, {
        state: {
          justAccepted: true,
          message: "배달이 시작됐어요 🚴‍♂️",
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || "주문 수락에 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  if (orders.length === 0) {
    return <div className="rw-empty">현재 수락 가능한 오더가 없습니다.</div>;
  }

  return (
    <div className="rider-waiting-view">
      {/* 퇴근 상태 안내 */}
      {!isWorking && (
        <div className="rw-status-alert">
          {/* 아이콘과 텍스트를 묶어주는 덩어리 */}
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
          className={`rw-item ${!isWorking ? "rw-disabled" : ""}`}
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
                    쇼핑백 {order.cntS + order.cntM + order.cntL}개
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
              className={`rw-accept ${!isWorking ? "is-off" : ""}`}
              disabled={!isWorking}
              onClick={() => handleOpenModal(order)}
            >
              {isWorking ? "수락" : "퇴근중"}
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