/**
 * @file src/components/main/sections/MainPTNSSearch.jsx
 * @description 제휴업체 검색 페이지 (지도 기반 검색 레이아웃)
 * 251218 v1.0.0 sara init
 * 251220 v1.1.0 sara add kakao map modal
 * 251226 v1.2.0 useKakaoLoader 기반 지점 검색 (Geocoding 및 현위치 통합)
 * 251229 v1.3.0 429 에러 해결을 위한 서버 데이터 연동 및 지오코딩 로직 제거 + 커스텀 오버레이 생성
 */

import { useState, useContext, useCallback } from "react";
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import axiosInstance from "../../../api/axiosInstance.js";
import { searchAddressToCoords } from "../../../utils/address.js";
import { ptnsData } from "../../../data/ptnsdata.js";
import "./MainPTNSSearch.css";
import { LanguageContext } from "../../../context/LanguageContext";
import { FaLocationDot, FaXmark, FaMagnifyingGlass, FaStore, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import CrosshairIcon from "../../common/icons/CrosshairIcon";

const DEFAULT_LOCATION = { lat: 35.86905, lng: 128.59433 };
const SEARCH_RADIUS = 5000;

/**
 * field가
 * - string 이면 그대로 반환
 * - object면 language 키 우선, 없으면 ko/en 등 안전 fallback
 */
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

  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [map, setMap] = useState(null);

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  const normalizeStore = useCallback(
    async (s) => {
      // x,y가 있으면 좌표로 파싱
      if (s?.x && s?.y) {
        return {
          ...s,
          lat: Number.parseFloat(s.y),
          lng: Number.parseFloat(s.x),
        };
      }

      // 좌표 없으면 주소 기반으로 지오코딩 (기존 로직 유지)
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
    },
    [language]
  );

  const fetchNearbyStores = useCallback(
    async (lat, lng) => {
      try {
        const response = await axiosInstance.get("/api/partners", {
          params: { lat, lng, radius: SEARCH_RADIUS },
        });

        const serverData = response?.data?.data ?? [];
        const combinedData = serverData.length > 0 ? serverData : ptnsData;

        const processed = await Promise.all(combinedData.map(normalizeStore));
        setStores(processed);
      } catch (error) {
        console.warn("서버 호출 실패, 로컬 데이터를 표시합니다.", error);
        const processed = await Promise.all(ptnsData.map(normalizeStore));
        setStores(processed);
      }
    },
    [normalizeStore]
  );

  const openModalWithData = () => {
    setIsModalOpen(true);
    fetchNearbyStores(myLocation.lat, myLocation.lng); // 내 위치 기준으로
    setCenter(myLocation); // 지도 중심도 내 위치로
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
        } else {
          setSearchResults([]);
          setIsDropdownOpen(false);
        }
      });
    }
  };

  const handleSelectPlace = (place) => {
    const newCenter = { lat: Number.parseFloat(place.y), lng: Number.parseFloat(place.x) };

    setKeyword(place.place_name);
    setCenter(newCenter);
    setIsDropdownOpen(false);

    fetchNearbyStores(newCenter.lat, newCenter.lng);

    if (map) map.setCenter(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng));
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);

    const newCenter = { lat: store.lat, lng: store.lng };
    setCenter(newCenter);
    setIsSheetOpen(false);

    if (map) map.panTo(new window.kakao.maps.LatLng(store.lat, store.lng));
  };

  const clearKeyword = () => {
    setKeyword("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  const findMyCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const newLoc = { lat, lng };
      setMyLocation(newLoc);     //  내 위치 갱신
      setCenter(newLoc);         //  지도 중심도 내 위치로

      if (map) map.setCenter(new window.kakao.maps.LatLng(lat, lng));
      if (!isModalOpen) setIsModalOpen(true);

      fetchNearbyStores(lat, lng);
    });
  };

  return (
    <>
      <div className="ptnssearch-frame mainshow-section-wrapper">
        <div className="ptnssearch-header-group">
          <h2 className="ptnssearch-title-text">{t("ptnsSearchTitle")}</h2>
          <p className="ptnssearch-desc-text">{t("ptnsSearchDesc")}</p>
        </div>

        <div className="ptnssearch-content-container">
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
      </div>

      {isModalOpen && (
        <div className="ptnssearch-modal-overlay">
          <div className="ptnssearch-modal-content">
            <div className="ptnssearch-modal-header">
              <h3 className="ptnssearch-modal-header-title">{t("ptnsSearchTitle")}</h3>
              <button onClick={() => setIsModalOpen(false)} className="ptnssearch-modal-close-button">
                <FaXmark />
              </button>
            </div>

            <div className="ptnssearch-main-layout">
              <div className={`ptnssearch-sidebar ${isSheetOpen ? "ptnssearch-sheet-open" : ""}`}>
                <button className="ptnssearch-mobile-sheet-handle" onClick={() => setIsSheetOpen((v) => !v)}>
                  {isSheetOpen ? <FaChevronDown /> : <FaChevronUp />}
                  <span>{isSheetOpen ? t("ptnsSearchViewMap") : t("ptnsSearchViewList")}</span>
                </button>

                <div className="ptnssearch-sidebar-search-area">
                  <div className="ptnssearch-sidebar-input-wrapper">
                    <FaMagnifyingGlass className="ptnssearch-sidebar-search-icon" />
                    <input
                      type="text"
                      className="ptnssearch-sidebar-search-input"
                      placeholder={t("ptnsSearchPlaceholder")}
                      value={keyword}
                      onChange={(e) => handleKeywordSearch(e.target.value)}
                    />
                    {!!keyword && <FaXmark className="ptnssearch-input-clear" onClick={clearKeyword} />}
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
                      <div
                        key={store.id}
                        className={`ptnssearch-sidebar-store-item ${selectedStore?.id === store.id ? "ptnssearch-is-active" : ""
                          }`}
                        onClick={() => handleSelectStore(store)}
                      >
                        <div className="ptnssearch-store-item-name">
                          <FaStore />
                          {getLangText(store.storeName, language)}
                        </div>
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
                    {/* Custom marker for current location (rainbow gradient) */}
                    <CustomOverlayMap position={myLocation} yAnchor={1.0}>
                      <div className="current-location-marker" />
                    </CustomOverlayMap>

                    <CustomOverlayMap position={myLocation} yAnchor={2.3}>
                      <div className="ptnssearch-custom-overlay ptnssearch-my-location-overlay">
                        {myLocation.lat === DEFAULT_LOCATION.lat && myLocation.lng === DEFAULT_LOCATION.lng
                          ? t("mainLocationHeadquarters")
                          : t("mainLocationMyLocation")}
                        <div className="overlay-arrow" />
                      </div>
                    </CustomOverlayMap>

                    {stores.map((store) => (
                      <CustomOverlayMap
                        key={store.id}
                        position={{ lat: store.lat, lng: store.lng }}
                        yAnchor={1.0} // Adjust as needed for correct positioning
                      >
                        <div
                          className={`partner-custom-marker ${selectedStore?.id === store.id ? "partner-custom-marker-selected" : ""
                            }`}
                          onClick={() => handleSelectStore(store)}
                        >
                        </div>
                      </CustomOverlayMap>
                    ))}

                    {!!selectedStore && (
                      <CustomOverlayMap position={{ lat: selectedStore.lat, lng: selectedStore.lng }} yAnchor={2.3}>
                        <div className="ptnssearch-custom-overlay">
                          {getLangText(selectedStore.storeName, language)}
                          <div className="overlay-arrow" />
                        </div>
                      </CustomOverlayMap>
                    )}

                    <button className="ptnssearch-current-location-btn" onClick={findMyCurrentLocation}>
                      <CrosshairIcon />
                    </button>
                  </Map>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}