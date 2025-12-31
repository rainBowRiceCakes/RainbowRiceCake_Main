// src/components/rider/mypage/settlement/SettlementList.jsx
import "./SettlementList.css";
import { useState, useMemo } from "react";
import { dummySettlementHistory } from "../../../../data/dummySettlementHistory.js";

function SettlementItem({ item }) {
  const handleDownload = () => {
    // 실제 다운로드 로직은 API 연동 시 구현됩니다.
    alert(`'${item.period}' 기간의 명세서를 다운로드합니다.`);
  };

  return (
    <article className="sl-item-card">
      <div className="sl-item-header">
        <h3 className="sl-item-period">{item.period}</h3>
        <button className="sl-item-download-btn" onClick={handleDownload}>
          <span>다운로드</span>
        </button>
      </div>
      <div className="sl-item-body">
        <div className="sl-item-row">
          <span className="sl-label">정산 기준일</span>
          <span className="sl-value">{item.settlementDate}</span>
        </div>
        <div className="sl-item-row">
          <span className="sl-label">정산 금액</span>
          <span className="sl-value">{item.amount.toLocaleString()}원</span>
        </div>
        <div className="sl-item-row">
          <span className="sl-label">상태</span>
          <span className="sl-value completed">{item.status}</span>
        </div>
      </div>
    </article>
  );
}

export default function SettlementList() {
  const [monthRange, setMonthRange] = useState(6); // 기본 6개월

  const filteredHistory = useMemo(() => {
    const today = new Date();
    const targetDate = new Date(today.setMonth(today.getMonth() - monthRange));

    return dummySettlementHistory.filter(item => {
      const settlementDate = new Date(item.settlementDate);
      return settlementDate >= targetDate;
    });
  }, [monthRange]);

  const handleRangeChange = (e) => {
    setMonthRange(Number(e.target.value));
  };

  return (
    <div className="sl-container">
      <div className="sl-filter-section">
        <label htmlFor="month-range">조회 기간</label>
        <select id="month-range" value={monthRange} onChange={handleRangeChange}>
          <option value={1}>최근 1개월</option>
          <option value={3}>최근 3개월</option>
          <option value={6}>최근 6개월</option>
        </select>
      </div>

      <div className="sl-list-area">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => <SettlementItem key={item.id} item={item} />)
        ) : (
          <p className="sl-no-results">해당 기간의 정산 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
