/**
 * @file src/utils/location.js
 * @description 지리적 위치(Geolocation) 관련 유틸리티 함수
 * 251229 v1.1.0 sara init
 */

/**
 * @typedef {Object} LatLng
 * @property {number} lat - 위도
 * @property {number} lng - 경도
 */

/**
 * @typedef {Object} GetCurrentLocationArgs
 * @property {(coords: LatLng) => void} [onSuccess] - 위치 가져오기 성공 시 실행할 콜백
 * @property {(error: Error) => void} [onError] - 위치 가져오기 실패 시 실행할 콜백
 * @property {PositionOptions} [options] - Geolocation API 옵션 (timeout, enableHighAccuracy 등)
 */

/**
 * 브라우저 API를 이용해 사용자의 현재 좌표(위도, 경도)를 가져옵니다.
 * @param {GetCurrentLocationArgs} [args] - 성공/실패 콜백 및 옵션 객체
 * @returns {void}
 */
export function getCurrentLocation(args = {}) {
  const { onSuccess, onError, options } = args;

  // 브라우저 지원 여부 확인
  if (!navigator.geolocation) {
    onError?.(new Error("이 브라우저에서는 위치 정보 기능을 지원하지 않습니다."));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onSuccess?.({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => {
      // 에러 객체 타입 보정 및 전달
      onError?.(err instanceof Error ? err : new Error("현재 위치를 가져오는 데 실패했습니다."));
    },
    options
  );
}