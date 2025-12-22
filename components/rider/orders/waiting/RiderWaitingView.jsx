// components/rider/main/waiting/RiderWaitingView.jsx
import "./RiderWaitingView.css";

export default function RiderWaitingView({ orders, onAccept }) {
  if (!orders || orders.length === 0) {
    return <div className="rw-empty">대기 중인 주문이 없습니다</div>;
  }

  return (
    <div className="rider-waiting-view">
      {orders.map((order) => (
        <div key={order.orderNo} className="rw-item">
          <div className="rw-card">
            <div className="rw-left">
              <p className="rw-time">
                <span>요청된 시간 </span>
                {order?.requestedAt?.slice?.(11, 16) ?? "-"}
              </p>

              <p className="rw-title">
                {order.pickupPlaceName} → {order.destinationHotelName}
              </p>
            </div>

            <button
              type="button"
              className="rw-accept"
              onClick={() => onAccept?.(order.orderNo)}
            >
              수락
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}