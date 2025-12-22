// src/data/dummyOrders.js
import { ORDER_STATUS } from "../constants/orderStatus.js";
import { randomFromArray, randomDateWithinHours } from "../utils/random.js";

/**
 * index: 고유 주문번호 생성용
 * statusOverride: 지정하면 해당 상태로 강제 생성 (탭 테스트 안정적)
 */
export const createDummyOrder = (index, statusOverride) => {
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
    statusCode === ORDER_STATUS.DELIVERING || statusCode === ORDER_STATUS.COMPLETED
      ? "https://dummyimage.com/400x300/ccc/000&text=pickup"
      : null;

  const dropoffPhotoUrl =
    statusCode === ORDER_STATUS.COMPLETED
      ? "https://dummyimage.com/400x300/aaa/000&text=delivered"
      : null;

  const completedAt =
    statusCode === ORDER_STATUS.COMPLETED ? randomDateWithinHours(1) : null;

  return {
    orderNo: `ORD-2025-${1000 + index}`,
    requestedAt: randomDateWithinHours(8),

    statusCode,

    // (선택) 상태별 타임스탬프
    acceptedAt,
    completedAt,

    pickupPlaceName: "올리브영 동성로점",
    pickupPlaceAddress: "대구 중구 동성로2길 55",
    pickupPlacePhone: "010-1234-5678",

    destinationHotelName: "호텔 온도 동성로",
    destinationHotelAddress: "대구 중구 국채보상로 203",
    destinationHotelPhone: "02-123-4567",

    pickupPhotoUrl,
    dropoffPhotoUrl,

    customerEmail: `customer${index}@gmail.com`,
    shoppingBagCount: randomFromArray([1, 2, 3]),
    shoppingBagSize: randomFromArray(["basic", "standard", "plus"]),

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

// ✅ slice initialState에서 바로 쓸 최종 더미 목록
export const dummyOrders = [
  ...dummyRequestedOrders,
  ...dummyMatchedOrders,
  ...dummyDeliveringOrders,
  ...dummyCompletedOrders,
];