import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './PartnerOrderListPage.css';

const PartnerOrderListPage = () => {
  const navigate = useNavigate();
  // Redux 스토어에서 전체 주문 데이터를 가져옵니다.
  const allOrders = useSelector((state) => state.orders.orders);
  const [searchTerm, setSearchTerm] = useState("");

  // --- 페이지네이션 로직 추가 ---
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 9; // 한 페이지에 보여줄 주문 개수


  // 검색 필터링 (주문번호, 고객명, 도착지 기준)
  const filteredOrders = allOrders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNo?.toString().includes(searchTerm)
  );

  // 2. 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // 3. 현재 페이지에 해당하는 데이터만 추출 (slice)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // 4. 페이지 번호 배열 생성 [1, 2, 3, ...]
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 상태 코드(DB값)에 따른 뱃지 렌더링 함수
  const renderStatusBadge = (statusCode) => {
    const statusMap = {
      req: { text: "배달 요청", class: "status_req" },
      mat: { text: "기사 매칭 완료", class: "status_mat" },
      pick: { text: "배달 진행 중", class: "status_pick" },
      com: { text: "배달 완료", class: "status_com" },
    };

    const currentStatus = statusMap[statusCode] || { text: "알 수 없음", class: "status_unknown" };
    return (
      <span className={`status_badge ${currentStatus.class}`}>
        {currentStatus.text}
      </span>
    );
  };

  return (
    <div className="order_list_page">
      <h2 className="page_title">배송 내역</h2>

      {/* 상단 필터 및 검색 바 */}
      <div className="filter_container">
        <div className="filter_left">
          <div className="filter_icon">🔍</div>
          <div className="filter_item">
            <span className="filter_label">Filter By</span>
            <select className="filter_select">
              <option>날짜 선택</option>
              <option>2025.01.22</option>
            </select>
          </div>
          <div className="filter_item">
            <select className="filter_select">
              <option value="">상태 전체</option>
              <option value="req">배달 요청 (req)</option>
              <option value="mat">기사 매칭 (mat)</option>
              <option value="pick">배달 진행 중 (pick)</option>
              <option value="com">배달 완료 (com)</option>
            </select>
          </div>
          <button className="reset_button" onClick={() => setSearchTerm("")}>
            🔄 Reset Filter
          </button>
        </div>

        <div className="search_box">
          <input
            type="text"
            placeholder="고객명, 호텔명, 주문 번호 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search_button">검색</button>
        </div>
      </div>

      {/* 배송 데이터 테이블 */}
      <div className="table_container">
        <table className="order_table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>고객명</th>
              <th>도착지</th>
              <th>주문 내역</th>
              <th>배송 요청 시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((order) => (
                <tr key={order.orderNo}>
                  <td className="text_bold clickable_id" onClick={() => navigate(`/partner/orders/${order.orderNo}`)}>
                    {order.orderNo}
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.destination}</td>
                  <td>
                    <div className="order_detail_cell">
                      {(order.pickupPhotoUrl || order.dropoffPhotoUrl) && <span className="photo_icon">📸 </span>}
                      {order.orderDetail}
                    </div>
                  </td>
                  <td>{order.createdAt}</td>
                  <td>{renderStatusBadge(order.statusCode)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="no_data_cell">데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 동적 페이지네이션 UI */}
      {totalPages > 0 && (
        <div className="pagination_wrapper">
          <div className="pagination">
            <button
              className="page_btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {pageNumbers.map(number => (
              <button
                key={number}
                className={`page_btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="page_btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerOrderListPage;