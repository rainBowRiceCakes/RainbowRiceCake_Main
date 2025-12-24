// src/data/dummyOrders.js
import dayjs from "dayjs";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import { randomFromArray, randomDateWithinHours } from "../utils/random.js";

// Helper to generate a random date in the past
const randomDateInPast = (days) => {
  return dayjs()
    .subtract(Math.floor(Math.random() * days), "day")
    .toISOString();
};

/**
 * index: 고유 주문번호 생성용
 * statusOverride: 지정하면 해당 상태로 강제 생성 (탭 테스트 안정적)
 * completedAtOverride: 지정하면 해당 시간으로 강제 설정 (내역 테스트용)
 */
export const createDummyOrder = (
  index,
  statusOverride,
  completedAtOverride
) => {
  const statusList = Object.values(ORDER_STATUS);
  const statusCode = statusOverride ?? randomFromArray(statusList);

  // ✅ 상태 흐름 기준 파생 데이터 (일관성 유지)
  const acceptedAt =
    statusCode === ORDER_STATUS.MATCHED ||
    statusCode === ORDER_STATUS.DELIVERING ||
    statusCode === ORDER_STATUS.COMPLETED
      ? randomDateWithinHours(4)
      : null;

  const pickupPhotoUrl =
    statusCode === ORDER_STATUS.DELIVERING ||
    statusCode === ORDER_STATUS.COMPLETED
      ? "https://dummyimage.com/400x300/ccc/000&text=pickup"
      : null;

  const dropoffPhotoUrl =
    statusCode === ORDER_STATUS.COMPLETED
      ? "https://dummyimage.com/400x300/aaa/000&text=delivered"
      : null;

  const completedAt =
    completedAtOverride ??
    (statusCode === ORDER_STATUS.COMPLETED ? randomDateWithinHours(1) : null);

  return {
    orderNo: `ORD-2025-${1000 + index}`,
    requestedAt: randomDateWithinHours(8),

    statusCode,

    // (선택) 상태별 타임스탬프
    acceptedAt,
    completedAt,

    pickupPlaceName: randomFromArray(["다이소 동성로점", "올리브영 중앙로점", "자라 동성로점", "현대백화점", "무신사 스탠다드", "애플스토어"]),
    pickupPlaceAddress: "대구 중구 동성로2길 55",
    pickupPlacePhone: "010-1234-5678",

    destinationHotelName: randomFromArray(["호텔 온도", "신라 스테이", "토요코인", "엘디스 리젠트 호텔", "리버틴 호텔", "호텔 인사이트"]),
    destinationHotelAddress: "대구 중구 국채보상로 203",
    destinationHotelPhone: "02-123-4567",

    pickupPhotoUrl,
    dropoffPhotoUrl,

    customerEmail: `customer${index}@gmail.com`,
    shoppingBagCount: randomFromArray([1, 2, 3]),
    shoppingBagSize: randomFromArray(["small", "medium", "large"]),

    customerName: randomFromArray([
      "Emily Johnson",
      "Michael Brown",
      "Sophia Lee",
      "Daniel Kim",
      "Olivia Wilson",
    ]),
  };
};

// ✅ 상태별 더미 세트 (탭 테스트용)
export const dummyRequestedOrders = Array.from({ length: 3 }).map((_, i) =>
  createDummyOrder(i + 1, ORDER_STATUS.REQUESTED)
);

export const dummyMatchedOrders = Array.from({ length: 3 }).map((_, i) =>
  createDummyOrder(i + 10, ORDER_STATUS.MATCHED)
);

export const dummyDeliveringOrders = Array.from({ length: 3 }).map((_, i) =>
  createDummyOrder(i + 20, ORDER_STATUS.DELIVERING)
);

export const dummyCompletedOrders = Array.from({ length: 3 }).map((_, i) =>
  createDummyOrder(i + 30, ORDER_STATUS.COMPLETED)
);

// --- Legacy dummyDeliveryHistory Data ---

const dummyHistoryOrders = [
  // Last 7 days
  createDummyOrder(101, ORDER_STATUS.COMPLETED, randomDateInPast(6)),
  createDummyOrder(102, ORDER_STATUS.COMPLETED, randomDateInPast(5)),
  // Last month
  createDummyOrder(103, ORDER_STATUS.COMPLETED, randomDateInPast(20)),
  createDummyOrder(104, ORDER_STATUS.COMPLETED, randomDateInPast(25)),
  // Last two months
  createDummyOrder(105, ORDER_STATUS.COMPLETED, randomDateInPast(45)),
  createDummyOrder(106, ORDER_STATUS.COMPLETED, randomDateInPast(55)),
];

// ✅ slice initialState에서 바로 쓸 최종 더미 목록
export const dummyOrders = [
  ...dummyRequestedOrders,
  ...dummyMatchedOrders,
  ...dummyDeliveringOrders,
  ...dummyCompletedOrders,
  ...dummyHistoryOrders,
];

export const dummyDeliveryHistory = dummyHistoryOrders
  .map((order) => ({
    id: order.orderNo,
    completedAt: order.completedAt,
    pickup: order.pickupPlaceName,
    dropoff: order.destinationHotelName,
    bagSize: order.shoppingBagSize,
    bagCount: order.shoppingBagCount,
  }))
  .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));