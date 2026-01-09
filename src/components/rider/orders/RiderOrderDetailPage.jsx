// components/rider/orders/detail/RiderOrderDetailPage.jsx
import "./RiderOrderDetailPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orderShowThunk } from "../../../store/thunks/orders/orderShowThunk.js"; // 경로에 맞춰 수정하세요
// import RiderSubHeader from "../common/RiderSubHeader";
import { useEffect } from "react";
import { clearOrderDetail } from "../../../store/slices/ordersDetailSlice.js";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const KST = "Asia/Seoul";

export default function RiderOrderDetailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderCode } = useParams();

  const fullState = useSelector((state) => state);
  console.log("전체 Redux State:", fullState);

  // 리스트가 아닌 상세 정보(orderDetail)를 가져옵니다.
  const order = useSelector((state) => state.ordersDetail?.orderDetail);
  const loading = useSelector((state) => state.ordersDetail?.loading);

  useEffect(() => {
    if (orderCode) {
      dispatch(orderShowThunk(orderCode));

      return () => {
        dispatch(clearOrderDetail());
      };
    }
  }, [dispatch, orderCode]);

  // 로딩 중 표시
  if (loading) {
    return <div className="rod-wrap"><div className="rod-empty">불러오는 중...</div></div>;
  }

  // 데이터 없음 표시
  if (!order) {
    return (
      <div className="rod-wrap">
        <div className="rod-empty">
          <p className="rod-empty-title">주문 정보를 찾을 수 없어요 😭</p>
          <p className="rod-empty-sub">ID: {orderCode}</p>
        </div>
      </div>
    );
  }

  function redirectCreateQuestions() {
    navigate(`questions`);
  }

  const statusText = order.statusLabel ?? (order.status === "com" ? "완료" : "진행 중");

  const formatDateTime = (value, pendingText = '대기 중') => {
    if (!value) return pendingText;

    const d = dayjs(value);
    if (!d.isValid()) return pendingText;

    return d.tz(KST).format('YYYY.MM.DD (ddd) A hh:mm');
  };

  return (
    <div className="rod-wrap">
      <div className="rod-main">
        <div className="rod-card" aria-label="주문 상세 카드">
          <div className="rod-row">
            <span className="rod-label">주문 상태</span>
            <span className="rod-value">{statusText}</span>
          </div>
          <div className="rod-row">
            <span className="rod-label">주문 번호</span>
            <span className="rod-value rod-mono">{order.orderCode}</span>
          </div>
          <div className="rod-row">
            <span className="rod-label">픽업 장소</span>
            <span className="rod-value rod-mono">{order.order_partner.krName}</span>
          </div>
          <div className="rod-row">
            <span className="rod-label">도착 장소</span>
            <span className="rod-value rod-mono">{order.order_hotel.krName}</span>
          </div>
          <div className="rod-row">
            <span className="rod-label">주문 요청 시간</span>
            <span className="rod-value">{formatDateTime(order.createdAt, '주문 요청 전')}</span>
          </div>
          <div className="rod-row">
            <span className="rod-label">픽업 시간</span>
            <span className="rod-value">{formatDateTime(order.pickupAt, '픽업 전')}</span>
          </div>
          <div className="rod-row">
            <span className="rod-label">배송 완료 시간</span>
            <span className="rod-value">{formatDateTime(order.updatedAt, '배송 미완료')}</span>
          </div>

          <div className="rod-divider" />

          {/* DB 컬럼 구조에 맞춘 쇼핑백 사이즈 출력 섹션 */}
          <div className="rod-row">
            <span className="rod-label">쇼핑백 구성</span>
            <div className="rod-value">
              {order.cntS > 0 && <div>베이직 - {order.cntS}개</div>}
              {order.cntM > 0 && <div>스탠다드 - {order.cntM}개</div>}
              {order.cntL > 0 && <div>플러스 - {order.cntL}개</div>}
              {!(order.cntS > 0 || order.cntM > 0 || order.cntL > 0) && "-"}
            </div>
          </div>

          <div className="rod-row">
            <span className="rod-label">보수 금액</span>
            <span className="rod-value">{Math.round(order.price * 0.8).toLocaleString()}원</span>
          </div>
        </div>

        <button type="button" className="rod-issue-btn" onClick={redirectCreateQuestions}>
          주문에 문제가 생겼나요?
        </button>
      </div>
    </div>
  );
}