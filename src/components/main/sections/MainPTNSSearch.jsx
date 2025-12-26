/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 * 251220 v1.1.0 sara add kakao map modal
 * 251226 useKakaoLoader 기반 지점 검색 (Geocoding 및 현위치 통합)
 */

import { useState, useContext, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import DaumPostcodeEmbed from 'react-daum-postcode';
import PTNSData from '../../../data/PTNSData.json';
import { monochromeTheme, searchAddressToCoords } from '../../../hooks/useDaumPostcodePopup';
import './MainPTNSSearch.css';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaLocationDot, FaXmark, FaChevronRight } from "react-icons/fa6";

const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 }; // 대구 제일빌딩

export default function MainPTNSSearch() {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchedAddr, setSearchedAddr] = useState("");

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services", "clusterer"],
  });

  // 제휴업체 데이터 마커화
  useEffect(() => {
    if (isModalOpen && !loading && window.kakao?.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const geocodePromises = PTNSData.map(store => 
        new Promise((resolve) => {
          geocoder.addressSearch(store.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve({ ...store, lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
            } else resolve(null);
          });
        })
      );
      Promise.all(geocodePromises).then(res => setStores(res.filter(s => s !== null)));
    }
  }, [isModalOpen, loading]);

  const handleComplete = (data) => {
    setSearchedAddr(data.roadAddress);
    setIsPostcodeVisible(false);
    setSelectedStore(null);
    searchAddressToCoords(data.roadAddress, (coords) => setLocation(coords));
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
          <button className="ptnssearch-primary-button" onClick={() => setIsModalOpen(true)}>
            {t('ptnsSearchFindNearMe')}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="ptnssearch-modal-overlay">
          <div className="ptnssearch-modal-content">
            <div className="ptnssearch-modal-header">
              <div className="ptnssearch-input-box" onClick={() => setIsPostcodeVisible(!isPostcodeVisible)}>
                <FaLocationDot className="input-inner-icon" />
                <input 
                  type="text" 
                  className="ptnssearch-input-field read-only" 
                  value={searchedAddr}
                  readOnly
                  placeholder="지점명 또는 우편번호(도로명)로 검색" 
                />
              </div>
              <button onClick={() => setIsModalOpen(false)} className="ptnssearch-modal-close-button"><FaXmark /></button>
            </div>
            
            <div className="ptnssearch-map-container">
              {isPostcodeVisible && (
                <div className="ptnssearch-postcode-embed-wrapper">
                  <DaumPostcodeEmbed onComplete={handleComplete} theme={monochromeTheme} style={{ height: '100%' }} />
                </div>
              )}

              {!loading && window.kakao?.maps ? (
                <Map center={location} style={{ width: '100%', height: '100%' }} level={3}>
                  <MapMarker position={location} />
                  {stores.map((store) => (
                    <MapMarker 
                      key={store.name} 
                      position={{ lat: store.lat, lng: store.lng }}
                      onClick={() => {
                        setSelectedStore(store);
                        setLocation({ lat: store.lat, lng: store.lng });
                      }}
                    />
                  ))}

                  {selectedStore && (
                    <div className="ptnssearch-detail-card animate-slide-up">
                      <div className="detail-header">
                        <span className="detail-tag">제휴 지점</span>
                        <button className="detail-close" onClick={() => setSelectedStore(null)}><FaXmark /></button>
                      </div>
                      <h3 className="detail-title">{selectedStore.name}</h3>
                      <p className="detail-address">{selectedStore.address}</p>
                      <a 
                        href={`https://map.kakao.com/link/map/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`} 
                        target="_blank" rel="noreferrer" className="detail-link-btn"
                      >
                        카카오맵 바로가기 <FaChevronRight />
                      </a>
                    </div>
                  )}
                </Map>
              ) : (
                <div className="map-loading-state">지도를 불러오는 중입니다...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}