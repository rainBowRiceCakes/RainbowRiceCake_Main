/**
 * @file src/components/common/Pagination.jsx
 * @description 페이지네이션 컴포넌트 (반응형, 블록 이동 기능)
 * 260108 sara init
 * 260108 user v2.0.0 - a11y, responsive logic, chunk navigation
 * 260108 user v3.0.0 - prev/next page buttons, conditional scroll
 */
import React from 'react';
import './Pagination.css';
import useWindowSize from '../../utils/useWindowSize';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { width } = useWindowSize();

  // 화면 너비에 따라 표시할 페이지 버튼 수를 결정
  const maxVisibleButtons = width <= 375 ? 3 : (width <= 500 ? 5 : 10);
  
  if (totalPages <= 1) {
    return null;
  }

  // --- Logic to determine which page numbers to show ---
  const startPage = Math.floor((currentPage - 1) / maxVisibleButtons) * maxVisibleButtons + 1;
  const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);
  
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // --- Handlers ---
  const handlePageClick = (pageNumber, shouldScroll) => {
    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onPageChange(pageNumber);
  };

  return (
    <nav className="pagination-container" aria-label="Page navigation">
      <ul className="pagination">
        {/* First Page */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(1, true)} 
            disabled={currentPage === 1}
          >
            &laquo;&laquo;
          </button>
        </li>
        
        {/* Previous Page */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(currentPage - 1, false)} 
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => handlePageClick(number, true)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        
        {/* Next Page */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(currentPage + 1, false)} 
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>

        {/* Last Page */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(totalPages, true)} 
            disabled={currentPage === totalPages}
          >
            &raquo;&raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
