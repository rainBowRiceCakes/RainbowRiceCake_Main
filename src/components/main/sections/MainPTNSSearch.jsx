/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 * 251220 v1.1.0 sara add kakao map modal
 */

import { useState, useContext, useMemo } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import PTNSData from '../../../data/PTNSData.json';
import './MainPTNSSearch.css';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaLocationDot } from "react-icons/fa6";

export default function MainPTNSSearch() {
  /* 1. 상태 관리: 위치, 모달 여부, 검색어만 상태로 관리 */
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /* 2. 에러 해결 (파생 상태): useEffect 없이 검색어에 따라 즉시 필터링 */
  // useMemo를 사용하여 searchTerm이 바뀔 때만 계산하도록 최적화했습니다.
  const filteredStores = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return PTNSData.filter(store =>
      store.name.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);

  /* 3. 로직: 현재 사용자 위치 정보 가져오기 */
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsModalOpen(true);
        },
        () => {
          alert(t('ptnsSearchLocationError'));
          setLocation({ lat: 35.8714, lng: 128.6014 }); // 기본 위치 대구
          setIsModalOpen(true);
        }
      );
    }
  };

  return (
    /* 4. 레이아웃: ptnssearch- 접두사를 가진 전체 프레임 */
    <div className="ptnssearch-frame mainshow-section-wrapper">
      {/* 5. 헤더: 제목 및 설명 영역 */}
      <div className="ptnssearch-header-group">
        <h2 className="ptnssearch-title-text">{t('ptnsSearchTitle')}</h2>
        <p className="ptnssearch-desc-text">{t('ptnsSearchDesc')}</p>
      </div>

      {/* 6. 카드: 검색 시작을 유도하는 플레이스홀더 영역 */}
      <div className="ptnssearch-card-box">
        <div className="ptnssearch-placeholder-content">
          <span className="ptnssearch-map-icon" aria-hidden="true">
            <FaLocationDot />
          </span>
          <p className="ptnssearch-placeholder-text">{t('ptnsSearchPlaceholder')}</p>
          <button 
            className="ptnssearch-primary-button"
            onClick={getCurrentLocation}
          >
            {t('ptnsSearchFindNearMe')}
          </button>
        </div>
      </div>

      {/* 7. 모달: 지도 및 실시간 검색 인터페이스 */}
      {isModalOpen && (
        <div className="ptnssearch-modal-overlay">
          <div className="ptnssearch-modal-content">
            <div className="ptnssearch-modal-header">
              <input 
                type="text" 
                className="ptnssearch-input-field" 
                placeholder={t('ptnsSearchInputPlaceholder')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="ptnssearch-modal-close-button"
              >
                &times;
              </button>
            </div>
            
            {/* 8. 지도 컨테이너: 카카오 맵 연동 및 무채색 필터 적용 영역 */}
            <div className="ptnssearch-map-container">
              {location && (
                <Map
                  center={location}
                  className="ptnssearch-kakao-map"
                  style={{ width: '100%', height: '100%' }}
                  level={4}
                >
                  {/* 현재 위치 마커 */}
                  <MapMarker position={location} />

                  {/* 필터링된 결과 마커 표시 */}
                  {filteredStores.map((store, index) => (
                    <MapMarker 
                      key={`${store.name}-${index}`} 
                      position={{ lat: store.lat, lng: store.lng }}
                    >
                      <div className="ptnssearch-infowindow">
                        {store.name}
                      </div>
                    </MapMarker>
                  ))}
                </Map>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}