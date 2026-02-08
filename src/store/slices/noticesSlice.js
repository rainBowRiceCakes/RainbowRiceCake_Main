import { createSlice } from "@reduxjs/toolkit";
import { noticeIndexThunk } from "../thunks/notices/noticeIndexThunk.js";

const initialState = {
  allNotices: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  }
};

const noticesSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(noticeIndexThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(noticeIndexThunk.fulfilled, (state, action) => {
        state.loading = false;

        // 1. 데이터 추출
        const { data, notices } = action.payload;
        const rows = data?.rows || notices || [];
        state.allNotices = rows;

        // 2. 페이지네이션 정보 (백엔드 데이터 우선 -> 요청 인자 차선)
        const totalItems = data?.count ?? action.payload.totalCount ?? rows.length;
        const itemsPerPage = action.meta.arg?.limit || state.pagination.itemsPerPage;
        const currentPage = action.meta.arg?.page || state.pagination.currentPage;

        state.pagination = {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages: Math.ceil(totalItems / itemsPerPage) || 1,
        };
      })
      .addCase(noticeIndexThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "공지사항을 불러오는데 실패했습니다.";
      });
  }
});

export const { clearError } = noticesSlice.actions;
export default noticesSlice.reducer;
