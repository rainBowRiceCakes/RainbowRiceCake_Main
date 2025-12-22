// components/rider/orders/detail/RiderOrderDetailPage.jsx
import "./RiderOrderDetailPage.css";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RiderSubHeader from "../common/RiderSubHeader";

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

  return (
    <div className="rod-wrap">
      {/* 상단바 */}
      <RiderSubHeader title="상세 확인" />
      {/* 카드 */}
      <main className="rod-main">
        <section className="rod-card" aria-label="주문 상세 카드">
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
            <span className="rod-value">{order.startedAt ?? "-"}</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">배송 완료 시간</span>
            <span className="rod-value">{order.completedAt ?? "-"}</span>
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
            <span className="rod-label">쇼핑백 갯수</span>
            <span className="rod-value">{order.bagCount ?? "-"}개</span>
          </div>

          <div className="rod-row">
            <span className="rod-label">쇼핑백 사이즈</span>
            <span className="rod-value">
              {order.bagSize
                ? String(order.bagSize).charAt(0).toUpperCase() +
                  String(order.bagSize).slice(1)
                : "-"}
            </span>
          </div>
        </section>

        {/* 버튼 */}
        <button
            type="button"
            className="rod-issue-btn"
            onClick={() => navigate(`/rider/${id}/orders/${orderId}/issue`)}
            >
            주문에 문제가 생겼나요?
        </button>
      </main>
    </div>
  );
}