import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './PartnerOrderDetailPage.css';

const PartnerOrderDetailPage = () => {
  const { orderId: orderNo } = useParams();
  const navigate = useNavigate();

  // Redux에서 해당 주문 데이터 찾기
  const order = useSelector((state) =>
    state.orders.orders.find(o => String(o.orderNo) === String(orderNo))
  );

  // 데이터가 없을 경우 처리
  if (!order) {
    return <div className="error_msg">주문을 찾을 수 없습니다.</div>;
  }

  // 상태 매핑용 내부 함수 (배송 이력 페이지와 동일 톤 유지)
  const getStatusInfo = (code) => {
    const map = {
      req: { text: "배달 요청", class: "status_req" },
      mat: { text: "기사 매정 완료", class: "status_mat" },
      pick: { text: "배달 진행 중", class: "status_pick" },
      com: { text: "배달 완료", class: "status_com" },
    };
    return map[code] || { text: "알 수 없음", class: "" };
  };

  const statusInfo = getStatusInfo(order.statusCode);

  return (
    <div className="order_detail_page">
      {/* 상단 헤더 영역 */}
      <div className="detail_header">
        <button className="back_btn" onClick={() => navigate(-1)}>←</button>
        <h2 className="order_title">#{order.orderNo}</h2>
        <span className={`detail_status_badge ${statusInfo.class}`}>
          {statusInfo.text}
        </span>
        <button className="call_rider_btn">📞 배달 기사 전화</button>
      </div>

      <div className="detail_content_grid">
        {/* 왼쪽 섹션: 고객 및 배송 정보 */}
        <div className="detail_left">
          <section className="info_card">
            <h3>Customer / Hotel</h3>
            <div className="customer_profile">
              <div className="profile_img">👤</div>
              <div className="profile_text">
                <p className="name">{order.customerName}</p>
                <p className="email">customer@example.com</p>
              </div>
            </div>
            <div className="address_info">
              <p className="hotel_name">📍 {order.destination}</p>
              <p className="hotel_address">서울시 강남구 역삼동 123-45</p>
            </div>
            <div className="reference_info">
              <p className="label">Hotel Booking Reference:</p>
              <p className="ref_code">ZFDSF375290</p>
            </div>
          </section>

          <section className="info_card">
            <h3>Delivery Plans</h3>
            <div className="plan_item">
              <span className="plan_icon">📦</span>
              <span className="plan_name">{order.orderDetail || "Basic x 1"}</span>
            </div>
          </section>
        </div>

        {/* 오른쪽 섹션: 타임라인 (Chase 기능의 핵심) */}
        <div className="detail_right">
          <section className="info_card timeline_card">
            <h3>Delivery Timeline</h3>
            <div className="timeline">
              {/* 1. 주문 생성 (req) */}
              <div className="timeline_item active">
                <div className="t_icon">✓</div>
                <div className="t_text">
                  <p className="t_title">6:12pm 주문생성</p>
                  <span className="t_time">w 6:12pm</span>
                </div>
              </div>

              {/* 2. 기사 배정 (mat) */}
              <div className={`timeline_item ${['mat', 'pick', 'com'].includes(order.statusCode) ? 'active' : ''}`}>
                <div className="t_icon">2</div>
                <div className="t_text">
                  <p className="t_title">7:20pm 라이더 배정</p>
                  <span className="t_time">w 7:20pm</span>
                </div>
              </div>

              {/* 3. 픽업 완료 (pick) */}
              <div className={`timeline_item ${['pick', 'com'].includes(order.statusCode) ? 'active' : ''}`}>
                <div className="t_icon">3</div>
                <div className="t_text">
                  <p className="t_title">7:24pm 픽업 완료</p>
                  <span className="t_time">w 7:24pm</span>
                </div>
              </div>

              {/* 4. 배달 완료 (com) */}
              <div className={`timeline_item ${order.statusCode === 'com' ? 'active' : ''}`}>
                <div className="t_icon">✓</div>
                <div className="t_text">
                  <p className="t_title">7:50pm 배달 완료</p>
                  <span className="t_time">w 7:50pm</span>
                </div>
              </div>
            </div>
          </section>

          <button className="report_problem_btn">주문에 문제가 생겼나요?</button>
        </div>
      </div>
    </div>
  );
};

export default PartnerOrderDetailPage;