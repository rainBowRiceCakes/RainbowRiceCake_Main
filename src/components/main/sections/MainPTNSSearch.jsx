/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * @date 2026-01-05
 * @description v2.1.0 Refactored by Senior Full-stack Developer
 * - 백엔드 API 연동 복구 및 useMemo 최적화 적용
 */

import { useState, useContext, useCallback, useMemo } from "react";
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import axiosInstance from "../../../api/axiosInstance.js";
import "./MainPTNSSearch.css";
import { LanguageContext } from "../../../context/LanguageContext";
import { FaLocationDot, FaXmark, FaMagnifyingGlass, FaStore, FaChevronUp, FaChevronDown, FaPhone, FaMap } from "react-icons/fa6";
import GpsIcon from "../../common/icons/GpsIcon";
import ToastNotification from "../../common/ToastNotification.jsx";

// 상수 정의
const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 }; // 기본 위치 (대구 그린컴퓨터)
const SEARCH_RADIUS = 5000; // 검색 반경 (5km)
const MOBILE_BREAKPOINT = 768; // 모바일 분기점

// 상세 정보 팝업 컴포넌트
const StoreDetailPopup = ({ store, onClose, onNavigate }) => {
  const { t } = useContext(LanguageContext);
  if (!store) return null;

  return (
    <div className="ptnssearch-detail-popup">
      <button onClick={onClose} className="ptnssearch-detail-close-button"><FaXmark /></button>
      <div className="ptnssearch-detail-header">
        <img src={store.logoImg || '/resource/main-logo.png'} alt={store.storeName} className="ptnssearch-detail-logo" />
        <h4 className="ptnssearch-detail-title">{store.storeName}</h4>
      </div>
      <div className="ptnssearch-detail-body">
        <p className="ptnssearch-detail-info">{store.address}</p>
        <p className="ptnssearch-detail-info"><FaPhone /> {store.phone || t('noPhoneInfo')}</p>
      </div>
      <div className="ptnssearch-detail-footer">
        <button onClick={onNavigate} className="ptnssearch-detail-nav-btn">
          <FaMap /> {t('kakaoMapNavigate')}
        </button>
      </div>
    </div>
  );
};


