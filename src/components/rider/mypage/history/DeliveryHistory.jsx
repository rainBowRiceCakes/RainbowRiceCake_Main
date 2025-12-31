// Health check comment
// src/components/rider/mypage/history/DeliveryHistory.jsx
import "./DeliveryHistory.css";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/ko'; // Import Korean locale

dayjs.locale('ko');

const FILTERS = {
  "한 달": 30,
  "두 달": 60,
  "세 달": 90,
};

export default function DeliveryHistory() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const { id } = useParams();

  // Read from localStorage on initial render, or default to "한 달"
  const [activeFilter, setActiveFilter] = useState(() => {
    const savedFilter = localStorage.getItem('deliveryHistoryActiveFilter');
    return savedFilter || "한 달";
  });

  // Save activeFilter to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('deliveryHistoryActiveFilter', activeFilter);
  }, [activeFilter]);


  // const orders = useSelector((state) => state.orders?.orders ?? []);

  // const order = useMemo(
  //   () => orders.find((o) => String(o.orderNo) === String(orderId)),
  //   [orders, orderId]
  // ); 

  // Filter and paginate history data
  const { groupedPaginatedHistory, totalPages, totalFilteredItems } = useMemo(() => {
    const daysToFilter = FILTERS[activeFilter];
    const cutoffDate = dayjs().subtract(daysToFilter, 'day').startOf('day');

    // const filteredData = dummyDeliveryHistory.filter(item => 
    //   dayjs(item.completedAt).isAfter(cutoffDate)
    // );

    const calculatedTotalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Group the paginated data by date
    const groups = paginatedData.reduce((acc, item) => {
      const date = dayjs(item.completedAt).format("MM/DD (ddd)"); // Use formatted date as key
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
  }, [activeFilter, currentPage]);

  // Removed useEffect for setCurrentPage(1) on filter change

  return (
    <div className="dh-container">
      <div className="dh-filter-bar">
        {Object.keys(FILTERS).map((filter) => (
          <button
            key={filter}
            className={`dh-filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => {
              setActiveFilter(filter);
              setCurrentPage(1); // Reset page when filter changes
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="dh-total-deliveries">총 {totalFilteredItems}건 배달 내역</p>

      {totalFilteredItems > 0 ? (
        Object.entries(groupedPaginatedHistory).map(([date, items]) => (
          <div key={date} className="dh-date-group-card">
            <h3 className="dh-group-header">{date}</h3>
            <div className="dh-history-list">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="dh-history-item"
                  onClick={() => navigate(`/rider/${id}/orders/${item.id}`)}
                >
                  <div className="dh-item-time">
                    {dayjs(item.completedAt).format("HH:mm")}
                  </div>
                  <div className="dh-item-details">
                    <p className="dh-details-main">{item.pickup} - {item.dropoff}</p>
                    <p className="dh-details-sub">
                      {{
                        small: "베이직",
                        medium: "스탠다드",
                        large: "플러스",
                      }[item.bagSize] || "-"} - {item.bagCount}개</p>
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