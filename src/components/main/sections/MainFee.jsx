/**
 * @file src/components/main/sections/MainFee.jsx
 * @description 요금 안내 / 지점 안내 
 * 251216 v1.0.0 sara init 
 */

import './MainFee.css';

export default function MainFee() {
  return (
    // container -> frame, web-wrapper -> mainshow-section-wrapper, id="fee"
    <div className="mainfee-frame mainshow-section-frame" id="fee"> 
      <div className="mainshow-section-wrapper"> 
        <div className="mainfee-header">
          <div className="mainfee-title-text">💸 가격 및 지점 안내</div>
          <div className="mainfee-subtitle-text">합리적인 가격과 신선함을 위한 배송/픽업 지점을 확인하세요.</div>
        </div>
        
        <div className="mainfee-content-flex">
          
          {/* 1. 가격표 컨테이너 */}
          <div className="mainfee-price-box">
            <div className="mainfee-box-title">일반 배송료 안내</div>
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row mainfee-table-header-row">
                <div className="mainfee-table-cell mainfee-table-cell--region">지역 구분</div>
                <div className="mainfee-table-cell mainfee-table-cell--amount">주문 금액</div>
                <div className="mainfee-table-cell mainfee-table-cell--fee">배송료</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell mainfee-table-cell--region">서울/경기 일부</div>
                <div className="mainfee-table-cell mainfee-table-cell--amount">30,000원 이상</div>
                <div className="mainfee-table-cell mainfee-table-cell--fee mainfee-fee-free">무료</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell mainfee-table-cell--region">서울/경기 일부</div>
                <div className="mainfee-table-cell mainfee-table-cell--amount">30,000원 미만</div>
                <div className="mainfee-table-cell mainfee-table-cell--fee">3,500원</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell mainfee-table-cell--region">기타 지역</div>
                <div className="mainfee-table-cell mainfee-table-cell--amount">모든 금액</div>
                <div className="mainfee-table-cell mainfee-table-cell--fee">5,000원</div>
              </div>
            </div>
            <div className="mainfee-note-text">
                * 새벽 배송은 서울, 경기 일부 지역에 한해 가능하며, 상세 지역은 주문 시 확인됩니다.
            </div>
          </div>

          {/* 2. 지점 안내 컨테이너 */}
          <div className="mainfee-branch-box">
            <div className="mainfee-box-title">배송 출발 및 픽업 가능 지점</div>
            <div className="mainfee-branch-item">
              <div className="mainfee-branch-name">강남 본점 (새벽 배송 출발지)</div>
              <div className="mainfee-branch-address">서울 강남구 떡볶이로 123 (방문 픽업 가능)</div>
            </div>
            <div className="mainfee-branch-item">
              <div className="mainfee-branch-name">판교 지점 (일반 배송)</div>
              <div className="mainfee-branch-address">경기 성남시 분당구 라이스길 45 (픽업 불가)</div>
            </div>
            <div className="mainfee-branch-item">
              <div className="mainfee-branch-name">부산 지점 (일반 배송)</div>
              <div className="mainfee-branch-address">부산 해운대구 해변로 789</div>
            </div>
            <div className="mainfee-branch-map-link">
                <a href="#map" className="mainfee-map-link-button">지점 위치 지도에서 보기</a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};