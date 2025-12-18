/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 */

import './MainPTNSSearch.css';

export default function MainPTNSSearch() {
  return (
    <div className="ptnssearch-frame mainshow-section-wrapper">
      {/* 헤더 부분: 기존 섹션과 통일된 디자인 유지 */}
      <div className="maininfo-header-group">
        <div>
          <h2 className="maininfo-title-text">제휴 지점 찾기</h2>
          <p className="maininfo-desc-text">
            가까운 제휴 매장 및 보관소를 검색하고 위치를 확인해보세요.
          </p>
        </div>
      </div>

      {/* 메인 검색 카드 컨테이너 */}
      <div className="ptnssearch-card-box">
        
        {/* 상단: 검색 바 영역 */}
        <div className="ptnssearch-input-group">
          <input 
            type="text" 
            className="ptnssearch-input-field" 
            placeholder="지점명, 매장명 또는 지역을 입력하세요 (예: 대구역, 성내동)" 
          />
          <button className="maininfo-button maininfo-button--primary">
            검색
          </button>
        </div>

        {/* 하단: 구글 지도 레이아웃 영역 */}
        <div className="ptnssearch-map-wrapper">
          <div className="ptnssearch-map-placeholder">
            <div className="ptnssearch-map-content">
              <span className="ptnssearch-map-icon">📍</span>
              <p>지점 위치 정보를 불러오는 중입니다...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}