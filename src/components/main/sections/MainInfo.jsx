/**
 * @file src/components/main/sections/MainInfo.jsx
 * @description 메인 서비스 안내
 * 251216 v1.0.0 sara init 
 */

import './MainInfo.css';

export default function MainInfo() {
  return (
    // section -> div, class, id update
    <div className="maininfo-frame mainshow-section-frame" id="info"> 
      <div className="mainshow-section-wrapper">
        
        {/* Section Head: section__head -> maininfo-header-group */}
        <div className="maininfo-header-group">
          <div>
            <h2 className="maininfo-title-text">서비스 소개</h2>
            <p className="maininfo-desc-text">
              QR/영수증 기반으로 간편 접수하고 안전하게 보관·배송하는 서비스예요.
            </p>
          </div>

          <div className="maininfo-actions-group">
            {/* btn -> maininfo-button */}
            <a className="maininfo-button maininfo-button--primary" href="#fee">
              요금 안내
            </a>
            <a className="maininfo-button" href="#fee">
              지점 안내
            </a>
          </div>
        </div>

        {/* Content Grid: grid-2 -> maininfo-grid-2 */}
        <div className="maininfo-grid-2">
          {/* Card 1: card -> maininfo-card-box */}
          <div className="maininfo-card-box maininfo-card-box--step">
            <h3 className="maininfo-card-title-text">
              이용 방법 (Step Flow)
            </h3>
            {/* List remains ol/li, add classes */}
            <ol className="maininfo-step-list">
              <li>매장 도착 → 제휴 매장/보관소 방문</li>
              <li>Staff 안내에 따라 Form 작성(숙소/연락처 등)</li>
              <li>픽업/보관 진행(사진 인증 예시)</li>
              <li>호텔/목적지 연계 배송 → 완료 알림(영수증 고유번호)</li>
            </ol>

            {/* Inlined box -> maininfo-note-box */}
            <div className="maininfo-note-box maininfo-note-box--trust">
              <div className="maininfo-note-title-text">신뢰 요소</div>
              <p className="maininfo-note-desc-text">
                staff/관리자 관리, 보관 위치 안내, CCTV 여부, 분실·파손 방지 정책 기반 운영.
              </p>
            </div>
          </div>

          {/* Card 2: card -> maininfo-card-box */}
          <div className="maininfo-card-box maininfo-card-box--size">
            <h3 className="maininfo-card-title-text">
              물품 사이즈 안내
            </h3>
            <p className="maininfo-card-desc-text">
              사이즈 및 보관 장소는 지점 상황에 따라 다를 수 있어요.
            </p>

            {/* Size Grid: grid-3 -> maininfo-grid-3 */}
            <div className="maininfo-grid-3">
              {/* Item with inline style -> maininfo-size-item */}
              <div className="maininfo-size-item">
                <div className="maininfo-size-title-text">Small</div>
                <div className="maininfo-size-desc-text">80 × 75 × 200cm</div>
              </div>
              <div className="maininfo-size-item">
                <div className="maininfo-size-title-text">Medium</div>
                <div className="maininfo-size-desc-text">100 × 85 × 220cm</div>
              </div>
              <div className="maininfo-size-item">
                <div className="maininfo-size-title-text">Large</div>
                <div className="maininfo-size-desc-text">140 × 100 × 240cm</div>
              </div>
            </div>

            {/* Note Group */}
            <div className="maininfo-note-group">
              <div className="maininfo-note-item">
                <div className="maininfo-note-title-text">주의/제한</div>
                <div className="maininfo-note-desc-text">
                  현금/귀중품 · 위험물 · 파손 위험 · 음식물(부패 가능)은 보관 불가.
                </div>
              </div>

              <div className="maininfo-note-item">
                <div className="maininfo-note-title-text">지점 제한 고지</div>
                <div className="maininfo-note-desc-text">
                  지점별 보관 가능 사이즈 상이 · 수량 제한 시 대기 발생 가능.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}