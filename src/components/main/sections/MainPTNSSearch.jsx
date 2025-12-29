/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init 
 * 251220 v1.1.0 sara add kakao map modal
 * 251226 v1.2.0 useKakaoLoader 기반 지점 검색 (Geocoding 및 현위치 통합)
 * 251229 v1.3.0 429 에러 해결을 위한 서버 데이터 연동 및 지오코딩 로직 제거
 */

import { useState, useContext, useEffect, useMemo } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import DaumPostcodeEmbed from 'react-daum-postcode';
import axiosInstance from '../../../api/axiosInstance.js';
import { searchAddressToCoords } from '../../../utils/address.js';
import './MainPTNSSearch.css';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaLocationDot, FaXmark, FaChevronRight, FaMagnifyingGlass, FaStore } from "react-icons/fa6";
import CrosshairIcon from '../../common/icons/CrosshairIcon';

const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 };

const blackMarkerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 256c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64-28.654 64-64 64z" fill="#111827"/></svg>`;
const blackMarker = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(blackMarkerSvg)}`;

export default function MainPTNSSearch() {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchedAddr, setSearchedAddr] = useState("");
  const [listSearchTerm, setListSearchTerm] = useState("");

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services", "clusterer"],
  });

  const markerImageInfo = {
    selected: { src: blackMarker, size: { width: 28, height: 40 } },
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosInstance.get('/api/partners');
        const serverData = response.data.data || [];
        const mappedStores = serverData.map(store => ({
          ...store,
          lat: parseFloat(store.y),
          lng: parseFloat(store.x),
          markerImage: { src: blackMarker, size: { width: 28, height: 40 } }
        }));
        setStores(mappedStores);
      } catch (err) {
        console.error("매장 목록 로드 실패:", err);
      }
    };
    if (isModalOpen) fetchStores();
  }, [isModalOpen]);

  const filteredStores = useMemo(() => {
    return stores.filter(s => 
      s.storeName.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(listSearchTerm.toLowerCase())
    );
  }, [stores, listSearchTerm]);

  const handleComplete = (data) => {
    setSearchedAddr(data.roadAddress);
    setIsPostcodeVisible(false);
    setSelectedStore(null);
    searchAddressToCoords(data.roadAddress, (coords) => setLocation(coords));
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    setLocation({ lat: store.lat, lng: store.lng });
  };

  const findMyCurrentLocation = (openModalAfter = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(newLoc);
          if (openModalAfter) setIsModalOpen(true);
        },
        () => {
          alert(t('ptnsSearchLocationError'));
          if (openModalAfter) { setLocation(DEFAULT_LOCATION); setIsModalOpen(true); }
        }
      );
    }
  };

  return (
    <>
      <div className="ptnssearch-section-wrapper">
        <div className="ptnssearch-header-group">
          <h2 className="ptnssearch-title-text">{t('ptnsSearchTitle')}</h2>
          <p className="ptnssearch-desc-text">{t('ptnsSearchDesc')}</p>
        </div>
        <div className="ptnssearch-card-box">
          <div className="ptnssearch-search-placeholder-content">
            <p className="ptnssearch-search-placeholder-text">{t('ptnsSearchPlaceholder')}</p>
            <button className="ptnssearch-search-find-btn" onClick={() => findMyCurrentLocation(true)}>
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
              <div className="ptnssearch-input-box" onClick={() => setIsPostcodeVisible(!isPostcodeVisible)}>
                <FaLocationDot className="ptnssearch-input-inner-icon" />
                <span className={`ptnssearch-input-text ${!searchedAddr ? 'ptnssearch-is-placeholder' : ''}`}>
                  {searchedAddr || t('ptnsSearchInputPlaceholder')}
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="ptnssearch-modal-close-button"><FaXmark /></button>
            </div>
            
            <div className="ptnssearch-main-layout">
              <div className="ptnssearch-sidebar">
                <div className="ptnssearch-sidebar-search-area">
                  <FaMagnifyingGlass className="ptnssearch-sidebar-search-icon" />
                  <input 
                    type="text" 
                    className="ptnssearch-sidebar-search-input"
                    placeholder="매장명 또는 주소 검색"
                    value={listSearchTerm}
                    onChange={(e) => setListSearchTerm(e.target.value)}
                  />
                </div>
                <div className="ptnssearch-sidebar-store-list">
                  {filteredStores.length > 0 ? (
                    filteredStores.map((store) => (
                      <div 
                        key={store.id} 
                        className={`ptnssearch-sidebar-store-item ${selectedStore?.id === store.id ? 'ptnssearch-is-active' : ''}`}
                        onClick={() => handleSelectStore(store)}
                      >
                        <div className="ptnssearch-store-item-name"><FaStore /> {store.storeName}</div>
                        <div className="ptnssearch-store-item-address">{store.address}</div>
                      </div>
                    ))
                  ) : (
                    <div className="ptnssearch-sidebar-no-result">검색 결과가 없습니다.</div>
                  )}
                </div>
              </div>

              <div className="ptnssearch-map-container">
                {isPostcodeVisible && (
                  <div className="ptnssearch-postcode-embed-wrapper">
                    <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: '100%' }} />
                  </div>
                )}
                {!loading && window.kakao?.maps ? (
                  <Map center={location} style={{ width: '100%', height: '100%' }} level={3}>
                    <MapMarker position={location} image={markerImageInfo.selected} />
                    {stores.map((store) => (
                      <MapMarker 
                        key={`${store.storeName}-${store.lat}`} 
                        position={{ lat: store.lat, lng: store.lng }}
                        image={selectedStore?.id === store.id ? markerImageInfo.selected : store.markerImage}
                        onClick={() => handleSelectStore(store)}
                      />
                    ))}
                    <button className="ptnssearch-current-location-btn" onClick={() => findMyCurrentLocation(false)}>
                      <CrosshairIcon />
                    </button>
                    {selectedStore && (
                      <div className="ptnssearch-detail-card ptnssearch-animate-slide-up">
                        <div className="ptnssearch-detail-header">
                          <span className="ptnssearch-detail-tag">제휴 지점</span>
                          <button className="ptnssearch-detail-close" onClick={() => setSelectedStore(null)}><FaXmark /></button>
                        </div>
                        <h3 className="ptnssearch-detail-title">{selectedStore.storeName}</h3>
                        <p className="ptnssearch-detail-address">{selectedStore.address}</p>
                        <a 
                          href={`https://map.kakao.com/link/map/${selectedStore.storeName},${selectedStore.lat},${selectedStore.lng}`} 
                          target="_blank" rel="noreferrer" className="ptnssearch-detail-link-btn"
                        >
                          카카오맵 바로가기 <FaChevronRight />
                        </a>
                      </div>
                    )}
                  </Map>
                ) : (
                  <div className="ptnssearch-map-loading-state">지도를 불러오는 중입니다...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}