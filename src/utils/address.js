/**
 * @file src/utils/address.js
 * @description 주소 검색 및 좌표 변환 관련 유틸리티 함수
 * 251229 v1.1.0 sara init
 */

/**
 * 입력된 주소(도로명/지번)를 카카오 지오코딩 서비스를 이용해 좌표로 변환합니다.
 * @param {string} address - 검색할 주소 문자열
 * @param {(coords: {lat: number, lng: number}) => void} callback - 변환 성공 시 좌표 객체를 인자로 받는 콜백 함수
 * @returns {void}
 */
export function searchAddressToCoords(address, callback) {
  // 유효성 검사: 주소가 없거나 콜백이 함수가 아니면 중단
  if (!address || typeof callback !== "function") return;
  
  // 카카오 지도 SDK 로드 여부 확인
  if (!window.kakao?.maps?.services) {
    console.error("카카오 지도 서비스 라이브러리가 로드되지 않았습니다.");
    return;
  }

  const geocoder = new window.kakao.maps.services.Geocoder();
  
  geocoder.addressSearch(address, (result, status) => {
    // 검색 결과가 성공(OK)이고 데이터가 존재할 때만 콜백 실행
    if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
      callback({
        lat: parseFloat(result[0].y),
        lng: parseFloat(result[0].x),
      });
    } else {
      console.warn("주소 변환에 실패했거나 결과가 없습니다.");
    }
  });
}