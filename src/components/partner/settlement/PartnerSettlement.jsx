import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import './PartnerSettlement.css';

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const KST = "Asia/Seoul";

const PartnerSettlement = () => {
  const dispatch = useDispatch();

  // 1. Slice 구조에 맞게 상태 가져오기
  const { orders: allOrders, loading: isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    // slice에서 이미 100개를 가져오도록 설정되어 있지만, 
    // 정산은 누락이 없어야 하므로 limit을 넉넉히 주어 다시 호출합니다.
    dispatch(orderIndexThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  const settlementData = useMemo(() => {
    // 1. 기준 시간 선언 (KST 기준)
    const nowKST = dayjs().tz(KST);
    const startOfMonth = nowKST.startOf('month'); // 여기서 선언되어야 함
    const endOfMonth = nowKST.endOf('month');     // 여기서 선언되어야 함

    // 2. 필터링 시작
    const completedThisMonth = allOrders.filter(order => {
      // 상태 체크
      const isCom = order.status === 'com';

      // 시간 체크 (KST 변환)
      const completedAtKST = dayjs(order.updatedAt).tz(KST);

      // 이제 startOfMonth와 endOfMonth를 참조할 수 있습니다.
      const isThisMonth = completedAtKST.isBetween(startOfMonth, endOfMonth, null, '[]');

      return isCom && isThisMonth;
    });

    // 3. 금액 합산
    const BASE_FEE = 50000;
    const totalUsageAmount = completedThisMonth.reduce((acc, order) => {
      return acc + (Number(order.price) || 0);
    }, 0);

    return {
      list: completedThisMonth,
      usageAmount: totalUsageAmount,
      totalAmount: BASE_FEE + totalUsageAmount,
      baseFee: BASE_FEE,
      count: completedThisMonth.length
    };
  }, [allOrders]);

  // 에러 처리 추가 (slice에 error 상태가 있으므로)
  if (error) return <div className="error_msg">데이터 로드 실패: {error}</div>;
  if (isLoading) return <div className="loading_msg">정산 내역 집계 중...</div>;

  return (
    <div className="settlement_page">
      <header className="settlement_header">
        <div>
          <h2 className="page_title">서비스 이용료 정산</h2>
          <p className="subtitle">배달 완료된 건에 대해서만 과금됩니다.</p>
        </div>
        <div className="current_month_badge">
          {dayjs().tz(KST).format('YYYY년 MM월')} 기준
        </div>
      </header>

      {/* 상단 요약 카드 */}
      <div className="summary_grid">
        <div className="summary_card">
          <span className="label">기본 월 회비</span>
          <p className="value">{settlementData.baseFee}원</p>
        </div>
        <div className="summary_card">
          <span className="label">이번 달 배달 완료</span>
          <p className="value">{settlementData.count}건</p>
          <span className="unit_desc">(건당 1,000원 별도)</span>
        </div>
        <div className="summary_card highlight">
          <span className="label">결제 예정 금액 (VAT 별도)</span>
          <p className="total_value">{settlementData.totalAmount}원</p>
        </div>
      </div>

      {/* 정산 상세 내역 */}
      <div className="detail_container">
        <h3>정산 근거 상세 내역</h3>
        <table className="settlement_table">
          <thead>
            <tr>
              <th>완료 일시</th>
              <th>주문번호</th>
              <th>사이즈별 수량</th>
              <th>주문 금액</th>
            </tr>
          </thead>
          <tbody>
            {settlementData.list.length > 0 ? (
              settlementData.list.map((order) => (
                <tr key={order.orderCode}>
                  <td>{dayjs(order.updatedAt).tz(KST).format('YY.MM.DD HH:mm')}</td>
                  <td className="order_code">{order.orderCode}</td>
                  <td className="item_summary">
                    {/* 사이즈가 있을 때만 배지 형태로 노출 */}
                    <div className="size_badges">
                      {order.cntS > 0 && <span className="badge s">S:{order.cntS}</span>}
                      {order.cntM > 0 && <span className="badge m">M:{order.cntM}</span>}
                      {order.cntL > 0 && <span className="badge l">L:{order.cntL}</span>}
                    </div>
                  </td>
                  {/* 백엔드에서 받은 실제 주문 금액 표시 */}
                  <td className="price_cell">
                    +{(order.price || 0).toLocaleString()}원
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty_cell">정산 대상 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerSettlement;