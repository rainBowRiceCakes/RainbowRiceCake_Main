import "./SettlementList.css";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSettlementThunk } from "../../../../store/thunks/riders/getSettlementThunk.js";
import { getSettlementDetailThunk } from "../../../../store/thunks/riders/getSettlementDetailThunk.js";
import { excelDown } from "../../../../utils/excelDown.js";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const KST = "Asia/Seoul";
const RIDER_FEE_RATE = 0.8; // ✅ 라이더 수수료율 80%

export default function SettlementList() {
  const dispatch = useDispatch();
  const [monthRange, setMonthRange] = useState(6);
  const { settlementHistory, loading, detailLoading, error } = useSelector((state) => state.settlement);

  useEffect(() => {
    dispatch(getSettlementThunk());
  }, [dispatch]);

  const filteredHistory = useMemo(() => {
    if (!settlementHistory) return [];
    const today = dayjs().tz(KST);
    const targetDate = today.subtract(monthRange, 'month').startOf('month');

    return settlementHistory
      .filter(item => {
        // ✅ Slice에서 이미 포맷팅된 settlementDate(지급일)를 기준으로 필터링
        const itemDate = dayjs(item.settlementDate).tz(KST);
        return itemDate.isAfter(targetDate) || itemDate.isSame(targetDate);
      })
      .sort((a, b) => dayjs(b.settlementDate).unix() - dayjs(a.settlementDate).unix());
  }, [settlementHistory, monthRange]);

  const handleDownloadDetail = async (item) => {
    // ✅ 1. 정산대기(REQ) 상태거나 로딩 중이면 실행 차단
    if (detailLoading || item.statusCode === 'REQ') return;

    try {
      const response = await dispatch(getSettlementDetailThunk(item.id)).unwrap();
      const detailData = response.data || [];

      if (detailData.length === 0) {
        return alert("해당 월의 상세 배달 내역이 없습니다.");
      }

      const columns = [
        { header: '완료 시간', key: 'completedAt', width: 22 },
        { header: '주문 번호', key: 'orderCode', width: 18 },
        { header: '픽업지', key: 'pickupArea', width: 18 },
        { header: '배달지', key: 'deliveryArea', width: 18 },
        { header: '배달 금액(원)', key: 'riderPrice', width: 15 },
      ];

      const excelData = detailData.map(order => ({
        completedAt: dayjs(order.updatedAt).tz(KST).format("YYYY-MM-DD HH:mm:ss"),
        orderCode: order.orderCode,
        pickupArea: order.order_partner.krName || '-',
        deliveryArea: order.order_hotel.krName || '-',
        riderPrice: Math.floor(Number(order.price || 0) * RIDER_FEE_RATE),
      }));

      const fileName = `명세서_${item.period.replace(/ /g, '_')}`;
      excelDown(excelData, fileName, columns);

    } catch (err) {
      alert(`명세서 생성 실패: ${err?.msg || "데이터를 가져오지 못했습니다."}`);
    }
  };

  if (loading && settlementHistory.length === 0) return <div className="sl-loading">내역 조회 중...</div>;

  return (
    <div className="sl-container">
      <header className="sl-header">
        <h2>정산 내역 조회</h2>
      </header>

      <div className="sl-filter-section">
        <label htmlFor="month-range">조회 기간</label>
        <select id="month-range" value={monthRange} onChange={(e) => setMonthRange(Number(e.target.value))}>
          <option value={1}>최근 1개월</option>
          <option value={3}>최근 3개월</option>
          <option value={6}>최근 6개월</option>
        </select>
      </div>

      <div className="sl-list-area">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const isPending = item.statusCode === 'REQ';

            return (
              <article key={item.id} className="sl-item-card">
                <div className="sl-item-header">
                  <h3 className="sl-item-period">{item.period}</h3>
                  <button
                    className={`sl-item-download-btn ${isPending ? 'disabled' : ''}`}
                    onClick={() => handleDownloadDetail(item)}
                    disabled={detailLoading || isPending}
                  >
                    {isPending ? '준비 중' : (detailLoading ? '생성 중...' : '명세서 다운로드')}
                  </button>
                </div>

                <div className="sl-item-body">
                  <div className="sl-item-row">
                    <span className="sl-label">지급(예정)일</span>
                    <span className="sl-value">{item.settlementDate}</span>
                  </div>
                  <div className="sl-item-row">
                    <span className="sl-label">총 지급액</span>
                    {/* ✅ Settlements 테이블의 total_amount는 이미 0.8이 곱해진 상태이므로 그대로 표시 */}
                    <span className="sl-value total-amount">{item.amount?.toLocaleString()}원</span>
                  </div>
                  <div className="sl-item-row">
                    <span className="sl-label">상태</span>
                    <span className={`sl-value status-${item.statusCode?.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="sl-no-results">정산 내역이 존재하지 않습니다.</div>
        )}
      </div>
    </div>
  );
}