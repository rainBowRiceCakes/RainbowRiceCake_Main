/**
 * @file src/hooks/useDaumPostcodePopup.jsx
 * @description 우편번호로 검색하는 지도 관련 훅스(모노크롬 테마 포함)
 * 251226 v1.0.0 sara init 
 */

// 1. 흑백 테마 오브젝트 정의
export const monochromeTheme = {
  bgColor: "#FFFFFF", 
  searchBgColor: "#111827", // var(--com-color-black)
  contentBgColor: "#FFFFFF", 
  pageBgColor: "#FFFFFF", 
  textColor: "#111827", 
  queryTextColor: "#FFFFFF", 
  postcodeTextColor: "#6b7280", // var(--com-font-muted)
  emphTextColor: "#111827", 
  outlineColor: "#E0E0E0" // var(--com-border-default)
};

// 주소 -> 좌표 변환을 위한 유틸리티 함수
export const searchAddressToCoords = (address, callback) => {
  if (window.kakao && window.kakao.maps) {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        callback({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
        });
      }
    });
  }
};