import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react"; // ✅ 추가
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
      onClick={() => navigate(`/riders/orders/${order.orderCode}`)}
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
      <span className="cor-chevron">›</span>
    </button>
  );
}

// ✅ props로 받던 { orders = [] } 제거 (useSelector와 충돌 방지)
export default function RiderCompletedView() {
  const orders = useSelector((state) => state.orders.orders);

  // ✅ 오늘 완료된 주문들만 따로 필터링 (수익과 횟수 계산의 기준)
  const todayCompletedOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    const today = dayjs().format("YYYY-MM-DD");

    return orders.filter((order) => {
      const isCompleted = order.status === "com";
      const isToday = dayjs(order.updatedAt).format("YYYY-MM-DD") === today;
      return isCompleted && isToday;
    });
  }, [orders]);

  // ✅ 1. 오늘 총 수익 계산
  const todayRevenue = useMemo(() => {
    return todayCompletedOrders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);
  }, [todayCompletedOrders]);

  // ✅ 2. 오늘 배달 횟수 계산
  const todayCompletedCount = todayCompletedOrders.length;

  // 3. 화폐 포맷팅 함수
  const formatKRW = (val) => new Intl.NumberFormat("ko-KR").format(val);

  return (
    <div className="rcv-wrap">
      {/* ✅ KPI */}
      <div className="rcv-kpi">
        <div className="rcv-kpi-box">
          <p className="rcv-kpi-label">오늘 총 수익</p>
          <p className="rcv-kpi-value">{formatKRW(todayRevenue)}원</p>
        </div>

        <div className="rcv-kpi-box">
          <p className="rcv-kpi-label">오늘 배달 횟수</p>
          <p className="rcv-kpi-value">{todayCompletedCount}건</p>
        </div>
      </div>

      <div className="rcv-divider" />

      {/* ✅ 완료 리스트 - 전체가 아닌 필터링된 오늘 리스트만 보여줄지, 전체 완료 건을 보여줄지 선택 가능 */}
      <div className="rcv-list">
        {todayCompletedOrders.length === 0 ? (
          <div className="rcv-empty">오늘 완료된 배달이 없습니다</div>
        ) : (
          todayCompletedOrders.map((order) => (
            <CompletedOrderRow
              key={order.id}
              order={order}
            />
          ))
        )}
      </div>
    </div>
  );
}