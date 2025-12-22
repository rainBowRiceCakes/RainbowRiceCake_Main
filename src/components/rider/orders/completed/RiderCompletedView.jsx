// components/rider/main/completed/RiderCompletedView.jsx
import { useNavigate, useParams } from "react-router-dom";
import "./RiderCompletedView.css";
import RiderOrderDetailPage from "../RiderOrderDetailPage.jsx";

function CompletedOrderRow({ order }) {
  const timeText = order?.completedAt?.slice(11, 16) ?? "--:--";
  // const navigate = useNavigate();
  // const { id, orderId } = useParams();

  // const order = useMemo(
  //     () => orders.find((o) => String(o.orderNo) === String(orderId)),
  //     [orders, orderId]
  //   );

  return (
    <button
      type="button"
      className="cor-row"
      // onClick={() => navigate(`/rider/${id}/orders/${orderId}/`)}
    >
      <div className="cor-left">
        <p className="cor-time">
          <span>완료된 시간 </span>
          {timeText}
        </p>
        <p className="cor-title">
          {order.pickupPlaceName} → {order.destinationHotelName}
        </p>
      </div>
      <span className="cor-chevron" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

export default function RiderCompletedView({ orders = [] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBackToCompleted = () => {
    // state에 activeTab 정보를 담아서 보냅니다.
    navigate(`/rider/${id}`, { state: { activeTab: "completed" } });
  };
  // ✅ KPI: 완료 주문 기반으로 계산 (필드명은 더미 shape에 맞춰 조정)
  const todayCompletedCount = orders.length;

  return (
    <section className="rcv-wrap">
      {/* ✅ KPI */}
      <div className="rcv-kpi">
        <div className="rcv-kpi-box">
          <p className="rcv-kpi-label">오늘 총 수익</p>
          {/* <p className="rcv-kpi-value">{formatKRW(todayRevenue)}원</p> */}
        </div>

        <div className="rcv-kpi-box">
          <p className="rcv-kpi-label">오늘 배달 횟수</p>
          <p className="rcv-kpi-value">{todayCompletedCount}</p>
        </div>
      </div>

      <div className="rcv-divider" />

      {/* ✅ 완료 리스트 */}
      <div className="rcv-list">
        {orders.length === 0 ? (
          <div className="rcv-empty">완료된 배달이 없습니다</div>
        ) : (
          orders.map((order) => (
            <CompletedOrderRow
              key={order.orderNo ?? order.id}
              order={order}
              onOpen={handleBackToCompleted}
            />
          ))
        )}
      </div>
    </section>
  );
}