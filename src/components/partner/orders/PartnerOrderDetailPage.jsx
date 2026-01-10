import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './PartnerOrderDetailPage.css';
import { useEffect } from 'react';
import { orderShowThunk } from '../../../store/thunks/orders/orderShowThunk.js'
import { clearOrderDetail } from '../../../store/slices/ordersDetailSlice.js'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const KST = "Asia/Seoul";

const PartnerOrderDetailPage = () => {
  const { orderCode } = useParams(); // URL의 :orderCode 값
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux에서 상세 데이터와 로딩 상태 가져오기
  // state.ordersDetail 부분은 store에 등록된 reducer 이름에 맞춰 확인해 주세요.
  const { orderDetail: order, loading, error } = useSelector((state) => state.ordersDetail);

  useEffect(() => {
    if (orderCode) {
      // 1. 페이지 진입 시 상세 데이터 API 호출
      // Thunk의 id 인자로 useParams에서 받은 orderCode를 넘겨줍니다.
      dispatch(orderShowThunk(orderCode));
    }

    // 2. 클린업 함수: 페이지를 떠날 때 상세 데이터를 초기화
    return () => {
      dispatch(clearOrderDetail());
    };
  }, [dispatch, orderCode]);

  // 로딩 중 처리
  if (loading) {
    return <div className="loading_msg">데이터를 불러오는 중입니다...</div>;
  }

  // 에러 발생 처리
  if (error) {
    return <div className="error_msg">에러가 발생했습니다: {error.message || '데이터를 찾을 수 없습니다.'}</div>;
  }

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

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="order_detail_page">
      {/* 상단 헤더 영역 */}
      <div className="detail_header">
        <button className="back_btn" onClick={() => navigate(-1)}>←</button>
        <h2 className="order_title">주문 번호: {order.orderCode}</h2>
        <span className={`detail_status_badge ${statusInfo.class}`}>
          {statusInfo.text}
        </span>
        {order.order_rider ? (
          <a href={`tel:${order.order_rider.phone}`} className="call_rider_btn">
            📞 기사님께 전화하기 ({order.order_rider.rider_user?.name})
          </a>
        ) : (
          <button className="call_rider_btn disabled" disabled>
            📞 기사 배정 중
          </button>
        )}
      </div>

      <div className="detail_content_grid">
        {/* 왼쪽 섹션: 고객 정보와 목적지 정보를 분리 */}
        <div className="detail_left">

          {/* 섹션 1: 고객 정보 */}
          <section className="info_card customer_card">
            <div className="card_header">
              <span className="icon">👤</span>
              <h3>고객 정보</h3>
            </div>
            <div className="customer_profile">
              <div className="profile_text">
                <p className="name">{order.name}</p>
                <p className="email">{order.email}</p>
              </div>
            </div>
          </section>

          {/* 섹션 2: 배송 목적지 (호텔/파트너) */}
          <section className="info_card destination_card">
            <div className="card_header">
              <span className="icon">📍</span>
              <h3>배송 목적지</h3>
            </div>
            <div className="address_info">
              <p className="hotel_name">{order.order_hotel?.krName}</p>
              <p className="hotel_address">{order.order_hotel?.address}</p>
              {/* 팁: 주소 복사 버튼이나 지도 보기 링크를 여기에 추가하면 UX가 훨씬 좋아집니다. */}
            </div>
          </section>

        </div>

        <section className="info_card">
          <h3>배송 옵션</h3>
          <div className="plan_item">
            <span className="plan_icon">📦</span>
            <span className="plan_name">{order.orderDetail || "Basic x 1"}</span>
          </div>
        </section>
      </div>

      {/* 오른쪽 섹션: 타임라인 (Chase 기능의 핵심) */}
      <div className="detail_right">
        <section className="info_card timeline_card">
          <h3>배송 타임라인</h3>
          <div className="timeline">
            {/* 1. 주문 생성 (req): 항상 표시 */}
            <div className="timeline_item active">
              <div className="t_icon">✓</div>
              <div className="t_text">
                <p className="t_title">주문생성</p>
                <span className="t_time">
                  {dayjs(order.createdAt).tz(KST).format('YYYY.MM.DD (ddd) A hh:mm')}
                </span>
              </div>
            </div>

            {/* 2. 기사 배정 (mat): mat, pick, com 상태일 때 표시 */}
            {['mat', 'pick', 'com'].includes(order.status) && (
              <div className="timeline_item active">
                <div className="t_icon">2</div>
                <div className="t_text">
                  <p className="t_title">기사님 배정 완료</p>
                  <span className="t_time">
                    {/* 배정 시점 데이터가 따로 없다면 updatedAt 활용 */}
                    {/* {dayjs(order.updatedAt).format('A h:mm')} */}
                  </span>
                </div>
              </div>
            )}

            {/* 3. 픽업 완료 (pick): pick, com 상태일 때 표시 */}
            {['pick', 'com'].includes(order.status) && (
              <div className="timeline_item active">
                <div className="t_icon">3</div>
                <div className="t_text">
                  <p className="t_title">기사님 픽업 완료</p>
                  <span className="t_time">
                    {dayjs(order.pickupAt).tz(KST).format('YYYY.MM.DD (ddd) A hh:mm')}
                  </span>
                </div>
              </div>
            )}

            {/* 4. 배달 완료 (com): 오직 com 상태일 때만 표시 */}
            {order.status === 'com' && (
              <div className="timeline_item active">
                <div className="t_icon">✓</div>
                <div className="t_text">
                  <p className="t_title">배달 완료</p>
                  <span className="t_time">
                    {dayjs(order.updatedAt).tz(KST).format('YYYY.MM.DD (ddd) A hh:mm')}
                  </span>
                </div>
              </div>
            )}

          </div>
        </section>

        <button className="report_problem_btn" onClick={() => navigate(`/partners/orders/questions`)}>주문에 문제가 생겼나요?</button>
      </div>
    </div>
  );
};

export default PartnerOrderDetailPage;