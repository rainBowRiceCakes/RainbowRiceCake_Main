// components/rider/main/completed/RiderCompletedView.jsx
import { useNavigate } from "react-router-dom";
import "./RiderCompletedView.css";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
dayjs.locale('ko');

function CompletedOrderRow({ order }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="cor-row"
      onClick={() => navigate(`/riders/orders/${order.id}`)}
    >
      <div className="cor-left">
        <p className="cor-time">
          <span>완료된 시간: </span>
          {dayjs(order.updatedAt).format('A hh:mm')}
        </p>
        <p className="cor-title">
          {order.order_partner?.krName} → {order.order_hotel?.krName}
        </p>
      </div>
      <span className="cor-chevron">
        ›
      </span>
    </button>
  );
}

export default function RiderCompletedView({ orders = [] }) {
  const todayCompletedCount = orders.length;

  return (
    <div className="rcv-wrap">
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
              key={order.id ?? order.id}
              order={order}
            />
          ))
        )}
      </div>
    </div>
  );
}