// components/rider/main/inProgress/RiderInProgressView.jsx
import { getInProgressBadgeText } from "../../../../constants/orderStatus.js";
import "./RiderInProgressView.css";
import { useNavigate } from "react-router-dom";


export default function RiderInProgressView({ orders = [], onOpenDetail }) {
  const navigate = useNavigate();

  const handleOpenDetail = (order) => {
    if (onOpenDetail) return onOpenDetail(order.id);
  };

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
        const badgeText = getInProgressBadgeText(order.statusCode);

        return (
          <button
            key={orderId}
            type="button"
            className="rip-card"
            onClick={() => handleOpenDetail(order)}
          >
            <div className="rip-left">
              <span className="rip-label">주문번호</span>
              <p className="rip-order-id">{orderId}</p>
              <div className="rip-divider" />

              {badgeText && <span className="rip-badge">{badgeText}</span>}

              <p className="rip-title">{title}</p>
            </div>

            <div className="rip-right">
              <button
                type="button"
                className="rip-chevron-btn"
                aria-label="네비게이션 화면 열기"
                onClick={(e) => handleOpenNavFlow(e, order)}
              >
                <span className="rip-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </div>
          </button>
        );
      })}
    </div>
  );
}