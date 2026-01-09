import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const KST = "Asia/Seoul";

export const generateOrderNo = () => {
  // 1. KST 기준 현재 시간
  const now = dayjs().tz(KST);

  // 2. 날짜 정보 (YYYYMMDD)
  const datePart = now.format("YYYYMMDD");

  // 3. 랜덤 숫자 5자리 (00000 ~ 99999)
  const randomPart = String(Math.floor(Math.random() * 100000)).padStart(5, "0");

  // 4. 결합
  return `${datePart}${randomPart}`;
};