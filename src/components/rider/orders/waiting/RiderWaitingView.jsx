// components/rider/main/waiting/RiderWaitingView.jsx
import "./RiderWaitingView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { acceptOrder } from "../../../../store/slices/ordersSlice.js";
import axiosInstance from "../../../../api/axiosInstance.js";
import dayjs from "dayjs";

export default function RiderWaitingView({ orders = [], onAccept }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 수락 버튼 클릭 시 모달 열기
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 모달 확인 클릭
  const handleConfirm = async () => {
    if (!selectedOrder) return;

    const onAccept = async (orderId, riderId) => {
      console.log('🚀 accept order:', orderId);
      await axiosInstance.post(`/api/orders/${orderId}`); // 서버 상태 변경
      dispatch(
        acceptOrder({
          id: orderId,
          riderId: riderId,
        })
      );
    };

    // ✅ 기존 수락 로직 유지 (API 호출이 있다면)
    if (onAccept) {
      await onAccept(selectedOrder.id);
    }

    // ✅ RiderNavFlowPage로 이동
    navigate(`/riders/${selectedOrder.id}/nav`, {
      state: {
        justAccepted: true,
        message: "배달이 시작됐어요 🚴‍♂️"
      }
    });

    setIsModalOpen(false);
  };

  if (orders.length === 0) {
    return <div className="rw-empty">내역이 없습니다.</div>;
  }

  return (
    <div className="rider-waiting-view">
      {orders.map((order) => (
        <div key={order.id} className="rw-item">
          <div className="rw-card">
            <div className="rw-left">
              <p className="rw-time">
                <span>요청 시간: </span>
                {dayjs(order.createdAt).format('A hh:mm')}
              </p>
              {/* TODO: 어떤게 제일 따끈따끈한 신 오더인지 알아보게 좀 하자 ㅠㅠ */}
              <p className="rw-title">
                {order.order_partner?.krName || "가게"} → {order.order_hotel?.krName || "호텔"}
              </p>
            </div>

            <button
              type="button"
              className="rw-accept"
              onClick={() => handleOpenModal(order)}
            >
              수락
            </button>
          </div>
        </div>
      ))}

      {/* 모달 UI */}
      {isModalOpen && (
        <div className="rip-modal-overlay">
          <div className="rip-modal">
            <p className="rip-modal-title">이 오더를 수락하시겠습니까?</p>
            <p className="rip-modal-desc">
              [{selectedOrder?.order_partner?.krName}] → [{selectedOrder?.order_hotel?.krName}] 오더를 시작합니다.
            </p>

            <div className="rip-modal-btns" style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <button
                type="button"
                className="rip-modal-btn cancel"
                onClick={() => setIsModalOpen(false)}
                style={{ flex: 1, backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "8px", padding: "12px" }}
              >
                아니오
              </button>
              <button
                type="button"
                className="rip-modal-btn"
                onClick={handleConfirm}
                style={{ flex: 1, backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "8px", padding: "12px" }}
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