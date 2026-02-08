// components/rider/main/RiderMainPage.jsx
import "./RiderMainPage.css";

import { useState, useEffect } from "react";
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
import { setActiveTab } from "../../../store/slices/ordersSlice.js";
import axiosInstance from "../../../api/axiosInstance.js";
import { orderOngoingThunk } from "../../../store/thunks/orders/orderOngoingThunk.js";

const ITEMS_PER_PAGE = 5;

export default function RiderMainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { orders, pagination, loading, error, activeTab, ongoingOrders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const allNotices = useSelector((state) => state.notices.allNotices);
  const [currentPage, setCurrentPage] = useState(1);

  const ongoingCount = ongoingOrders?.length || 0; // ✅ Redux 상태에서 진행 중 주문 개수 도출

  // 공지사항 로드
  useEffect(() => {
    dispatch(noticeIndexThunk({ page: 1, limit: 100, from: 'rider' }));
  }, [dispatch]);

  // ongoing한 공지사항만 필터링
  const ongoingNotices = allNotices.filter(notice => notice.status === true);

  // 진행 중인 주문 개수 조회 (Redux Thunk 사용)
  useEffect(() => {
    if (!user?.id) return;
    dispatch(orderOngoingThunk({ riderId: user.id }));
  }, [dispatch, user?.id, activeTab]); // activeTab 변경 시에도 갱신

  // 주문 로드
  useEffect(() => {
    if (!user?.id) return;

    const params = {
      date: 'today',
      page: currentPage,
      limit: ITEMS_PER_PAGE,

      ...(activeTab === 'waiting' && { status: 'req' }),
      ...(activeTab === 'inProgress' && { riderId: user.id, status: ['mat', 'pick'] }),
      ...(activeTab === 'completed' && { riderId: user.id, status: 'com' }),
    };

    dispatch(orderIndexThunk(params));
  }, [dispatch, activeTab, currentPage, user?.id, error]);

  // 에러 처리 전용
  useEffect(() => {
    if (error?.includes('acceptOrder')) {
      alert(error);
    }
  }, [error]);

  // 필터링된 주문 목록
  const pagedOrders = {
    items: Array.isArray(orders) ? orders : [],
    totalPage: pagination?.totalPages || 1,
    totalCount: pagination?.totalItems || 0
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    dispatch(setActiveTab(newTab));
    setCurrentPage(1);
  };

  if (loading && currentPage === 1) {
    return <div className="rider-loading">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="rider-main">
      <RiderInfoBar ongoingCount={ongoingCount} />
      <RiderStatusTabs activeTab={activeTab} onChange={handleTabChange} />
      <RiderNoticeBar
        riderId={id}
        ongoingNotices={ongoingNotices}
        onNavigateToNotices={() => navigate('mypage/notices')}
      />

      {error ? (
        <div className="rider-error-message">오류: {error}</div>
      ) : (
        <div className="rider-content-area">
          {activeTab === "waiting" && (
            <RiderWaitingView
              orders={pagedOrders.items}
              ongoingCount={ongoingCount}
            />
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