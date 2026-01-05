import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PartnerOrderListPage.css';
import dayjs from 'dayjs';

const PartnerOrderListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux에서 전체 데이터 가져오기
  const { orders: allOrders, loading: isLoading } = useSelector((state) => state.orders);

  // ✅ [핵심 1] 화면에 9개씩만 보여주겠다고 선언
  const itemsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // ✅ [핵심 2] 데이터 Fetch: 페이지네이션 상관없이 '전체 데이터'를 한 번에 다 가져옵니다.
  // limit을 1000으로 주어 사실상 모든 데이터를 로드합니다.
  useEffect(() => {
    dispatch(orderIndexThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  // --- 클라이언트 필터링 (메모리 상에 있는 1000개 데이터를 거름망으로 거름) ---
  const filteredOrders = allOrders.filter(order => {
    // 1. 날짜 필터
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
    const matchesDate = selectedDateStr ? orderDate === selectedDateStr : true;

    // 2. 검색어 필터
    const matchesSearch =
      (order.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.order_hotel?.krName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.id?.toString() || "").includes(searchTerm);

    // 3. 상태 필터
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;

    return matchesDate && matchesSearch && matchesStatus;
  });

  // ✅ [핵심 3] 프론트엔드 페이지네이션 계산 (Slicing)
  // 전체(filteredOrders) 중에서 현재 페이지에 해당하는 9개만 '똑' 떼어냅니다.
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // 현재 페이지가 전체 페이지보다 크면 1페이지로 강제 조정 (안전장치)
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 👉 여기가 9개만 자르는 부분입니다.
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // --- 핸들러 함수들 ---
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setSelectedStatus("");
    setCurrentPage(1);
    // 데이터 최신화를 위해 다시 전체 로드
    dispatch(orderIndexThunk({ page: 1, limit: 1000 }));
  };

  const renderStatusBadge = (statusCode) => {
    const statusMap = {
      req: { text: "배달 요청 완료", class: "status_req" },
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

      {/* 검색 & 필터 */}
      <div className="filter_container">
        <div className="filter_left">
          <div className="filter_icon">🔍</div>

          <div className="filter_item">
            <span className="filter_label">날짜 선택</span>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1); // 필터 변경 시 1페이지로
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜 선택"
              className="filter_select"
            />
          </div>

          <div className="filter_item">
            <select
              className="filter_select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1); // 필터 변경 시 1페이지로
              }}
            >
              <option value="">상태 전체</option>
              <option value="req">배달 요청 완료</option>
              <option value="mat">기사 매칭 완료</option>
              <option value="pick">배달 진행 중</option>
              <option value="com">배달 완료</option>
            </select>
          </div>

          <button className="reset_button" onClick={handleReset}>
            🔄 Reset Filter
          </button>
        </div>

        <div className="search_box">
          <input
            type="text"
            placeholder="고객명, 호텔명, 주문 번호 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 검색 시 1페이지로
            }}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="table_container">
        {isLoading ? (
          <p className="loading_text">데이터를 불러오는 중...</p>
        ) : (
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
                  <tr key={order.orderCode}>
                    <td className="text_bold clickable_id" onClick={() => navigate(`/partner/orders/${order.id}`)}>
                      {order.orderCode}
                    </td>
                    <td>{order.name}</td>
                    <td>{order.order_hotel?.krName || "-"}</td>
                    <td>
                      <div className="order_detail_cell">
                        {order.cntS > 0 && <div>베이직 - {order.cntS}</div>}
                        {order.cntM > 0 && <div>스탠다드 - {order.cntM}</div>}
                        {order.cntL > 0 && <div>프리미엄 - {order.cntL}</div>}
                      </div>
                    </td>
                    <td>{dayjs(order.createdAt).format('YYYY-MM-DD A HH:mm')}</td>
                    <td>{renderStatusBadge(order.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no_data_cell">
                    {allOrders.length === 0 ? "데이터가 없습니다." : "검색 결과가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 버튼 */}
      {!isLoading && totalItems > 0 && (
        <div className="pagination_wrapper">
          <div className="pagination">
            <button
              className="page_btn"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
            >
              {"<"}
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`page_btn ${safeCurrentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="page_btn"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
            >
              {">"}
            </button>
          </div>
          {/* 하단 정보 표시 (선택사항) */}
          <div className="pagination_info">
            총 {totalItems}개 중 {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerOrderListPage;