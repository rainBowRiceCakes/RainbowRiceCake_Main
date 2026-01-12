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
export const LOCATION_ERRORS = {
  NOT_SUPPORTED: "LOCATION_NOT_SUPPORTED",
  FAILED_TO_RETRIEVE: "LOCATION_FAILED_TO_RETRIEVE",
};

export function getCurrentLocation(args = {}) {
  const { onSuccess, onError, options } = args;

  // 브라우저 지원 여부 확인
  if (!navigator.geolocation) {
    onError?.(new Error(LOCATION_ERRORS.NOT_SUPPORTED));
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
      onError?.(err instanceof Error ? err : new Error(LOCATION_ERRORS.FAILED_TO_RETRIEVE));
    },
    options
  );
}