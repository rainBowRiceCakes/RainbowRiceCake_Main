import { createSlice } from '@reduxjs/toolkit';
import { getSettlementThunk } from '../thunks/riders/getSettlementThunk.js';
import { getSettlementDetailThunk } from '../thunks/riders/getSettlementDetailThunk.js'; // 추가된 Thunk
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// ✅ 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

const KST = "Asia/Seoul";

const riderSettlementSlice = createSlice({
  name: 'riderSettlement',
  initialState: {
    settlementHistory: [],     // 정산 목록
    selectedDetail: null,      // ✅ 상세 내역을 저장할 공간 추가
    loading: false,
    detailLoading: false,      // 상세 로딩을 따로 관리하면 UI 처리가 더 깔끔합니다.
    error: null,
  },
  reducers: {
    // 상세 내역 초기화가 필요할 때 사용
    clearDetail: (state) => {
      state.selectedDetail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- 기존 목록 조회 로직 --- */
      .addCase(getSettlementThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSettlementThunk.fulfilled, (state, action) => {
        state.loading = false;

        const settlementList = action.payload.data;

        state.settlementHistory = settlementList.map(item => {
          // 1. 해당 정산 월의 1일 날짜 생성 (예: 2025-11-01)
          const baseDate = dayjs(`${item.year}-${item.month}-01`).tz(KST);

          // 2. 다음 달 10일 계산 (11월 정산건 -> 12월 10일)
          const paymentDate = baseDate.add(1, 'month').date(10).format('YYYY-MM-DD');

          return {
            id: item.id,
            period: `${item.year}년 ${item.month}월 정산 내역`,
            settlementDate: paymentDate, // ✅ "다음달 10일"로 변경된 날짜
            amount: Number(item.total_amount || 0),
            status: item.status === 'RES' ? '정산완료' : item.status === 'REQ' ? '정산대기' : '반려',
            statusCode: item.status
          };
        });
      })
      .addCase(getSettlementThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "데이터를 불러오는 데 실패했습니다.";
      })

      /* --- ✅ 상세 내역 조회 로직 추가 --- */
      .addCase(getSettlementDetailThunk.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getSettlementDetailThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        const detailData = action.payload.data;
        state.selectedDetail = detailData;
      })
      .addCase(getSettlementDetailThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload?.msg || "상세 내역을 불러오지 못했습니다.";
      });
  },
});

export const { clearDetail } = riderSettlementSlice.actions; // 액션 내보내기
export default riderSettlementSlice.reducer;