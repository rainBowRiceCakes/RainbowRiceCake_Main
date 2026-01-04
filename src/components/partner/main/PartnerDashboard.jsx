import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js';
import HourlyOrderChart from './barChart.jsx';
import PartnerStatCard from './PartnerStatCard.jsx';
import './PartnerDashboard.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [now, setNow] = useState(dayjs());

  // 현재 시간을 실시간으로 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs()); // state 변경 → re-render
    }, 1000);

    return () => clearInterval(interval); // cleanup 필수
  }, []);

  // 1. Redux 스토어에서 주문 데이터 가져오기
  const { orders, loading } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('요청'); // 화면 표시용 탭 이름

  // 2. 컴포넌트 마운트 시 주문 데이터 로드 (전체 조회를 위해 파라미터 없이 호출하거나 필요한 범위 지정)
  useEffect(() => {
    // 점주용 대시보드이므로 상태 구분 없이 최근 데이터를 가져오거나 
    // 혹은 필요한 상태들을 배열로 넘겨 호출합니다.
    dispatch(orderIndexThunk({ page: 1, limit: 20 }));
  }, [dispatch]);

  // 3. 상태별 데이터 필터링 로직
  // req: 요청됨, mat: 기사매칭, pick: 픽업완료(배송중), com: 완료
  const reqOrders = orders.filter(o => o.status === 'req');
  const ongoingOrders = orders.filter(o => o.status === 'mat' || o.status === 'pick');
  const completedOrders = orders.filter(o => o.status === 'com');

  // 4. 현재 활성화된 탭에 따른 리스트 결정
  const getFilteredOrders = () => {
    switch (activeTab) {
      case '요청': return reqOrders;
      case '진행': return ongoingOrders;
      case '완료': return completedOrders;
      default: return reqOrders;
    }
  };

  const displayOrders = getFilteredOrders();


  return (
    <div className="dashboard_container">
      <div className='today_date'>{now.format('YYYY년 M월 D일 (dd) HH:mm')}</div>
      {/* 1. 웰컴 메시지 영역 */}
      <div className="welcome_msg">
        <h1>❤️ 점주님을 언제나 응원해요!</h1>
      </div>

      {/* 2. 상단 통계 카드 - 실제 데이터 개수 반영 */}
      <div className="stats_grid">
        <PartnerStatCard title="오늘 배송 요청" count={reqOrders.length} color="yellow" icon="📦" />
        <PartnerStatCard title="진행 중 배송" count={ongoingOrders.length} color="pink" icon="🛵" />
        <PartnerStatCard title="오늘 완료 배송" count={completedOrders.length} color="mint" icon="✅" />
      </div>

      <div className="main_content_grid">
        <div className="left_column">
          <div className="order_status_section">
            <div className="section_header">
              <h3>오늘의 주문 현황</h3>
              <div className="status_tabs">
                {['요청', '진행', '완료'].map((tab) => (
                  <button
                    key={tab}
                    className={activeTab === tab ? 'active' : ''}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab} ({tab === '요청' ? reqOrders.length : tab === '진행' ? ongoingOrders.length : completedOrders.length})
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
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>데이터 로딩 중...</td></tr>
                ) : displayOrders.length > 0 ? (
                  displayOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id.toString().slice(-5)}</td>
                      <td>
                        <span className={`badge ${order.status}`}>
                          {order.status === 'req' && '요청됨'}
                          {order.status === 'mat' && '매칭됨'}
                          {order.status === 'pick' && '배송중'}
                          {order.status === 'com' && '완료'}
                        </span>
                      </td>
                      <td>{dayjs(order.createdAt).format('H시 mm분')}</td>
                      <td><button className="btn_detail">상세 보기</button></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>해당하는 주문이 없습니다.</td></tr>
                )}
              </tbody>
            </table>

            <div className="table_footer">
              <button
                className="view_all_link"
                onClick={() => navigate('/partners/orders')}
              >
                배송 내역 전체 보기 ➔
              </button>
            </div>
          </div>
        </div>

        <div className="right_column">
          <div className="chart_card">
            <h4>오늘 시간대별 주문 분포</h4>
            <div className="chart_placeholder_img">{<HourlyOrderChart />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;