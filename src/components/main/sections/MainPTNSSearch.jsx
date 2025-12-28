/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 * 251220 v1.1.0 sara add kakao map modal
 * 251226 v1.2.0 useKakaoLoader 기반 지점 검색 (Geocoding 및 현위치 통합)
 */

import { useState, useContext, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import DaumPostcodeEmbed from 'react-daum-postcode';
import PTNSData from '../../../data/PTNSData.json';
import { searchAddressToCoords } from '../../../utils/address.js';
import './MainPTNSSearch.css';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaLocationDot, FaXmark, FaChevronRight } from "react-icons/fa6";
import CrosshairIcon from '../../common/icons/CrosshairIcon';

const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 }; // 대구 제일빌딩

// Black marker SVG as a data URI
const blackMarkerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 256c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64-28.654 64-64 64z" fill="#111827"/></svg>`;
const blackMarker = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(blackMarkerSvg)}`;

const MARKER_SOURCES = [blackMarker];

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

  const POSTCODE_THEME = {
  bgColor: "var(--com-color-white)",
  searchBgColor: "var(--com-color-black)",
  contentBgColor: "var(--com-color-white)",
  pageBgColor: "var(--com-color-white)",
  textColor: "var(--com-color-black)",
  queryTextColor: "var(--com-color-white)",
  postcodeTextColor: "var(--com-font-muted)",
  emphTextColor: "var(--com-color-black)",
  outlineColor: "var(--com-border-default)",
  };
  
  const markerImageInfo = {
    selected: {
      src: blackMarker, // Use black for high visibility for the selected marker
      size: { width: 28, height: 40 }, // Adjusted for a more pin-like aspect ratio
    },
  };

  useEffect(() => {
    if (isModalOpen && !loading && window.kakao?.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const geocodePromises = PTNSData.map(store => 
        new Promise((resolve) => {
          geocoder.addressSearch(store.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve({ 
                ...store, 
                lat: parseFloat(result[0].y), 
                lng: parseFloat(result[0].x),
                markerImage: {
                  src: blackMarker,
                  size: { width: 28, height: 40 },
                }
              });
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
  
  const findMyCurrentLocation = (openModalAfter = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          if (openModalAfter) {
            setIsModalOpen(true);
          }
        },
        (err) => {
          alert(t('ptnsSearchLocationError'));
          if (openModalAfter) {
            setLocation(DEFAULT_LOCATION);
            setIsModalOpen(true);
          }
        }
      );
    } else {
      alert(t('ptnsSearchGeolocationError'));
      if (openModalAfter) {
        setLocation(DEFAULT_LOCATION);
        setIsModalOpen(true);
      }
    }
  };

  return (
    <>
      <div className="mainshow-section-wrapper main-section-padding">
        <div className="mainptnssearch-header-group">
          <h2 className="mainptnssearch-title-text">{t('ptnsSearchTitle')}</h2>
          <p className="mainptnssearch-desc-text">{t('ptnsSearchDesc')}</p>
        </div>

        <div className="mainptnssearch-card-box">
          <div className="mainptnssearch-search-placeholder-content">
            <p className="mainptnssearch-search-placeholder-text">{t('ptnsSearchPlaceholder')}</p>
            <button className="mainptnssearch-search-find-btn" onClick={() => findMyCurrentLocation(true)}>
              <FaLocationDot />
              <span>{t('ptnsSearchFindNearMe')}</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="ptnssearch-modal-overlay">
          <div className="ptnssearch-modal-content">
            <div className="ptnssearch-modal-header">
              <div 
                className="ptnssearch-input-box" 
                onClick={() => setIsPostcodeVisible(!isPostcodeVisible)}
              >
                <FaLocationDot className="input-inner-icon" />
                <span className={`ptnssearch-input-text ${!searchedAddr ? 'is-placeholder' : ''}`}>
                  {searchedAddr || t('ptnsSearchInputPlaceholder')}
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="ptnssearch-modal-close-button"><FaXmark /></button>
            </div>
            
            <div className="ptnssearch-map-container">
              {isPostcodeVisible && (
                <div className="ptnssearch-postcode-embed-wrapper">
                  <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: '100%' }} />
                </div>
              )}

              {!loading && window.kakao?.maps ? (
                <Map center={location} style={{ width: '100%', height: '100%' }} level={2}>
                  <MapMarker 
                    position={location}
                    image={markerImageInfo.selected} 
                  />
                  {stores.map((store) => (
                    <MapMarker 
                      key={store.name} 
                      position={{ lat: store.lat, lng: store.lng }}
                      image={selectedStore?.name === store.name ? markerImageInfo.selected : store.markerImage}
                      onClick={() => {
                        setSelectedStore(store);
                        setLocation({ lat: store.lat, lng: store.lng });
                      }}
                    />
                  ))}
                  
                  <button className="current-location-btn" onClick={() => findMyCurrentLocation(false)}>
                    <CrosshairIcon />
                  </button>

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
    </>
  )
};