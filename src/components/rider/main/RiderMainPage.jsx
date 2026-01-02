// components/rider/main/RiderMainPage.jsx
import "./RiderMainPage.css";

import { useState, useMemo, useEffect } from "react";
import {
  setOngoingNotices,
}
  from "../../../store/slices/noticesSlice.js";
import { noticeIndexThunk } from "../../../store/thunks/notices/noticeIndexThunk.js";
import { orderIndexThunk } from "../../../store/thunks/orders/orderIndexThunk.js";

import RiderInfoBar from "./header/RiderInfoBar.jsx";
import RiderStatusTabs from "./header/RiderStatusTabs.jsx";
import RiderNoticeBar from "./header/RiderNoticeBar.jsx";

import RiderWaitingView from "../orders/waiting/RiderWaitingView.jsx";
import RiderInProgressView from "../orders/inProgress/RiderInProgressView.jsx";
import RiderCompletedView from "../orders/completed/RiderCompletedView.jsx";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { acceptOrder, setActiveTab } from "../../../store/slices/ordersSlice.js";

const IITEMS_PER_PAGE = 5;

export default function RiderMainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { orders, pagination, loading, error, activeTab } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth); // ✅ 이 줄 추가
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders based on activeTab
  useEffect(() => {
    // 유저 정보가 없으면 요청하지 않음
    if (!user?.id) return;

    dispatch(noticeIndexThunk({ page: 1, limit: 100, from: 'rider' }));

    let params = {
      date: 'today',
      page: currentPage,
      limit: IITEMS_PER_PAGE,
    };

    switch (activeTab) {
      case 'waiting':
        // 모든 라이더가 볼 수 있는 대기 중인 주문
        params.status = 'req';
        break;

      case 'inProgress':
        // 내가 수락한 진행 중인 주문
        params.riderId = user.id;
        params.status = ['mat', 'pick'];
        break;

      case 'completed':
        // 내가 완료한 주문
        params.riderId = user.id;
        params.status = 'com';
        break;
    }
    console.log('📤 보내는 params:', params);
    dispatch(orderIndexThunk(params));
  }, [dispatch, activeTab, currentPage, user?.id]);

  // 2. 💡 (추가) 가져온 데이터를 현재 탭에 맞게 한 번 더 검러내는 역할
  const filteredOrders = useMemo(() => {
    // orders가 로딩 중이거나 비어있을 때 방어 로직
    const orderList = Array.isArray(orders) ? orders : [];

    // 2. 백엔드에서 이미 params.status를 통해 필터링된 결과만 보내주고 있습니다.
    // 따라서 프론트에서 또 filter를 빡빡하게 걸면 데이터가 사라질 수 있습니다.
    if (orderList.length > 0) {
      console.log("✅ 주문 데이터 구조 확인:", orderList[0]);
    } else {
      console.log("⚠️ 현재 orders 배열이 비어있습니다.");
    }
    return orderList;
  }, [orders, activeTab]); // orders나 탭이 바뀔 때만 계산

  const pagedOrders = useMemo(() => {
    const items = filteredOrders || [];

    const totalPage = pagination?.totalPages || 1;
    const totalCount = pagination?.totalItems || items.length;

    return {
      items,
      totalPage,
      totalCount
    };
  }, [filteredOrders, pagination]);

  // 2. 탭 변경 핸들러는 dispatch와 페이지 리셋을 함께 담당
  const handleTabChange = (newTab) => {
    dispatch(setActiveTab(newTab));
    setCurrentPage(1);
  };

  const handleNavigateToNotices = () => {
    navigate(`/riders/mypage/notices`);
  };

  const { allNotices } = useSelector((state) => state.notices);

  // 진행 중인 공지사항 필터링 (메모이제이션)
  const ongoingNotices = useMemo(() => {
    return allNotices.filter((notice) => notice.status === true);
  }, [allNotices]);

  // ongoingNotices가 변경될 때마다 store 업데이트 (RiderNoticeBar가 store를 사용하므로)
  useEffect(() => {
    dispatch(setOngoingNotices(ongoingNotices));
  }, [dispatch, ongoingNotices]);

  if (loading) {
    return <div className="rider-loading">Loading...</div>;
  }

  return (
    <div className="rider-main">
      <RiderInfoBar />
      <RiderStatusTabs activeTab={activeTab} onChange={handleTabChange} />
      <RiderNoticeBar riderId={id} onNavigateToNotices={handleNavigateToNotices} />

      {error ? (
        <div className="rider-error-message" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          Error: {error.message || "오류가 발생했습니다."}
        </div>
      ) : (
        <div className="rider-content-area">
          {activeTab === "waiting" && (
            <RiderWaitingView orders={pagedOrders.items} currentTab={activeTab} />
          )}
          {activeTab === "inProgress" && (
            <RiderInProgressView orders={pagedOrders.items} />
          )}
          {activeTab === "completed" && (
            <RiderCompletedView orders={pagedOrders.items} />
          )}
        </div>
      )}

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