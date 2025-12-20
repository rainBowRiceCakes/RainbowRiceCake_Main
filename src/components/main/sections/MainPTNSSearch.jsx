/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 * 251220 v1.1.0 Gemini add map modal feature
 */
import { useState, useEffect, useContext } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import PTNSData from '../../../data/PTNSData.json';
import './MainPTNSSearch.css';
import { LanguageContext } from '../../../context/LanguageContext';

export default function MainPTNSSearch() {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStores, setFilteredStores] = useState(PTNSData);

  // 현재 위치를 가져오는 함수
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsModalOpen(true); // 위치 정보 성공적으로 가져오면 모달 열기
        },
        (err) => {
          console.error("Error getting current location: ", err);
          alert(t('ptnsSearchLocationError'));
          // 기본 위치(대구)로 설정
          setLocation({ lat: 35.8714, lng: 128.6014 });
          setIsModalOpen(true);
        }
      );
    } else {
      alert(t('ptnsSearchGeolocationError'));
      setLocation({ lat: 35.8714, lng: 128.6014 });
      setIsModalOpen(true);
    }
  };

  // 검색어에 따라 매장 필터링
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredStores(PTNSData);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = PTNSData.filter(store =>
        store.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="ptnssearch-frame mainshow-section-wrapper">
      <div className="maininfo-header-group">
        <div>
          <h2 className="maininfo-title-text">{t('ptnsSearchTitle')}</h2>
          <p className="maininfo-desc-text">
            {t('ptnsSearchDesc')}
          </p>
        </div>
      </div>

      <div className="ptnssearch-card-box">
        <div className="ptnssearch-placeholder-content">
          <span className="ptnssearch-map-icon">📍</span>
          <p>{t('ptnsSearchPlaceholder')}</p>
          <button 
            className="maininfo-button maininfo-button--primary"
            onClick={getCurrentLocation}
          >
            {t('ptnsSearchFindNearMe')}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="map-modal-overlay">
          <div className="map-modal-content">
            <div className="map-modal-header">
              <input 
                type="text" 
                className="ptnssearch-input-field" 
                placeholder={t('ptnsSearchInputPlaceholder')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="map-modal-close-button"
              >
                &times;
              </button>
            </div>
            {location ? (
              <Map
                center={location}
                style={{ width: '100%', height: '100%' }}
                level={4}
              >
                {/* 현재 위치 마커 */}
                <MapMarker 
                  position={location} 
                  image={{
                    src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                    size: { width: 40, height: 40 },
                    options: { offset: { x: 20, y: 40 } },
                  }}
                >
                   <div style={{padding: '5px', color: '#000'}}>{t('ptnsSearchCurrentLocation')}</div>
                </MapMarker>

                {/* 제휴 매장 마커 */}
                {filteredStores.map((store, index) => (
                  <MapMarker key={index} position={{ lat: store.lat, lng: store.lng }}>
                    <div style={{padding: '5px', color: '#000'}}>{store.name}</div>
                  </MapMarker>
                ))}
              </Map>
            ) : (
              <div className="ptnssearch-map-placeholder">
                <p>{t('ptnsSearchLoadingLocation')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
