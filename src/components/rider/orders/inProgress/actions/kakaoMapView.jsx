import { Map, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import "./kakaoMapView.css";

export default function KakaoMapView({ riderLoc, targetLoc, targetName }) {
  const [map, setMap] = useState(null);

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  // 두 지점이 모두 보이도록 지도 범위 조정
  useEffect(() => {
    if (!map || !riderLoc || !targetLoc.lat) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(riderLoc.lat, riderLoc.lng));
    bounds.extend(new window.kakao.maps.LatLng(targetLoc.lat, targetLoc.lng));

    map.setBounds(bounds);
  }, [map, riderLoc, targetLoc]);

  if (loading) return <div className="map-loading">지도를 불러오는 중...</div>;

  return (
    <Map center={riderLoc || targetLoc} style={{ width: "100%", height: "100%" }} onCreate={setMap}>
      {/* 라이더 위치 */}
      {riderLoc && (
        <CustomOverlayMap position={riderLoc}>
          <div className="rider-marker">🏍️</div>
        </CustomOverlayMap>
      )}

      {/* 목적지 위치 */}
      {targetLoc.lat && (
        <CustomOverlayMap position={targetLoc} yAnchor={2.0}>
          <div className="ptnssearch-custom-overlay">
            {targetName}
            <div className="overlay-arrow" />
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
}