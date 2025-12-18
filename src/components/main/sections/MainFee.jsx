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
          <div className="mainfee-title-text">가격 및 지점 안내</div>
          <div className="mainfee-subtitle-text">합리적인 가격과 신선함을 위한 배송/픽업 지점을 확인하세요.</div>
        </div>
        
        <div className="mainfee-content-flex">
          
          {/* option 1 */}
          {/* 1. 가격표 컨테이너
          <div className="mainfee-price-box">
            <div className="mainfee-box-title">일반 배송료 안내</div>
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row mainfee-table-header-row">
                <div className="mainfee-table-cell mainfee-table-cell--region">대구 </div>
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
          </div> */}

         {/* option 2 */}
         {/* 1. 가격표 컨테이너 */}
          <div className="mainfee-price-box">
            <div className="mainfee-box-title">대구 지역 배송료 안내</div>
            
            {/* 기본 배송료 체계 (5,000원~10,000원 기준) */}
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row mainfee-table-header-row">
                <div className="mainfee-table-cell">주문 금액</div>
                <div className="mainfee-table-cell">기본 배송료</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">10,000원 이상</div>
                <div className="mainfee-table-cell mainfee-fee-free">무료</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">5,000원 ~ 10,000원 미만</div>
                <div className="mainfee-table-cell">1,000원</div>
              </div>
            </div>

            {/* 두 번째 이미지 스타일의 지역별 추가 요금 */}
            <div className="mainfee-box-title">지역별 추가요금</div>
            <div className="mainfee-table-wrapper" >
              <div>
                <strong>대봉1동, 대신동, 성내동 :</strong> <span>+500원</span>
              </div>
              <div>
                <strong>내당동, 대명동, 두류동 :</strong> <span>+1,000원</span>
              </div>
              <div>
                삼덕동 및 기타 외곽 지역은 <strong>1,500원</strong>
              </div>
            </div>

            {/* 시간 할증 */}
            <div className="mainfee-box-title">야간 및 공휴일 할증</div>
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">23:00 ~ 02:00 (일,월,수,금)</div>
                <div className="mainfee-table-cell">+500원</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};