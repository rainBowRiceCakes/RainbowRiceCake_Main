import { useState } from 'react';
import PartnerStatCard from './PartnerStatCard';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('요청');

  return (
    <div className="dashboard_container">
      {/* 웰컴 메시지 */}
      <div className="welcome_msg">
        <h1>올리브영 동성로점 <span>점주님을 언제나 응원해요!</span></h1>
      </div>

      {/* 상단 요약 카드 (KPI) */}
      <div className="stats_grid">
        <PartnerStatCard title="오늘 배송 요청" count={12} color="yellow" icon="📦" />
        <PartnerStatCard title="진행 중 배송" count={5} color="pink" icon="🛵" />
        <PartnerStatCard title="오늘 완료 배송" count={5} color="mint" icon="✅" />
      </div>

      <div className="main_content_grid">
        {/* 왼쪽 섹션: 주문 현황 및 요약 */}
        <div className="left_column">
          <div className="order_status_section">
            <div className="section_header">
              <h3>최근 주문 & 배송 현황</h3>
              <div className="status_tabs">
                {['요청', '진행', '완료'].map((tab) => (
                  <button
                    key={tab}
                    className={activeTab === tab ? 'active' : ''}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <table className="order_table">
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>상태</th>
                  <th>요청 시간</th>
                  <th>상세 보기</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#58492</td>
                  <td><span className="badge ongoing">배송현황</span></td>
                  <td>4/18 12:00-13:30</td>
                  <td><button className="btn_detail">상세 보기</button></td>
                </tr>
                <tr>
                  <td>#58491</td>
                  <td><span className="badge delivery">배송중</span></td>
                  <td>4/19 14:00-12:30</td>
                  <td><button className="btn_detail">상세 보기</button></td>
                </tr>
                <tr>
                  <td>#58490</td>
                  <td><span className="badge delay">지연</span></td>
                  <td>4/19 12:30-12:25</td>
                  <td><button className="btn_detail">상세 보기</button></td>
                </tr>
              </tbody>
            </table>
            <div className="table_footer">
              <button className="view_all_link">배송 내역 전체 보기 ➔</button>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 통계 차트 */}
        <div className="right_column">
          <div className="chart_card">
            <h4>최근 7일 배송 건수</h4>
            <div className="chart_placeholder_img">📊 [그래프 영역]</div>
          </div>
          <div className="chart_card">
            <h4>오늘 vs 어제 주문 수</h4>
            <div className="chart_placeholder_img">📈 [비교 차트 영역]</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;