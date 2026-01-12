import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PartnerOrderListPage.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const KST = "Asia/Seoul";

const PartnerOrderListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redux에서 데이터와 함께 '서버가 계산한 pagination 정보'를 가져와야 합니다.
  // (store의 reducer에서 action.payload.pagination을 저장하도록 설정되어 있어야 함)
  const { orders, pagination, loading: isLoading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // ✅ 서버에 데이터 요청 (useEffect)
  useEffect(() => {
    dispatch(orderIndexThunk({
      page: currentPage,
      limit: 9,
      // 날짜가 있으면 서버가 이해하는 YYYY-MM-DD 형식으로 변환
      startDate: selectedDate ? dayjs(selectedDate).tz(KST).format('YYYY-MM-DD') : null,
      endDate: selectedDate ? dayjs(selectedDate).tz(KST).format('YYYY-MM-DD') : null,
      status: selectedStatus,
      orderCode: searchTerm
    }));
  }, [currentPage, selectedDate, selectedStatus, searchTerm, dispatch]);

  // ✅ [수정] 프론트엔드 필터링/슬라이싱 로직 모두 삭제!
  // 이제 filteredOrders나 currentItems 대신 서버가 준 'orders'를 직접 사용합니다.
  const displayOrders = orders || [];
  const totalItems = pagination?.totalItems || 0;
  const totalPages = pagination?.totalPages || 1;

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setSelectedStatus("");
    setCurrentPage(1);
    // ✅ 리셋 시에도 limit: 9로 서버 사이드 정책 유지
    dispatch(orderIndexThunk({ page: 1, limit: 9 }));
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
            placeholder="주문 번호 검색"
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
              {displayOrders.length > 0 ? (
                displayOrders.map((order) => (
                  <tr key={order.orderCode}>
                    <td className="text_bold clickable_id" onClick={() => navigate(`/partners/orders/${order.orderCode}`)}>
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
                    <td>{dayjs(order.createdAt).tz(KST).format('YYYY.MM.DD (ddd) A hh:mm')}</td>
                    <td>{renderStatusBadge(order.status)}</td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan="6" className="no_data_cell">
                    조회된 내역이 없습니다.
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`page_btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="page_btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
          <div className="pagination_info">
            총 {totalItems}개 중 {(currentPage - 1) * 9 + 1} - {Math.min(currentPage * 9, totalItems)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerOrderListPage;