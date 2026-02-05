/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (v2.0.0 리팩토링)
 * 251221 v1.0.0 sara init 
 * Monochrome 테마 및 --com- 변수 사용
 * - 모바일 바텀시트 및 지도 상호작용 최적화
 * - 상세 정보 팝업 스타일 추가
 */

import { useState, useContext, useCallback, useMemo, useRef, useEffect } from "react";
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import axiosInstance from "../../../api/axiosInstance.js";
import "./MainPTNSSearch.css";
import { LanguageContext } from "../../../context/LanguageContext";
import { FaLocationDot, FaXmark, FaMagnifyingGlass, FaStore, FaChevronUp, FaChevronDown, FaMap } from "react-icons/fa6";
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

  const handleModalClick = (e) => {
    // Prevent event from bubbling up to map, but still trigger navigation
    e.stopPropagation(); 
    onNavigate();
  }

  const handleCloseClick = (e) => {
    e.stopPropagation(); // Prevent modal-wide click from triggering navigation
    onClose();
  }

  return (
    <div className="ptnssearch-detail-popup" onClick={handleModalClick}>
      <button onClick={handleCloseClick} className="ptnssearch-detail-close-button"><FaXmark /></button>
      <div className="ptnssearch-detail-header">
        <img src={store.logoImg || '/resource/main-logo.png'} alt={store[t('mainLocationPartnerName')]} className="ptnssearch-detail-logo" />
        <h4 className="ptnssearch-detail-title">{store[t('mainLocationPartnerName')]}</h4>
      </div>
      <div className="ptnssearch-detail-body">
        <p className="ptnssearch-detail-info"><FaMap /> {store.address}</p>
      </div>
      <div className="ptnssearch-detail-footer">
        <button onClick={handleModalClick} className="ptnssearch-detail-nav-btn">
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
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isSheetOpen && sidebarRef.current) {
      sidebarRef.current.scrollTop = 0;
    }
  }, [isSheetOpen]);

  // 카카오맵 SDK 로더
  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  // 백엔드 데이터 -> 컴포넌트 내부 스키마로 정규화
  const normalizeStoreData = (backendData) => {
    return {
      id: backendData.id,
      krName: backendData.krName,
      enName: backendData.enName, // enName 추가
      address: backendData.address,
      lat: Number.parseFloat(backendData.lat),
      lng: Number.parseFloat(backendData.lng),
      logoImg: backendData.logoImg,
      phone: backendData.phone,
      manager: backendData.manager,
    };
  };

  // 주변 제휴업체 데이터 로드 (Live API)
  const fetchNearbyStores = useCallback(async (lat, lng) => {
    try {
      const response = await axiosInstance.get("/api/users/location", {
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
      (store.krName && store.krName.toLowerCase().includes(lowercasedKeyword)) ||
      (store.enName && store.enName.toLowerCase().includes(lowercasedKeyword))
    );
  }, [keyword, stores]);

  // 업체 선택 핸들러
  const handleSelectStore = (store) => {
    // [수정] 같은 리스트/마커를 다시 누르면 지도 이동 방지
    if (selectedStore?.id === store.id) return;

    setSelectedStore(store);
    const newCenter = { lat: store.lat, lng: store.lng };
    
    if (map) {
      map.panTo(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng));

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        const sheetHeight = window.innerHeight * 0.4;
        map.panBy(0, sheetHeight / 2);
        setIsSheetOpen(false); // 모바일에서 업체 선택 시 시트 닫기
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
      <div id="mainptnssearch" className="ptnssearch-frame mainshow-section-wrapper">
        <div className="ptnssearch-header-group">
          <h2 className="ptnssearch-title-text">{t("ptnsSearchTitle")}</h2>
          <p className="ptnssearch-desc-text">{t("ptnsSearchDesc")}</p>
        </div>
        <div className="ptnssearch-card-box">
          <div className="ptnssearch-search-placeholder-content">
            <p className="ptnssearch-intro-text">{t("ptnsSearchPlaceholder")}</p>
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
              <div ref={sidebarRef} className={`ptnssearch-sidebar ${isSheetOpen ? "ptnssearch-sheet-open" : ""}`}>
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
                        <div className="ptnssearch-store-item-name"><FaStore />{store.krName} ({store.enName})</div>
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
                  <Map center={center} style={{ width: "100%", height: "100%" }} level={4} onCreate={setMap}>
                    {myLocation && (
                      <>
                        <MapMarker
                          position={myLocation}
                          image={{
                            src: '/resource/my-location-marker.svg',
                            size: { width: 32, height: 32 },
                          }}
                          zIndex={10}
                        />
                        <CustomOverlayMap position={myLocation} yAnchor={2.5}>
                          <div className="location-overlay">{t('mainLocationMyLocation')}</div>
                        </CustomOverlayMap>
                      </>
                    )}
                    {filteredStores.map((store) => (
                       <MapMarker
                        key={store.id}
                        position={{ lat: store.lat, lng: store.lng }}
                        onClick={() => handleSelectStore(store)}
                        image={{
                          src: '/resource/rainbow-marker.svg', // 커스텀 레인보우 마커 사용
                          size: selectedStore?.id === store.id ? { width: 48, height: 48 } : { width: 36, height: 36 },
                        }}
                        zIndex={selectedStore?.id === store.id ? 100 : 1}
                      />
                    ))}
                      {filteredStores.map((store) => {
                            const isSelected = selectedStore?.id === store.id;
                            return (
                              <CustomOverlayMap 
                                key={`overlay-${store.id}`} 
                                position={{ lat: store.lat, lng: store.lng }} 
                                // [수정] 선택된 마커(커진 마커)일 경우 텍스트를 더 위로 올림 (yAnchor 변경)
                                yAnchor={isSelected ? 3.2 : 2.5}
                              >
                                <div className={`location-overlay ${isSelected ? "is-selected" : ""}`}>
                                  {store[t('mainLocationPartnerName')]}
                                </div>
                              </CustomOverlayMap>
                            );
                          })}

                      <button     
                      className={`ptnssearch-current-location-btn ${isSheetOpen ? "sheet-open" : ""} ${selectedStore ? "popup-open" : ""}`}
                      onClick={findMyCurrentLocation}
                    >
                      <GpsIcon />
                    </button>
                    {selectedStore && (
                      <StoreDetailPopup 
                        store={selectedStore}
                        onClose={() => setSelectedStore(null)}
                        onNavigate={() => window.open(`https://map.kakao.com/link/search/${selectedStore.address}`, '_blank')}
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
