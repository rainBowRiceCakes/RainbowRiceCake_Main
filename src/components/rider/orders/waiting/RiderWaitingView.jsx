// components/rider/main/waiting/RiderWaitingView.jsx
import { useState } from "react";
import "./RiderWaitingView.css";

export default function RiderWaitingView({ orders, onAccept }) {

  
  // 모달 오픈 여부와 선택된 주문 정보를 관리할 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!orders || orders.length === 0) {
    return <div className="rw-empty">대기 중인 주문이 없습니다</div>;
  }

  // 수락 버튼 클릭 시 모달 열기
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 모달에서 '네' 클릭 시 실행
  const handleConfirm = () => {
    // 부모로부터 받은 onAccept 실행 (필요 시 선택된 주문 전달)
    if (!selectedOrder) return;
    if (onAccept) {onAccept(selectedOrder);}
  
    setIsModalOpen(false);

  // 벡틱(`)과 ${} 문법을 확인하세요!
};

  return (
    <div className="rider-waiting-view">
      {orders.map((order) => (
        <div key={order.orderNo} className="rw-item">
          <div className="rw-card">
            <div className="rw-left">
              <p className="rw-time">
                <span>요청된 시간 </span>
                {order?.requestedAt?.slice?.(11, 16) ?? "-"}
              </p>

              <p className="rw-title">
                {order.pickupPlaceName} → {order.destinationHotelName}
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

      {/* 모달 UI 부분 */}
      {isModalOpen && (
        <div className="rip-modal-overlay">
          <div className="rip-modal">
            <p className="rip-modal-title">이 오더를 수락하시겠습니까?</p>
            <p className="rip-modal-desc">
              [{selectedOrder?.pickupPlaceName}] 오더를 시작합니다.
            </p>
            
            <div className="rip-modal-btns" style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <button
                type="button"
                className="rip-modal-btn cancel"
                onClick={() => setIsModalOpen(false)}
                style={{ flex: 1, backgroundColor: "#f0f0f0", color: "#333" }}
              >
                아니오
              </button>
              <button
                type="button"
                className="rip-modal-btn"
                onClick={handleConfirm}
                style={{ flex: 1 }}
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