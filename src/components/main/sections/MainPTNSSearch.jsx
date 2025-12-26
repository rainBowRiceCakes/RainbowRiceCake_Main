/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 * 251220 v1.1.0 sara add kakao map modal
 * 251226 useKakaoLoader 기반 지점 검색 (Geocoding 및 현위치 통합)
 */

import { useState, useContext, useMemo, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import PTNSData from '../../../data/PTNSData.json';
import './MainPTNSSearch.css';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaLocationDot } from "react-icons/fa6";

const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 }; // 대구 제일빌딩

export default function MainPTNSSearch() {
  /* 1. 상태 관리: 위치, 모달, 검색어, 가게 목록 */
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]); // Geocoding된 가게 목록
  
  // Kakao Maps SDK 로더. 'services' 라이브러리(Geocoder)를 로드합니다.
  const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  
  if (!kakaoAppKey) {
    console.error("Kakao Map API Key is not defined in environment variables.");
    // Optionally, you could display an error message to the user or a fallback UI
  }

  // 1. Kakao SDK 로드: 항상 호출 (React Hook 규칙 준수)
  const [loading, error] = useKakaoLoader({
    appkey: kakaoAppKey, // [중요] 여기에 설정하는 키는 반드시 카카오 JavaScript API 키여야 합니다. REST API 키가 아닙니다.
    libraries: ["services", "clusterer"],
  });

  // 2. Geocoding 로직: window.kakao가 로드된 후에만 Geocoder 호출
  useEffect(() => {
    if (isModalOpen && !loading && window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      const geocodePromises = PTNSData.map(store => 
        new Promise((resolve) => {
          geocoder.addressSearch(store.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve({
                ...store,
                lat: parseFloat(result[0].y),
                lng: parseFloat(result[0].x),
              });
            } else {
              resolve(null);
            }
          });
        })
      );

      Promise.all(geocodePromises).then(geocodedStores => {
        setStores(geocodedStores.filter(store => store !== null));
      });
    }
  }, [isModalOpen, loading]);

  const filteredStores = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return stores.filter(s => s.name.toLowerCase().includes(term) || s.address.toLowerCase().includes(term));
  }, [searchTerm, stores]);

  // 3. 현위치 파악 및 대구 제일빌딩 Fallback 로직
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsModalOpen(true);
        },
        () => {
          alert(t('ptnsSearchLocationError'));
          setLocation(DEFAULT_LOCATION); // 에러 시 대구 제일빌딩
          setIsModalOpen(true);
        }
      );
    } else { // Geolocation not supported by browser
      alert(t('ptnsSearchGeolocationError'));
      setLocation(DEFAULT_LOCATION); // Use fallback location
      setIsModalOpen(true); // Open modal with fallback location
    }
  };

  return (
    <div className="ptnssearch-frame mainshow-section-wrapper">
      <div className="ptnssearch-header-group">
        <h2 className="ptnssearch-title-text">{t('ptnsSearchTitle')}</h2>
        <p className="ptnssearch-desc-text">{t('ptnsSearchDesc')}</p>
      </div>

      <div className="ptnssearch-card-box">
        <div className="ptnssearch-placeholder-content">
          <span className="ptnssearch-map-icon"><FaLocationDot /></span>
          <p className="ptnssearch-placeholder-text">{t('ptnsSearchPlaceholder')}</p>
          <button className="ptnssearch-primary-button" onClick={getCurrentLocation}>
            {t('ptnsSearchFindNearMe')}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="ptnssearch-modal-overlay">
          <div className="ptnssearch-modal-content">
            <div className="ptnssearch-modal-header">
              <input 
                type="text" 
                className="ptnssearch-input-field" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('ptnsSearchInputPlaceholder')} 
              />
              <button onClick={() => setIsModalOpen(false)} className="ptnssearch-modal-close-button">&times;</button>
            </div>
            
            <div className="ptnssearch-map-container">
              {error ? (
                <div className="map-loading-state">{t('ptnsMapError')}</div> 
                // Assuming a translation key for map error
              ) : !loading && window.kakao && window.kakao.maps ? (
                <Map center={location} style={{ width: '100%', height: '100%' }} level={3}>
                  <MapMarker position={location} />
                  {filteredStores.map((store) => (
                    <MapMarker key={store.name} position={{ lat: store.lat, lng: store.lng }}>
                      <div className="ptnssearch-infowindow">{store.name}</div>
                    </MapMarker>
                  ))}
                </Map>
              ) : (
                <div className="map-loading-state">{t('ptnsMapLoading')}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}