// Health check comment
// src/components/rider/mypage/history/DeliveryHistory.jsx
import "./DeliveryHistory.css";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/ko'; // Import Korean locale
import { useDispatch, useSelector } from "react-redux";
import { orderIndexThunk } from "../../../../store/thunks/orders/orderIndexThunk.js";

dayjs.locale('ko');

const ITEMS_PER_PAGE = 5;

const FILTERS = {
  "한 달": 30,
  "두 달": 60,
  "세 달": 90,
};

export default function DeliveryHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const [activeFilter, setActiveFilter] = useState(() => {
    const savedFilter = localStorage.getItem('deliveryHistoryActiveFilter');
    return savedFilter || "한 달";
  });

  // Fetch orders with pagination from backend
  useEffect(() => {
    dispatch(orderIndexThunk({
      status: 'com',
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    localStorage.setItem('deliveryHistoryActiveFilter', activeFilter);
  }, [activeFilter]);

  console.log("Raw Orders:", orders)
  // 프론트에서 날짜 필터링 + 그룹핑만 처리
  const { groupedPaginatedHistory, totalPages, totalFilteredItems } = useMemo(() => {
    const orderList = Array.isArray(orders) ? orders : (orders?.rows || []);

    if (!orderList) {
      return { groupedPaginatedHistory: {}, totalPages: 0, totalFilteredItems: 0 };
    }

    const daysToFilter = FILTERS[activeFilter];
    const cutoffDate = dayjs().subtract(daysToFilter, 'day').startOf('day');

    // 백엔드에서 받은 데이터를 날짜로 필터링
    const filteredData = orderList.filter(item =>
      dayjs(item.completedAt).isAfter(cutoffDate)
    );

    const totalCount = orders?.count || 0;
    const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // 날짜별로 그룹핑
    const groups = filteredData.reduce((acc, item) => {
      const date = dayjs(item.completedAt).format("MM/DD (ddd)");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    return {
      groupedPaginatedHistory: groups,
      totalPages: calculatedTotalPages,
      totalFilteredItems: filteredData.length,
    };
  }, [orders, activeFilter]);

  // 필터 변경 시 페이지 리셋
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dh-container">
      <div className="dh-filter-bar">
        {Object.keys(FILTERS).map((filter) => (
          <button
            key={filter}
            className={`dh-filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => {
              handleFilterChange(filter);
              setCurrentPage(1); // Reset page when filter changes
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="dh-total-deliveries">총 {totalFilteredItems}건 배달 내역</p>

      {totalFilteredItems > 0 ? (
        Object.entries(groupedPaginatedHistory).map(([date, orders]) => (
          <div key={date} className="dh-date-group-card">
            <h3 className="dh-group-header">{date}</h3>
            <div className="dh-history-list">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="dh-history-item"
                  onClick={() => navigate(`/riders/mypage/orders/${order.orderCode}`)}
                >
                  <div className="dh-item-time">
                    {dayjs(order.updatedAt).format("HH:mm")}
                  </div>
                  <div className="dh-item-details">
                    <p className="dh-details-main">{order.order_partner.krName} - {order.order_hotel.krName}</p>
                    <div className="dh-details-sub">
                      {order.cntS > 0 && <span>베이직 {order.cntS}개 </span>}
                      {order.cntM > 0 && <span>스탠다드 {order.cntM}개 </span>}
                      {order.cntL > 0 && <span>플러스 {order.cntL}개 </span>}
                      {!(order.cntS > 0 || order.cntM > 0 || order.cntL > 0) && <span>-</span>}
                    </div>
                  </div>
                  <div className="dh-item-chevron">›</div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="dh-empty-message">배송 히스토리가 없습니다.</p>
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