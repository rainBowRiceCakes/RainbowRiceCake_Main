import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react'; // useMemo 추가
import { useDispatch, useSelector } from 'react-redux';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js';
import { getProfileThunk } from '../../../store/thunks/profile/getProfileThunk.js';
import HourlyOrderChart from './barChart.jsx';
import PartnerStatCard from './PartnerStatCard.jsx';
import './PartnerDashboard.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 프로필 데이터
  const { profileData, isLoading } = useSelector((state) => state.profile);
  // 주문 데이터
  const { orders, loading } = useSelector((state) => state.orders);

  const [now, setNow] = useState(dayjs());
  const [activeTab, setActiveTab] = useState('요청');

  // 1. 프로필 로드
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // 2. 현재 시간 타이머 (1초마다 UI 갱신)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. [핵심 수정] 주문 데이터 로드 & 폴링(Polling)
  useEffect(() => {
    const fetchOrders = () => {
      // 하루 주문량이 20건을 넘을 수 있으므로 넉넉하게 100건을 요청합니다.
      // (백엔드에 날짜 필터 API가 있다면 startDate를 보내는 게 가장 좋습니다)
      dispatch(orderIndexThunk({ page: 1, limit: 100 }));
    };

    fetchOrders(); // 최초 실행

    // 대시보드의 생동감을 위해 30초마다 데이터 갱신 (선택사항)
    const pollingInterval = setInterval(fetchOrders, 30000);

    return () => clearInterval(pollingInterval);
  }, [dispatch]);

  // 4. [핵심 수정] '오늘' 주문만 정확히 필터링 (useMemo로 최적화)
  const { reqOrders, ongoingOrders, completedOrders, todayTotal } = useMemo(() => {
    const startOfToday = dayjs().startOf('day'); // 오늘 00:00:00

    // 전체 주문 중 '오늘' 생성된 것만 필터링
    const todayList = orders.filter(o =>
      dayjs(o.createdAt).isSame(startOfToday, 'day')
    );

    // 상태별 분류
    const req = todayList.filter(o => o.status === 'req');
    const ongoing = todayList.filter(o => ['mat', 'pick'].includes(o.status));
    const completed = todayList.filter(o => o.status === 'com');

    return {
      reqOrders: req,
      ongoingOrders: ongoing,
      completedOrders: completed,
      todayTotal: todayList
    };
  }, [orders]); // orders가 바뀔 때만 재계산

  // 5. 탭에 따른 리스트 결정
  const displayOrders = useMemo(() => {
    switch (activeTab) {
      case '요청': return reqOrders;
      case '진행': return ongoingOrders;
      case '완료': return completedOrders;
      default: return reqOrders;
    }
  }, [activeTab, reqOrders, ongoingOrders, completedOrders]);

  return (
    <div className="dashboard_container">
      <div className='today_date'>{now.format('YYYY년 M월 D일 (dd) HH:mm')}</div>

      {/* 1. 웰컴 메시지 */}
      <div className="welcome_msg">
        <h1>❤️ {isLoading ? '파트너' : profileData?.manager}님, 오늘도 화이팅 ❤️</h1>
      </div>

      {/* 2. 상단 통계 카드 - 이제 정확한 오늘 데이터만 보여줍니다 */}
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
                {['요청', '진행', '완료'].map((tab) => {
                  // 탭 별 카운트 계산
                  let count = 0;
                  if (tab === '요청') count = reqOrders.length;
                  else if (tab === '진행') count = ongoingOrders.length;
                  else if (tab === '완료') count = completedOrders.length;

                  return (
                    <button
                      key={tab}
                      className={activeTab === tab ? 'active' : ''}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab} ({count})
                    </button>
                  );
                })}
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
                {loading && displayOrders.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>데이터 갱신 중...</td></tr>
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
                        {/* 상세 페이지로 이동 기능 연결 */}
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
            <div className="chart_placeholder_img">
              {/* 차트 컴포넌트에도 오늘 데이터만 전달하거나, 내부에서 처리 */}
              <HourlyOrderChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;