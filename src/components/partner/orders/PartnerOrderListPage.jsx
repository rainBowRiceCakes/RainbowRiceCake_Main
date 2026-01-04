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

  const { orders: allOrders, loading: isLoading, pagination } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ 추가
  const [selectedStatus, setSelectedStatus] = useState(""); // 추가
  const itemsPerPage = pagination.itemsPerPage || 9;

  // --- 데이터 fetch (페이지/필터 바뀔 때마다 호출) ---
  // --- 데이터 fetch (페이지 바뀔 때만 호출) ---
  useEffect(() => {
    dispatch(orderIndexThunk({ page: 1, limit: 1000 }));
  }, [dispatch]); // selectedDate 제거

  // --- 클라이언트 필터링 ---
  const filteredOrders = allOrders.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    const matchesDate = selectedDateStr ? orderDate === selectedDateStr : true;

    const matchesSearch =
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_hotel.krName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);

    const matchesStatus = selectedStatus ? order.status === selectedStatus : true; // ✅ 추가

    return matchesDate && matchesSearch && matchesStatus;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

          {/* ✅ 날짜 선택 달력 */}
          <div className="filter_item">
            <span className="filter_label">날짜 선택</span>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1);  // 페이지를 1로 초기화
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
                setCurrentPage(1); // 페이지 초기화
              }}
            >
              <option value="">상태 전체</option>
              <option value="req">배달 요청 완료</option>
              <option value="mat">기사 매칭 완료</option>
              <option value="pick">배달 진행 중</option>
              <option value="com">배달 완료</option>
            </select>
          </div>

          <button className="reset_button" onClick={() => {
            setSearchTerm("");
            setSelectedDate(null);
            setCurrentPage(1);
            dispatch(orderIndexThunk({ page: 1, limit: itemsPerPage }))
          }}>
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
        </div>
      </div>

      {/* 테이블 */}
      <div className="table_container">
        {isLoading ? (
          <p>로딩 중...</p>
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
                  <tr key={order.id}>
                    <td className="text_bold clickable_id" onClick={() => navigate(`/partner/orders/${order.id}`)}>
                      {order.id}
                    </td>
                    <td>{order.name}</td>
                    <td>{order.order_hotel.krName}</td>
                    <td>
                      <div className="order_detail_cell">
                        {order.cntS > 0 && <>베이직 - {order.cntS}개<br /></>}
                        {order.cntM > 0 && <>스탠다드 - {order.cntM}개<br /></>}
                        {order.cntL > 0 && <>플러스 - {order.cntL}개</>}
                      </div>
                    </td>
                    <td>{dayjs(order.createdAt).format('YYYY-MM-DD A HH:mm')}</td>
                    <td>{renderStatusBadge(order.status)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="no_data_cell">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 */}
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