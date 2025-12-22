// components/rider/main/RiderMainPage.jsx
import "./RiderMainPage.css";
import { useState, useMemo, useEffect } from "react";

import RiderInfoBar from "./header/RiderInfoBar.jsx";
import RiderStatusTabs from "./header/RiderStatusTabs.jsx";
import RiderNoticeBar from "./header/RiderNoticeBar.jsx";

import RiderWaitingView from "../orders/waiting/RiderWaitingView.jsx";
import RiderInProgressView from "../orders/inProgress/RiderInProgressView.jsx";
import RiderCompletedView from "../orders/completed/RiderCompletedView.jsx";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ORDER_STATUS } from "../../../../src/constants/orderStatus.js";
import { acceptOrder } from "../../../store/slices/ordersSlice.js";

// ... import 생략

export default function RiderMainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const orders = useSelector((state) => state.orders?.orders ?? []);

  // ✅ 1. tabOrders를 먼저 계산해야 activeTab 초기값에서 참조할 수 있습니다.
  const tabOrders = useMemo(() => {
    const waiting = orders.filter((o) => o.statusCode === ORDER_STATUS.REQUESTED);
    const inProgress = orders.filter((o) =>
      [ORDER_STATUS.MATCHED, ORDER_STATUS.DELIVERING].includes(o.statusCode)
    );
    const completed = orders.filter((o) => o.statusCode === ORDER_STATUS.COMPLETED);

    return { waiting, inProgress, completed };
  }, [orders]);

  // ✅ 2. 상태 선언 (중복 제거)
  const [activeTab, setActiveTab] = useState(() => {
    console.log('test', location.state?.activeTab, tabOrders.inProgress);
    // 우선순위: 1. 전달받은 state -> 2. 진행중인 오더 존재 여부 -> 3. 기본값 waiting
    if (location.state?.activeTab) return location.state.activeTab;
    if (tabOrders.inProgress.length > 0) return "inProgress";
    return "waiting";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ 3. 핸들러 함수 (하나로 통합)
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  // ✅ 4. Effect 관리: 외부 state 변경 및 진행중 오더 자동 전환
  useEffect(() => {
    // 다른 페이지에서 탭을 지정해서 넘어온 경우
    if (location.state?.activeTab) {
      const timer = setTimeout(() => {
        setActiveTab(location.state.activeTab);
        setCurrentPage(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    // 1. 조건 체크 (진행 중인 오더가 있고, 현재 탭이 대기일 때)
    if (activeTab === "waiting" && tabOrders.inProgress.length > 0 && !location.state?.activeTab) {

      // 2. 렌더링 사이클 충돌을 피하기 위해 비동기로 실행
      const timer = setTimeout(() => {
        setActiveTab("inProgress");
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [tabOrders.inProgress.length, activeTab, location.state]);

  // ✅ 5. 페이지네이션 데이터 계산
  const pagedOrders = useMemo(() => {
    const currentTabTotalOrders = tabOrders[activeTab] || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      items: currentTabTotalOrders.slice(startIndex, endIndex),
      totalPage: Math.ceil(currentTabTotalOrders.length / itemsPerPage),
    };
  }, [tabOrders, activeTab, currentPage]);

  const handleAccept = (order) => {
    const actualOrderNo = typeof order === 'object' ? order.orderNo : order;
    if (!actualOrderNo) return;

    dispatch(acceptOrder(actualOrderNo));
    navigate(`/rider/${id}/navigate/${actualOrderNo}`, {
      state: {
        justAccepted: true,
        message: "배달이 시작됐어요! 픽업 장소로 이동해주세요 🚴‍♂️",
      },
    });
  };

  return (
    <div className="rider-main">
      <RiderInfoBar />
      <RiderStatusTabs activeTab={activeTab} onChange={handleTabChange} />
      <RiderNoticeBar />

      <div className="rider-content-area">
        {activeTab === "waiting" && (
          <RiderWaitingView orders={pagedOrders.items} onAccept={handleAccept} />
        )}
        {activeTab === "inProgress" && (
          <RiderInProgressView orders={pagedOrders.items} />
        )}
        {activeTab === "completed" && (
          <RiderCompletedView orders={pagedOrders.items} />
        )}
      </div>

      {pagedOrders.totalPage > 1 && (
        <div className="pagination-container">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            이전
          </button>
          
          {[...Array(pagedOrders.totalPage)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === pagedOrders.totalPage} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}