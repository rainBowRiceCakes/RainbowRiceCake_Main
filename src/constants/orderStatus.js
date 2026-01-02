// src/constants/orderStatus.js

// 1️⃣ 상태 코드 (비즈니스 기준)
// 1️⃣ 주문 상태 상수 (프로젝트의 실제 값과 매칭)
export const ORDER_STATUS = {
  MATCHED: "mat",     // 가게 이동 중 (배차 완료)
  PICKED_UP: "pick",  // 호텔 이동 중 (픽업 완료)
  COMPLETED: "com",   // 배달 완료
};

// 2️⃣ 진행중 탭에서 보여줄 뱃지 텍스트
export const IN_PROGRESS_BADGE_TEXT = {
  [ORDER_STATUS.MATCHED]: "픽업하러 가는 중",
  [ORDER_STATUS.PICKED_UP]: "호텔 가는 중",
};

// 3️⃣ 진행중 뱃지 텍스트 helper
export function getInProgressBadgeText(status) {
  // status가 'com'인 경우는 진행중 탭에 없을 것이므로 
  // 매칭되는 텍스트가 없으면 빈 문자열을 반환합니다.
  return IN_PROGRESS_BADGE_TEXT[status] ?? "";
}

// 4️⃣ 네비게이션 mode 결정용
export function getNavModeByStatus(status) {
  if (statusCode === ORDER_STATUS.MATCHED) return "pickup";
  if (statusCode === ORDER_STATUS.DELIVERING) return "deliver";
  return "pickup";
}

// 5️⃣ (선택) 진행중 상태 여부 — 탭 필터용
export function isInProgressStatus(statusCode) {
  return (
    statusCode === ORDER_STATUS.MATCHED ||
    statusCode === ORDER_STATUS.DELIVERING
  );
}