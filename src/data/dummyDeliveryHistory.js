// src/data/dummyDeliveryHistory.js
import dayjs from "dayjs";

// Helper to generate a random date in the past
const randomDateInPast = (days) => {
  return dayjs().subtract(Math.floor(Math.random() * days), 'day').toISOString();
};

export const dummyDeliveryHistory = [
  // Last 7 days
  {
    id: 1,
    orderNo: `ORD-2025-2020`,
    completedAt: randomDateInPast(6),
    pickup: "다이소 동성로점",
    dropoff: "호텔 온도",
    bagSize: "small",
    bagCount: 1,
  },
  {
    id: 2,
    completedAt: randomDateInPast(5),
    pickup: "올리브영 중앙로점",
    dropoff: "신라 스테이",
    bagSize: "medium",
    bagCount: 2,
  },
  // Last month
  {
    id: 3,
    completedAt: randomDateInPast(20),
    pickup: "자라 동성로점",
    dropoff: "토요코인",
    bagSize: "large",
    bagCount: 1,
  },
  {
    id: 4,
    completedAt: randomDateInPast(25),
    pickup: "현대백화점",
    dropoff: "엘디스 리젠트 호텔",
    bagSize: "small",
    bagCount: 3,
  },
  // Last two months
  {
    id: 5,
    completedAt: randomDateInPast(45),
    pickup: "무신사 스탠다드",
    dropoff: "리버틴 호텔",
    bagSize: "medium",
    bagCount: 1,
  },
  {
    id: 6,
    completedAt: randomDateInPast(55),
    pickup: "애플스토어",
    dropoff: "호텔 인사이트",
    bagSize: "small",
    bagCount: 1,
  },
].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)); // Sort by most recent
