/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init
 * 251220 v1.1.0 sara add kakao map modal
 * 251226 v1.2.0 useKakaoLoader 기반 지점 검색 (Geocoding 및 현위치 통합)
 * 251229 v1.3.0 429 에러 해결을 위한 서버 데이터 연동 및 지오코딩 로직 제거 + 커스텀 오버레이 생성
 * 260103 v1.4.0 z-index 정렬(1-100) 및 모바일 레이아웃 최적화
 */

import { useState, useContext, useCallback } from "react";
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import axiosInstance from "../../../api/axiosInstance.js"; //
import { searchAddressToCoords } from "../../../utils/address.js";
import { ptnsData } from "../../../data/ptnsdata.js";
import "./MainPTNSSearch.css";
import { LanguageContext } from "../../../context/LanguageContext";
import { FaLocationDot, FaXmark, FaMagnifyingGlass, FaStore, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import CrosshairIcon from "../../common/icons/CrosshairIcon";
import ToastNotification from "../../common/ToastNotification.jsx";

const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 };
const SEARCH_RADIUS = 5000; //

function getLangText(field, language) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field?.[language] ?? field?.ko ?? field?.en ?? "";
}

export default function MainPTNSSearch() {
  const { t, language } = useContext(LanguageContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [center, setCenter] = useState(DEFAULT_LOCATION);
  const [myLocation, setMyLocation] = useState(DEFAULT_LOCATION);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [map, setMap] = useState(null);

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  const normalizeStore = useCallback(async (s) => {
    if (s?.x && s?.y) {
      return { ...s, lat: Number.parseFloat(s.y), lng: Number.parseFloat(s.x) };
    }
    const addr = getLangText(s?.address, language);
    return new Promise((resolve) => {
      searchAddressToCoords(addr, (coords) => {
        resolve({
          ...s,
          lat: coords?.lat ?? DEFAULT_LOCATION.lat,
          lng: coords?.lng ?? DEFAULT_LOCATION.lng,
        });
      });
    });
  }, [language]);

  // 서버 통신 로직 복구 및 lat, lng 체크
  const fetchNearbyStores = useCallback(async (lat, lng) => {
    try {
      const response = await axiosInstance.get("/api/partners", {
        params: { lat, lng, radius: SEARCH_RADIUS },
      });
      const serverData = response?.data?.data ?? [];
      const combinedData = serverData.length > 0 ? serverData : ptnsData;
      const processed = await Promise.all(combinedData.map(normalizeStore));
      setStores(processed);
    } catch (error) {
      console.error("제휴업체 데이터 로드 실패 (로컬 데이터 전환):", error); 
      const processed = await Promise.all(ptnsData.map(normalizeStore));
      setStores(processed);
    }
  }, [normalizeStore]);

  const openModalWithData = () => {
    setIsModalOpen(true);
    fetchNearbyStores(myLocation.lat, myLocation.lng);
    setCenter(myLocation);
  };

  const handleKeywordSearch = (query) => {
    setKeyword(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }
    if (!loading && window.kakao?.maps?.services) {
      const placesService = new window.kakao.maps.services.Places();
      placesService.keywordSearch(query, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
          setIsDropdownOpen(true);
        }
      });
    }
  };

  const handleSelectPlace = (place) => {
    const coords = { lat: Number.parseFloat(place.y), lng: Number.parseFloat(place.x) };
    setKeyword(place.place_name);
    setCenter(coords);
    setIsDropdownOpen(false);
    setSearchedPlace(place);
    setSelectedStore(null);
    fetchNearbyStores(coords.lat, coords.lng); // 검색 장소 기준으로 재조회
    if (map) map.setCenter(new window.kakao.maps.LatLng(coords.lat, coords.lng));
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    setSearchedPlace(null);
    setCenter({ lat: store.lat, lng: store.lng });
    setIsSheetOpen(false);
    if (map) map.panTo(new window.kakao.maps.LatLng(store.lat, store.lng));
  };

  const findMyCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyLocation(newLoc);
      setCenter(newLoc);
      if (map) map.setCenter(new window.kakao.maps.LatLng(newLoc.lat, newLoc.lng));
      if (!isModalOpen) setIsModalOpen(true);
      fetchNearbyStores(newLoc.lat, newLoc.lng);
    });
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
            <p className="ptnssearch-search-placeholder-text">{t("ptnsSearchDesc")}</p>
            <button className="ptnssearch-search-find-btn" onClick={openModalWithData}>
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
                  <span>{isSheetOpen ? t("ptnsSearchViewMap") : t("ptnsSearchViewList")}</span>
                </button>
                <div className="ptnssearch-sidebar-search-area">
                  <div className="ptnssearch-sidebar-input-wrapper">
                    <FaMagnifyingGlass className="ptnssearch-sidebar-search-icon" />
                    <input className="ptnssearch-sidebar-search-input" placeholder={t("ptnsSearchPlaceholder")} value={keyword} onChange={(e) => handleKeywordSearch(e.target.value)} />
                    {!!keyword && <FaXmark className="ptnssearch-input-clear" onClick={() => setKeyword("")} />}
                  </div>
                  {isDropdownOpen && searchResults.length > 0 && (
                    <ul className="ptnssearch-dropdown-list">
                      {searchResults.map((place) => (
                        <li key={place.id} onClick={() => handleSelectPlace(place)}>
                          <div className="drop-place-name">{place.place_name}</div>
                          <div className="drop-place-addr">{place.road_address_name || place.address_name}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="ptnssearch-sidebar-store-list">
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <div key={store.id} className={`ptnssearch-sidebar-store-item ${selectedStore?.id === store.id ? "ptnssearch-is-active" : ""}`} onClick={() => handleSelectStore(store)}>
                        <div className="ptnssearch-store-item-name"><FaStore />{getLangText(store.storeName, language)}</div>
                        <div className="ptnssearch-store-item-address">{getLangText(store.address, language)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="ptnssearch-sidebar-no-result">{t("No results found")}</div>
                  )}
                </div>
              </div>

              <div className="ptnssearch-map-container">
                {!loading && (
                  <Map center={center} style={{ width: "100%", height: "100%" }} level={5} onCreate={setMap}>
                    <CustomOverlayMap position={myLocation} yAnchor={1.0} zIndex={40}>
                      <div className="current-location-marker" onClick={findMyCurrentLocation} />
                    </CustomOverlayMap>
                    <CustomOverlayMap position={myLocation} yAnchor={2.3} zIndex={40}>
                      <div className="ptnssearch-custom-overlay ptnssearch-my-location-overlay">
                        {myLocation.lat === DEFAULT_LOCATION.lat && myLocation.lng === DEFAULT_LOCATION.lng ? t("mainLocationHeadquarters") : t("mainLocationMyLocation")}
                        <div className="overlay-arrow" />
                      </div>
                    </CustomOverlayMap>
                    {stores.map((store) => (
                      <CustomOverlayMap key={store.id} position={{ lat: store.lat, lng: store.lng }} yAnchor={1.0} zIndex={selectedStore?.id === store.id ? 21 : 10}>
                        <div className={`partner-custom-marker ${selectedStore?.id === store.id ? "partner-custom-marker-selected" : ""}`} onClick={() => handleSelectStore(store)} />
                      </CustomOverlayMap>
                    ))}
                    {!!selectedStore && (
                      <CustomOverlayMap position={{ lat: selectedStore.lat, lng: selectedStore.lng }} yAnchor={3.2} zIndex={22}>
                        <div className="ptnssearch-custom-overlay ptnssearch-store-overlay">
                          {getLangText(selectedStore.storeName, language)}
                          <div className="overlay-arrow" />
                        </div>
                      </CustomOverlayMap>
                    )}
                    {!!searchedPlace && (
                      <>
                        <MapMarker position={{ lat: searchedPlace.y, lng: searchedPlace.x }} zIndex={30} image={{ src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_black.png", size: { width: 64, height: 69 }, options: { offset: { x: 27, y: 69 } } }} />
                        <CustomOverlayMap position={{ lat: searchedPlace.y, lng: searchedPlace.x }} yAnchor={3.0} zIndex={31}>
                          <a href={`https://map.kakao.com/link/to/${searchedPlace.id}`} target="_blank" rel="noreferrer" className="ptnssearch-custom-overlay ptnssearch-searched-place-overlay" onClick={() => setShowToast(true)}>
                            {searchedPlace.place_name}<div className="overlay-arrow" />
                          </a>
                        </CustomOverlayMap>
                      </>
                    )}
                    <button className="ptnssearch-current-location-btn" onClick={findMyCurrentLocation} style={{ zIndex: 50 }}>
                      <CrosshairIcon />
                    </button>
                  </Map>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showToast && <ToastNotification message={t("ptnsSearchRedirectionToast")} onClose={() => setShowToast(false)} />}
    </>
  );
}