// components/rider/main/RiderMainPage.jsx
import "./RiderMainPage.css";
import { useState, useMemo, useEffect } from "react";
import { dummyNotices } from "../../../data/dummyNotices.js";
import {
  setAllNotices,
  setTodaysNotices,
} from "../../../store/slices/noticesSlice.js";

import RiderInfoBar from "./header/RiderInfoBar.jsx";
import RiderStatusTabs from "./header/RiderStatusTabs.jsx";
import RiderNoticeBar from "./header/RiderNoticeBar.jsx";

import RiderWaitingView from "../orders/waiting/RiderWaitingView.jsx";
import RiderInProgressView from "../orders/inProgress/RiderInProgressView.jsx";
import RiderCompletedView from "../orders/completed/RiderCompletedView.jsx";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ORDER_STATUS } from "../../../../src/constants/orderStatus.js";
import { acceptOrder, setActiveTab } from "../../../store/slices/ordersSlice.js";

export default function RiderMainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const orders = useSelector((state) => state.orders?.orders ?? []);
  const activeTab = useSelector((state) => state.orders.activeTab);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. 페이지네이션과 필터링 로직을 하나의 useMemo로 통합
  const pagedOrders = useMemo(() => {
    const filterByStatus = {
      waiting: (o) => o.statusCode === ORDER_STATUS.REQUESTED,
      inProgress: (o) =>
        [ORDER_STATUS.MATCHED, ORDER_STATUS.DELIVERING].includes(o.statusCode),
      completed: (o) => o.statusCode === ORDER_STATUS.COMPLETED,
    };

    const currentTabOrders = orders.filter(
      filterByStatus[activeTab] || (() => true)
    );
    const totalPage = Math.ceil(currentTabOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    return {
      items: currentTabOrders.slice(startIndex, startIndex + itemsPerPage),
      totalPage,
    };
  }, [orders, activeTab, currentPage]);

  // 2. 탭 변경 핸들러는 dispatch와 페이지 리셋을 함께 담당
  const handleTabChange = (newTab) => {
    dispatch(setActiveTab(newTab));
    setCurrentPage(1);
  };

  const handleNavigateToNotices = () => {
    navigate(`/rider/${id}/mypage/notices`);
  };
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

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const todayFormatted = `${year}/${month}/${day}`;

    const filteredTodaysNotices = dummyNotices.filter(
      (notice) => notice.date === todayFormatted
    );

    dispatch(setAllNotices(dummyNotices));
    dispatch(setTodaysNotices(filteredTodaysNotices));
  }, [dispatch]);

  return (
    <div className="rider-main">
      <RiderInfoBar />
      <RiderStatusTabs activeTab={activeTab} onChange={handleTabChange} />
      <RiderNoticeBar riderId={id} onNavigateToNotices={handleNavigateToNotices} />

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