import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import "./RiderCompletedView.css";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ko';

const KST = "Asia/Seoul";

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const RIDER_FEE_RATE = 0.8;

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

export default function RiderCompletedView({ orders: paginatedOrders = [] }) {
  const allOrders = useSelector((state) => state.orders.orders);
  const profileData = useSelector((state) => state.profile?.profileData);
  const riderUniqueId = profileData?.id;

  // ✅ KPI 계산용 (오늘 전체 완료 데이터) - 페이지가 바뀌어도 유지되어야 함
  const todayAllCompletedOrders = useMemo(() => {
    if (!allOrders || !Array.isArray(allOrders)) return [];
    const today = dayjs().tz(KST).format("YYYY-MM-DD");

    return allOrders.filter((order) => {
      const oRiderId = order.order_rider?.id; // 기사 고유 번호
      const isMyOrder = String(oRiderId) === String(riderUniqueId);
      const isCompleted = order.status === "com";
      const isToday = dayjs(order.updatedAt).tz(KST).format("YYYY-MM-DD") === today;
      return isMyOrder && isCompleted && isToday;
    });
  }, [allOrders, riderUniqueId]);

  // ✅ 1. 오늘 총 수익 계산
  const todayRevenue = useMemo(() => {
    return todayAllCompletedOrders.reduce((sum, order) => {
      const price = Number(order.price) || 0;
      return sum + Math.floor(price * RIDER_FEE_RATE);
    }, 0);
  }, [todayAllCompletedOrders]);

  // ✅ 2. 오늘 배달 횟수 계산
  const todayCompletedCount = todayAllCompletedOrders.length;

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

      {/* ✅ 완료 리스트 - 부모(MainPage)가 잘라준 paginatedOrders만 출력 */}
      <div className="rcv-list">
        {paginatedOrders.length === 0 ? (
          <div className="rcv-empty">완료된 배달이 없습니다</div>
        ) : (
          paginatedOrders.map((order) => (
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