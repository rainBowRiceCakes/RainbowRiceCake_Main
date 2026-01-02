import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileThunk } from '../../../store/thunks/profile/getProfileThunk.js';
import PartnerStatCard from './PartnerStatCard';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('요청');
  const dispatch = useDispatch();

  // 1. 리덕스 상태 가져오기
  const profile = useSelector((state) => state.profile.profileData);
  const isLoading = useSelector((state) => state.profile.isLoading);
  const error = useSelector((state) => state.profile.error);

  // 2. 컴포넌트 마운트 시 프로필 요청
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // 3. 에러 처리
  if (error) {
    return (
      <div className="error_container">
        에러 발생: {error.msg || error.message || "알 수 없는 에러가 발생했습니다."}
      </div>
    );
  }

  // 4. 로딩 처리 (데이터가 없을 때만 로딩 표시)
  if (isLoading && !profile) {
    return <div className="loading_container">데이터를 불러오는 중입니다...</div>;
  }

  // 5. 메인 UI 반환 (이 부분이 함수 내부에 있어야 합니다)
  return (
    <div className="dashboard_container">
      {/* 1. 웰컴 메시지 영역 */}
      <div className="welcome_msg">
        <h1>
          {profile?.krName || "점주"}
          <span>점주님을 언제나 응원해요!</span>
        </h1>
      </div>

      <div className="stats_grid">
        <PartnerStatCard title="오늘 배송 요청" count={12} color="yellow" icon="📦" />
        <PartnerStatCard title="진행 중 배송" count={5} color="pink" icon="🛵" />
        <PartnerStatCard title="오늘 완료 배송" count={5} color="mint" icon="✅" />
      </div>

      <div className="main_content_grid">
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
              </tbody>
            </table>
            <div className="table_footer">
              <button className="view_all_link">배송 내역 전체 보기 ➔</button>
            </div>
          </div>
        </div>

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
  ); // return 끝
}; // 컴포넌트 끝

export default PartnerDashboard;