// components/rider/main/waiting/RiderWaitingView.jsx
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import "./RiderWaitingView.css";

export default function RiderWaitingView({ orders = [], currentTab, onAccept }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. 오늘 날짜 데이터만 필터링 후, 현재 탭 상태에 맞춰 한 번 더 필터링
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 탭 상태 매칭 (날짜 필터링은 부모 컴포넌트에서 이미 처리됨)
      if (currentTab === "waiting") return order.statusCode === "REQ";
      if (currentTab === "inProgress") return order.statusCode === "PICK";
      if (currentTab === "completed") return order.statusCode === "COM";

      return false;
    });
  }, [orders, currentTab]);

  // 수락 버튼 클릭 시 모달 열기
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 모달 확인 클릭
  const handleConfirm = () => {
    if (!selectedOrder) return;
    if (onAccept) onAccept(selectedOrder.orderNo);
    setIsModalOpen(false);
  };

  if (filteredOrders.length === 0) {
    return <div className="rw-empty">내역이 없습니다.</div>;
  }

  return (
    <div className="rider-waiting-view">
      {filteredOrders.map((order) => (
        <div key={order.orderNo} className="rw-item">
          <div className="rw-card">
            <div className="rw-left">
              <p className="rw-time">
                <span>요청 시간 </span>
                {/* dayjs로 포맷팅하면 더 안정적입니다 */}
                {order.createdAt ? dayjs(order.createdAt).format("HH:mm") : "-"}
              </p>

              <p className="rw-title">
                {order.pickupPlaceName} → {order.destinationHotelName}
              </p>
            </div>

            {/* 대기 중(waiting) 탭일 때만 수락 버튼 노출 */}
            {currentTab === "waiting" && (
              <button
                type="button"
                className="rw-accept"
                onClick={() => handleOpenModal(order)}
              >
                수락
              </button>
            )}
          </div>
        </div>
      ))}

      {/* 모달 UI */}
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