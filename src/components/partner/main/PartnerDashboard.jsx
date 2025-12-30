import PartnerStatCard from './PartnerStatCard';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
  return (
    <div className="dashboard_container">
      <div className="welcome_msg">
        <h1>올리브영 동성로점 <span>점주님을 언제나 응원해요!</span></h1>
      </div>

      <div className="stats_grid">
        <PartnerStatCard title="오늘 배송 요청" count={12} color="yellow" icon="📦" />
        <PartnerStatCard title="진행 중 배송" count={5} color="pink" icon="🛵" />
        <PartnerStatCard title="오늘 완료 배송" count={5} color="mint" icon="📈" />
      </div>

      <div className="history_section">
        <h3>오늘의 주문 현황..? 잘 모르겠네</h3>
      </div>
    </div>
  );
};

export default PartnerDashboard;