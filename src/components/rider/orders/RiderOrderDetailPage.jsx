// components/rider/orders/detail/RiderOrderDetailPage.jsx
import "./RiderOrderDetailPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RiderSubHeader from "../common/RiderSubHeader";
import dayjs from "dayjs";
import { useMemo } from "react";

export default function RiderOrderDetailPage() {
  const navigate = useNavigate();
  const { id, orderId } = useParams();
  
  const orders = useSelector((state) => state.orders?.orders ?? []);

  const order = useMemo(
    () => orders.find((o) => String(o.orderNo) === String(orderId)),
    [orders, orderId]
  );

  if (!order) {
    return (
      <div className="rod-wrap">
        <RiderSubHeader title="상세 확인" />
        <div className="rod-empty">
          <p className="rod-empty-title">주문 정보를 찾을 수 없어요 😭</p>
          <p className="rod-empty-sub">orderId: {orderId}</p>
        </div>
      </div>
    );
  }

  const statusText =
    order.statusLabel ?? (order.status === "COMPLETED" ? "완료" : "진행 중");

  // Helper function for formatting
  const formatDateTime = (dateString) => {
    return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm') : "-";
  }

  return (
    <div className="rod-wrap">
      {/* 상단바(sub header) */}
      <RiderSubHeader title="상세 확인" />
      {/* 카드(contents) */}
      <div className="rod-main">
        <div className="rod-card" aria-label="주문 상세 카드">
          <div className="rod-row">
            <span className="rod-label">주문 상태</span>
            <span className="rod-value">{statusText}</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">주문 번호</span>
            <span className="rod-value rod-mono">{order.orderNo}</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">배송 시작 시간</span>
            <span className="rod-value">{formatDateTime(order.startedAt)}</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">배송 완료 시간</span>
            <span className="rod-value">{formatDateTime(order.completedAt)}</span>
          </div>

          <div className="rod-divider" />

          <div className="rod-row">
            <span className="rod-label">픽업 장소</span>
            <span className="rod-value">{order.pickupPlaceName ?? "-"}</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">전달 장소</span>
            <span className="rod-value">{order.destinationHotelName ?? "-"}</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">배달 금액</span>
            <span className="rod-value">2000원</span> {/* {order.price}원 */}
          {/* 쇼핑백 사이즈 Basic X 1 - 2천원 / Standard X 1 - 3천원 / Plus X 1 - 5천원 */}
          </div> 

          <div className="rod-row">
            <span className="rod-label">쇼핑백 사이즈</span>
            <span className="rod-value">
              {{
                small: "베이직",
                medium: "스탠다드",
                large: "플러스",
              }[order.bagSize] || "-"}
            </span>
          </div>
        </div>

        {/* 버튼 - issue report 페이지로 이동 */}
        <button
            type="button"
            className="rod-issue-btn"
            onClick={() => navigate(`/rider/${id}/orders/${orderId}/issue`)}
            >
            주문에 문제가 생겼나요?
        </button>
      </div>
    </div>
  ); 
}