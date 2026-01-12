import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import { useEffect, useState, useMemo, useCallback } from "react";
import "./kakaoMapView.css";

export default function KakaoMapView({ riderLoc, targetLoc, targetName }) {
  const [map, setMap] = useState(null);

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  const defaultCenter = useMemo(() => {
    if (riderLoc?.lat) return riderLoc;
    if (targetLoc?.lat) return targetLoc;
    return { lat: 35.8714, lng: 128.6014 };
  }, [riderLoc, targetLoc]);

  const openKakaoNavi = useCallback(() => {
    if (!targetLoc?.lat || !targetLoc?.lng) {
      alert("목적지 위치 정보가 없습니다.");
      return;
    }
    // 1. 목적지 정보 (필수)
    const destination = `${targetName || '목적지'},${targetLoc.lat},${targetLoc.lng}`;

    // 2. 출발지 정보 (선택적이지만 넣어주면 훨씬 편함)
    // riderLoc(기사의 현재 위치)이 있으면 sp 파라미터를 추가합니다.
    let url = `https://map.kakao.com/link/to/${destination}`;

    if (riderLoc?.lat && riderLoc?.lng) {
      // sp 파라미터 형식: sp=위도,경도 (이름을 넣고 싶으면 sp=이름,위도,경도)
      // 아래와 같이 'from' 파라미터를 추가하여 출발지를 강제할 수 있습니다.
      url = `https://map.kakao.com/link/from/내위치,${riderLoc.lat},${riderLoc.lng}/to/${destination}`;
    }

    window.open(url, '_blank');
  }, [targetLoc, targetName, riderLoc]);

  useEffect(() => {
    if (!map || !window.kakao) return;
    const bounds = new window.kakao.maps.LatLngBounds();
    let hasPoint = false;

    if (riderLoc?.lat && riderLoc?.lng) {
      bounds.extend(new window.kakao.maps.LatLng(riderLoc.lat, riderLoc.lng));
      hasPoint = true;
    }
    if (targetLoc?.lat && targetLoc?.lng) {
      bounds.extend(new window.kakao.maps.LatLng(targetLoc.lat, targetLoc.lng));
      hasPoint = true;
    }
    if (hasPoint) {
      map.setBounds(bounds);
    }
  }, [map, riderLoc, targetLoc]);

  if (loading) return <div className="map-loading">지도를 불러오는 중...</div>;

  return (
    <div className="kakao-map-wrapper">
      <Map
        center={defaultCenter}
        style={{ width: "100%", height: "100%" }}
        onCreate={setMap}
        level={3}
      >
        {/* 라이더 마커 */}
        {riderLoc?.lat && (
          <CustomOverlayMap position={riderLoc}>
            <div className="rider-marker">🏍️</div>
          </CustomOverlayMap>
        )}

        {/* 목적지 마커 */}
        {targetLoc?.lat && (
          <>
            <MapMarker position={targetLoc} />
            <CustomOverlayMap position={targetLoc} yAnchor={2.5}>
              <div className="ptnssearch-custom-overlay">
                {targetName || "목적지"}
                <div className="overlay-arrow" />
              </div>
            </CustomOverlayMap>
          </>
        )}
      </Map>
      <button className="kakaomap-navi-btn" onClick={openKakaoNavi}>
        <span className="icon">🗺️</span> 길찾기 시작
      </button>
    </div>
  );
}