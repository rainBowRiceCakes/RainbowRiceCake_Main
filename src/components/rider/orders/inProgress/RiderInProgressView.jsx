import dayjs from "dayjs";
import { getInProgressBadgeText } from "../../../../constants/orderStatus.js";
import { useNavigate } from "react-router-dom";
import "./RiderInProgressView.css";

const RIDER_FEE_RATE = 0.8;

// 보수 계산 함수
const calcRiderFee = (price) =>
  Math.floor((Number(price) || 0) * RIDER_FEE_RATE);

// 플랜 매핑
const PLAN_MAP = {
  cntS: "베이직 (쇼핑백 1개)",
  cntM: "스탠다드 (쇼핑백 2개)",
  cntL: "프리미엄 (쇼핑백 3개)",
};

export default function RiderInProgressView({ orders = [] }) {
  const navigate = useNavigate();

  const handleOpenNavFlow = (e, order) => {
    e.stopPropagation();
    navigate(`/riders/orders/${order.orderCode}/nav`);
  };

  if (!orders || orders.length === 0) {
    return <div className="rw-empty">진행 중인 주문이 없습니다</div>;
  }

  return (
    <div className="rip-wrap">
      {orders.map((order) => {
        const planKey = Object.keys(PLAN_MAP).find(
          (key) => order[key] === 1
        );
        const plan = PLAN_MAP[planKey];
        const fee = calcRiderFee(order.price);

        return (
          <button
            key={order.orderCode}
            type="button"
            className="rip-card"
            onClick={(e) => handleOpenNavFlow(e, order)}
          >
            <div className="rip-left">
              <div className="rip-badge-row">
                <span className="rip-badge">
                  {getInProgressBadgeText(order.status)}
                </span>
                <span className="rip-order-id">
                  #{order.orderCode?.slice(-4)}
                </span>
              </div>

              <div className="rip-divider" />

              <div className="rip-info-summary">
                <div className="rip-title-row">
                  <span className="icon">📍</span>
                  <p className="rip-title">
                    {order.order_partner?.krName} →{" "}
                    {order.order_hotel?.krName}
                  </p>
                </div>

                <div className="rip-details-row">
                  {plan && (
                    <div className="rip-detail-item">
                      <span>📦 {plan}</span>
                    </div>
                  )}

                  <div className="rip-detail-item reward">
                    <span>💰 {fee.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="rip-footer">
                <span className="rip-label">
                  배송 요청 시간: {dayjs(order.createdAt).format("A HH:mm")}
                </span>
              </div>
            </div>

            <div className="rip-right">
              <div className="rip-chevron-btn">
                <span className="rip-chevron">›</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}