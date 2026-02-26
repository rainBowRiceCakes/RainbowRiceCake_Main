// components/rider/main/RiderMainPage.jsx
import "./RiderMainPage.css";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { noticeIndexThunk } from "../../../store/thunks/notices/noticeIndexThunk.js";

dayjs.extend(utc);
dayjs.extend(timezone);
const KST = "Asia/Seoul";
import { orderIndexThunk } from "../../../store/thunks/orders/orderIndexThunk.js";
import { getProfileThunk } from "../../../store/thunks/profile/getProfileThunk.js";

import RiderInfoBar from "./header/RiderInfoBar.jsx";
import RiderStatusTabs from "./header/RiderStatusTabs.jsx";
import RiderNoticeBar from "./header/RiderNoticeBar.jsx";

import RiderWaitingView from "../orders/waiting/RiderWaitingView.jsx";
import RiderInProgressView from "../orders/inProgress/RiderInProgressView.jsx";
import RiderCompletedView from "../orders/completed/RiderCompletedView.jsx";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setActiveTab, upsertOrder, deleteOrder } from "../../../store/slices/ordersSlice.js";
import { socket } from "../../../utils/socket.js";

const ITEMS_PER_PAGE = 9;

export default function RiderMainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { orders, loading, error, activeTab } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const profileData = useSelector((state) => state.profile?.profileData);
  const allNotices = useSelector((state) => state.notices.allNotices);

  // profileData.id가 기사 고유 번호 (20번)
  // profileData.rider_user.id는 로그인 사용자 ID (181번)
  const riderUniqueId = profileData?.id;

  // 진행 중인 주문 (Single Source of Truth: orders 배열에서 현재 기사의 '배차됨', '픽업함' 추출)
  const ongoingOrders = Array.isArray(orders) ? orders.filter(o => {
    const oRiderId = o.order_rider?.id;
    return (o.status === "mat" || o.status === "pick") && String(oRiderId) === String(riderUniqueId);
  }) : [];
  const ongoingCount = ongoingOrders.length;

  // 프로필 및 공지사항 로드
  useEffect(() => {
    if (!profileData) {
      dispatch(getProfileThunk());
    }
    dispatch(noticeIndexThunk({ page: 1, limit: 100, from: 'rider' }));
  }, [dispatch, profileData]);

  // ongoing한 공지사항만 필터링
  const ongoingNotices = allNotices.filter(notice => notice.status === true);

  // 실시간 주문 업데이트 수신 (Patch 방식)
  useEffect(() => {
    if (!user?.id) return;

    // 1. 새 주문 알림 및 추가
    socket.on("new_order", (data) => {
      console.log("실시간 새 주문 수신:", data);
      dispatch(upsertOrder(data));
    });

    // 2. 주문 상태 변경 (배차됨, 픽업함, 완료 등)
    socket.on("order_status_changed", (data) => {
      console.log("실시간 상태 변경 수신:", data);
      dispatch(upsertOrder(data));
    });

    // 3. 주문 취소
    socket.on("order_cancelled", (data) => {
      console.log("실시간 주문 취소 수신:", data);
      dispatch(deleteOrder(data.orderCode || data.id));
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_changed");
      socket.off("order_cancelled");
    };
  }, [dispatch, user?.id]);

  // 주문 최초 1회 로드 (전체 상태 통합 로드)
  useEffect(() => {
    if (!user?.id) return;

    const params = {
      date: 'today',
      limit: 1000, // 전체 데이터를 가져오기 위해 충분히 큰 값 설정
      // 모든 관심 상태를 한 번에 조회
      status: ['req', 'mat', 'pick', 'com']
    };

    dispatch(orderIndexThunk(params));
  }, [dispatch, user?.id]);

  // 에러 처리 전용
  useEffect(() => {
    if (error?.includes('acceptOrder')) {
      alert(error);
    }
  }, [error]);

  // 필터링된 주문 목록 (로컬 필터링)
  const filteredOrders = Array.isArray(orders) ? orders.filter(o => {
    const oRiderId = o.order_rider?.id;
    if (activeTab === 'waiting') return o.status === 'req';
    if (activeTab === 'inProgress') return (o.status === 'mat' || o.status === 'pick') && String(oRiderId) === String(profileData?.id);
    if (activeTab === 'completed') {
      const isCompleted = o.status === 'com' && String(oRiderId) === String(riderUniqueId);
      if (!isCompleted) return false;

      // 오늘 날짜인지 체크 (KST 기준)
      const today = dayjs().tz(KST).format("YYYY-MM-DD");
      const orderDate = dayjs(o.updatedAt).tz(KST).format("YYYY-MM-DD");
      return orderDate === today;
    }
    return false;
  }) : [];

  // 페이지네이션 로직 (로컬 데이터 기반으로 변경)
  const [currentPage, setCurrentPage] = useState(1); // Added useState for currentPage
  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentItems = filteredOrders.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

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
              orders={currentItems}
              ongoingCount={ongoingCount}
            />
          )}
          {activeTab === "inProgress" && (
            <RiderInProgressView orders={currentItems} />
          )}
          {activeTab === "completed" && (
            <RiderCompletedView orders={currentItems} />
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            이전
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}