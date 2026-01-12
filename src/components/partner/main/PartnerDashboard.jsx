import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js';
import { getProfileThunk } from '../../../store/thunks/profile/getProfileThunk.js';
import HourlyOrderChart from './barChart.jsx';
import PartnerStatCard from './PartnerStatCard.jsx';
import './PartnerDashboard.css';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);

const KST = "Asia/Seoul";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profileData } = useSelector((state) => state.profile);
  const { orders, loading } = useSelector((state) => state.orders);

  const [now, setNow] = useState(dayjs());
  const [activeTab, setActiveTab] = useState('요청');

  // 1. 초기 프로필 로드
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // 2. 현재 시간 타이머
  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. 주문 데이터 로드 (백엔드 필터 활용)
  // date: 'today'를 보내면 서버가 오늘치만 계산해서 줍니다.
  useEffect(() => {
    const fetchOrders = () => {
      dispatch(orderIndexThunk({ date: 'today', page: 1, limit: 100 }));
    };

    fetchOrders();
    const pollingInterval = setInterval(fetchOrders, 30000);
    return () => clearInterval(pollingInterval);
  }, [dispatch]);

  // 4. [개선] useMemo 삭제 및 단순 필터링
  // 백엔드에서 온 '오늘' 데이터들 중 탭에 맞는 것만 즉시 분류합니다.
  const reqOrders = orders.filter(o => o.status === 'req');
  const ongoingOrders = orders.filter(o => ['mat', 'pick'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'com');

  // 현재 활성화된 탭에 보여줄 리스트
  let displayOrders = [];
  if (activeTab === '요청') displayOrders = reqOrders;
  else if (activeTab === '진행') displayOrders = ongoingOrders;
  else if (activeTab === '완료') displayOrders = completedOrders;

  return (
    <div className="dashboard_container">
      <div className='today_date'>{now.tz(KST).format('YYYY년 M월 D일 (dd) HH:mm')}</div>

      <div className="welcome_msg">
        <h1>❤️ {profileData?.manager}님, 오늘도 화이팅 ❤️</h1>
      </div>

      <div className="stats_grid">
        <PartnerStatCard title="현재 배송 요청" count={reqOrders.length} color="yellow" icon="📦" />
        <PartnerStatCard title="진행 중 배송" count={ongoingOrders.length} color="pink" icon="🛵" />
        <PartnerStatCard title="오늘 완료 배송" count={completedOrders.length} color="mint" icon="✅" />
      </div>

      <div className="main_content_grid">
        <div className="left_column">
          <div className="order_status_section">
            <div className="section_header">
              <h3>오늘의 주문 현황</h3>
              <div className="status_tabs">
                {[
                  { name: '요청', count: reqOrders.length },
                  { name: '진행', count: ongoingOrders.length },
                  { name: '완료', count: completedOrders.length }
                ].map((tab) => (
                  <button
                    key={tab.name}
                    className={activeTab === tab.name ? 'active' : ''}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    {tab.name} ({tab.count})
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
                {loading && orders.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>데이터 로딩 중...</td></tr>
                ) : displayOrders.length > 0 ? (
                  displayOrders.map((order) => (
                    <tr key={order.orderCode}>
                      <td>{order.orderCode}</td>
                      <td>
                        <span className={`badge ${order.status}`}>
                          {order.status === 'req' && '요청됨'}
                          {order.status === 'mat' && '매칭됨'}
                          {order.status === 'pick' && '배송중'}
                          {order.status === 'com' && '완료'}
                        </span>
                      </td>
                      <td>{dayjs(order.createdAt).format('H시 mm분')}</td>
                      <td>
                        <button
                          className="btn_detail"
                          onClick={() => navigate(`/partners/orders/${order.orderCode}`)}
                        >
                          상세 보기
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    현재 '{activeTab}' 상태의 주문이 없습니다.
                  </td></tr>
                )}
              </tbody>
            </table>

            <div className="table_footer">
              <button className="view_all_link" onClick={() => navigate('/partners/orders')}>
                배송 내역 전체 보기 ➔
              </button>
            </div>
          </div>
        </div>

        <div className="right_column">
          <div className="chart_card">
            <h4>오늘 시간대별 주문 분포</h4>
            <div className="chart_placeholder_img">
              <HourlyOrderChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;