export default function MainPTNSSearch() {
  const { t } = useContext(LanguageContext);
  
  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [center, setCenter] = useState(DEFAULT_LOCATION);
  const [myLocation, setMyLocation] = useState(null);
  const [stores, setStores] = useState([]); // API에서 가져온 원본 데이터
  const [selectedStore, setSelectedStore] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [map, setMap] = useState(null);

  // 카카오맵 SDK 로더
  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  // 백엔드 데이터 -> 컴포넌트 내부 스키마로 정규화
  const normalizeStoreData = (backendData) => {
    return {
      id: backendData.id,
      storeName: backendData.kr_name,
      address: backendData.address,
      lat: Number.parseFloat(backendData.lat),
      lng: Number.parseFloat(backendData.lng),
      logoImg: backendData.logo_img,
      phone: backendData.phone,
      manager: backendData.manager,
    };
  };

  // 주변 제휴업체 데이터 로드 (Live API)
  const fetchNearbyStores = useCallback(async (lat, lng) => {
    try {
      const response = await axiosInstance.get("/api/partners/location", {
        params: { lat, lng, radius: SEARCH_RADIUS },
      });
      const storesData = Array.isArray(response.data.data) ? response.data.data : response.data;
      if (!Array.isArray(storesData)) {
        console.error("API response is not an array:", storesData);
        throw new Error("API response is not an array");
      }
      const normalized = storesData.map(normalizeStoreData);
      setStores(normalized);
    } catch (error) {
      console.error("제휴업체 데이터 로드 실패:", error);
      setShowToast({ message: t('ptnsDataLoadError'), type: 'error' }); // 유저에게 에러 알림
      setStores([]); // 실패 시 빈 배열로 초기화
    }
  }, [t]);

  // 모달 열기 및 데이터 로드
  const openModalWithData = () => {
    setIsModalOpen(true);
    if (myLocation) {
      fetchNearbyStores(myLocation.lat, myLocation.lng);
      setCenter(myLocation);
    } else {
      fetchNearbyStores(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
      setCenter(DEFAULT_LOCATION);
    }
  };

  // 클라이언트 사이드 검색 처리 (useMemo 최적화)
  const filteredStores = useMemo(() => {
    if (!keyword.trim()) {
      return stores;
    }
    const lowercasedKeyword = keyword.toLowerCase();
    return stores.filter(store =>
      store.storeName.toLowerCase().includes(lowercasedKeyword)
    );
  }, [keyword, stores]);

  // 업체 선택 핸들러
  const handleSelectStore = (store) => {
    setSelectedStore(store);
    const newCenter = { lat: store.lat, lng: store.lng };
    
    if (map) {
      map.panTo(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng));

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        const sheetHeight = window.innerHeight * 0.4;
        map.panBy(0, sheetHeight / 2);
      }
    }
    setCenter(newCenter);
  };
  
  // 내 위치 찾기
  const findMyCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMyLocation(newLoc);
          setCenter(newLoc);
          if(map) map.setCenter(new window.kakao.maps.LatLng(newLoc.lat, newLoc.lng));
          if (!isModalOpen) setIsModalOpen(true);
          fetchNearbyStores(newLoc.lat, newLoc.lng);
        },
        () => {
          setShowToast({ message: t('locationFailedToRetrieve'), type: 'error' });
          openModalWithData();
        }
      );
    } else {
      setShowToast({ message: t('locationNotSupported'), type: 'error' });
      openModalWithData();
    }
  };

  return (
    <>
      <div className="ptnssearch-frame mainshow-section-wrapper">
        <div className="ptnssearch-header-group">
          <h2 className="ptnssearch-title-text">{t("ptnsSearchTitle")}</h2>
          <p className="ptnssearch-desc-text">{t("ptnsSearchDesc")}</p>
        </div>
        <div className="ptnssearch-card-box">
          <div className="ptnssearch-search-placeholder-content">
            <button className="ptnssearch-search-find-btn" onClick={findMyCurrentLocation}>
              <FaLocationDot />
              <span>{t("ptnsSearchFindNearMe")}</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="ptnssearch-modal-overlay">
          <div className="ptnssearch-modal-content">
            <div className="ptnssearch-modal-header">
              <h3 className="ptnssearch-modal-header-title">{t("ptnsSearchTitle")}</h3>
              <button onClick={() => setIsModalOpen(false)} className="ptnssearch-modal-close-button"><FaXmark /></button>
            </div>
            <div className="ptnssearch-main-layout">
              <div className={`ptnssearch-sidebar ${isSheetOpen ? "ptnssearch-sheet-open" : ""}`}>
                <button className="ptnssearch-mobile-sheet-handle" onClick={() => setIsSheetOpen(!isSheetOpen)}>
                  {isSheetOpen ? <FaChevronDown /> : <FaChevronUp />}
                </button>
                <div className="ptnssearch-sidebar-search-area">
                  <div className="ptnssearch-sidebar-input-wrapper">
                    <FaMagnifyingGlass className="ptnssearch-sidebar-search-icon" />
                    <input 
                      className="ptnssearch-sidebar-search-input" 
                      placeholder={t("ptnsSearchInputPlaceholder")} 
                      value={keyword} 
                      onChange={(e) => setKeyword(e.target.value)} 
                    />
                    {!!keyword && <FaXmark className="ptnssearch-input-clear" onClick={() => setKeyword("")} />}
                  </div>
                </div>
                <div className="ptnssearch-sidebar-store-list">
                  {filteredStores.length > 0 ? (
                    filteredStores.map((store) => (
                      <div 
                        key={store.id} 
                        className={`ptnssearch-sidebar-store-item ${selectedStore?.id === store.id ? "ptnssearch-is-active" : ""}`} 
                        onClick={() => handleSelectStore(store)}>
                        <div className="ptnssearch-store-item-name"><FaStore />{store.storeName}</div>
                        <div className="ptnssearch-store-item-address">{store.address}</div>
                      </div>
                    ))
                  ) : (
                    <div className="ptnssearch-sidebar-no-result">{t("noResultsFound")}</div>
                  )}
                </div>
              </div>

              <div className="ptnssearch-map-container">
                {loading ? (
                  <div className="ptnssearch-map-loading">{t('mapLoading')}</div>
                ) : (
                  <Map center={center} style={{ width: "100%", height: "100%" }} level={5} onCreate={setMap}>
                    {myLocation && (
                      <MapMarker
                        position={myLocation}
                        image={{
                          src: '/resource/main-loginIcon.png',
                          size: { width: 32, height: 32 },
                          options: { offset: { x: 16, y: 32 } },
                        }}
                        zIndex={10}
                      />
                    )}
                    {filteredStores.map((store) => (
                       <MapMarker
                        key={store.id}
                        position={{ lat: store.lat, lng: store.lng }}
                        onClick={() => handleSelectStore(store)}
                        image={{
                          src: selectedStore?.id === store.id ? '/resource/main-logo.png' : '/resource/main-loginIcon.png',
                          size: selectedStore?.id === store.id ? { width: 48, height: 48 } : { width: 28, height: 28 },
                        }}
                        zIndex={selectedStore?.id === store.id ? 100 : 1}
                      />
                    ))}
                    <button 
                      className={`ptnssearch-current-location-btn ${isSheetOpen ? "sheet-open" : ""}`} 
                      onClick={findMyCurrentLocation}
                    >
                      <GpsIcon />
                    </button>
                    {selectedStore && (
                      <StoreDetailPopup 
                        store={selectedStore}
                        onClose={() => setSelectedStore(null)}
                        onNavigate={() => window.open(`https://map.kakao.com/link/to/${selectedStore.storeName},${selectedStore.lat},${selectedStore.lng}`, '_blank')}
                      />
                    )}
                  </Map>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showToast && <ToastNotification message={showToast.message} onClose={() => setShowToast(false)} />}
    </>
  );
}
