// components/rider/main/waiting/RiderWaitingView.jsx
import "./RiderWaitingView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { acceptOrder } from "../../../../store/slices/ordersSlice.js";
import axiosInstance from "../../../../api/axiosInstance.js";
import dayjs from "dayjs";

export default function RiderWaitingView({ orders = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (order) => {
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
    return <div className="rw-empty">내역이 없습니다.</div>;
  }

  return (
    <div className="rider-waiting-view">
      {orders.map((order) => (
        <div key={order.id} className="rw-item">
          <div className="rw-card">
            <div className="rw-left">
              <p className="rw-time">
                접수된 시간: {dayjs(order.createdAt).format("A hh:mm")}
              </p>
              <div className="rw-summary">
                <div className="rw-summary-item">
                  <span className="icon">📦</span>
                  <span>
                    쇼핑백 {order.cntS + order.cntM + order.cntL}개
                  </span>
                </div>

                <div className="rw-summary-item reward">
                  <span className="icon">📍</span>
                  <span>
                    {order.order_partner?.krName || "가게"} → {" "}
                    {order.order_hotel?.krName || "호텔"}
                  </span>
                </div>

                <div className="rw-summary-item reward">
                  <span className="icon">💰</span>
                  <span>보수 {order.price.toLocaleString()}원</span>
                </div>
              </div>
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
              <button className="rip-modal-btn confirm" onClick={handleConfirm}>
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}