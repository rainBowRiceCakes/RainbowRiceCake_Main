// src/constants/orderStatus.js

// 1️⃣ 상태 코드 (비즈니스 기준)
export const ORDER_STATUS = {
  REQUESTED: "REQ",   // 배달 요청 (점주 submit)
  MATCHED: "MATCH",       // 기사 매칭 완료 (수락)
  DELIVERING: "PICK", // 배달 중 (픽업 완료 + 사진 업로드 완료)
  COMPLETED: "COM",   // 배달 완료 (전달 사진 업로드 완료)
};

// 2️⃣ 진행중 탭에서 보여줄 뱃지 텍스트 (UI 기준)
export const IN_PROGRESS_BADGE_TEXT = {
  [ORDER_STATUS.MATCHED]: "픽업하러 가는 중",
  [ORDER_STATUS.DELIVERING]: "호텔 가는 중",
};

// 3️⃣ 진행중 뱃지 텍스트 helper
export function getInProgressBadgeText(statusCode) {
  return IN_PROGRESS_BADGE_TEXT[statusCode] ?? "";
}

// 4️⃣ 네비게이션 mode 결정용
export function getNavModeByStatus(statusCode) {
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