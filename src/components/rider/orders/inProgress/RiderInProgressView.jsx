// components/rider/main/inProgress/RiderInProgressView.jsx
import dayjs from "dayjs";
import { getInProgressBadgeText } from "../../../../constants/orderStatus.js";
import "./RiderInProgressView.css";
import { useNavigate } from "react-router-dom";


export default function RiderInProgressView({ orders = [] }) {
  const navigate = useNavigate();

  const handleOpenNavFlow = (e, order) => {
    e.stopPropagation();

    const orderId = order.id;

    navigate(`/riders/orders/${orderId}/nav`);
  };

  console.log("orders props:", orders);

  // 🔍 상태 + 뱃지 매핑 확인용 로그
  orders.forEach((o) => {
    console.log(
      "id:", o.id,
      "status:", o.status,
      "badge:", getInProgressBadgeText(o.status)
    );
  });

  if (!orders || orders.length === 0) {
    return <div className="rw-empty">진행 중인 주문이 없습니다</div>;
  }


  return (
    <div className="rip-wrap">
      {orders.map((order) => {
        const orderId = order.id;
        const title = `${order.order_partner.krName} → ${order.order_hotel.krName}`;
        const badgeText = getInProgressBadgeText(order.status);

        return (
          <button
            key={orderId}
            type="button"
            className="rip-card"
            // ✅ 이제 카드 어디를 눌러도 네비게이션 화면으로 이동합니다.
            onClick={(e) => handleOpenNavFlow(e, order)}
          >
            <div className="rip-left">
              <div className="rip-badge-row">
                {badgeText && <span className="rip-badge">{badgeText}</span>}
                <span className="rip-label">주문번호: {orderId}</span>
              </div>
              <div className="rip-divider" />

              <span className="rip-label">접수된 시간: {dayjs(order.createdAt).format('A hh:mm')}</span>

              <p className="rip-title">{title}</p>
            </div>

            <div className="rip-right">
              {/* ✅ 내부 버튼 태그를 div나 span으로 변경합니다. 
      어차피 부모 버튼이 클릭을 처리하므로 시각적인 요소만 남깁니다.
    */}
              <div className="rip-chevron-btn" aria-hidden="true">
                <span className="rip-chevron">›</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}