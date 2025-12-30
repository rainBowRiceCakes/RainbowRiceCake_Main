import { createSlice } from "@reduxjs/toolkit";
import { noticeIndexThunk } from "../thunks/notices/noticeIndexThunk.js";

const initialState = {
  allNotices: [],
  ongoingNotices: [],
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
    // 기존 reducer들 유지
    setAllNotices: (state, action) => {
      state.allNotices = action.payload;
    },
    setOngoingNotices: (state, action) => {
      state.ongoingNotices = action.payload;
    },
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
        state.allNotices = action.payload.data || action.payload.notices || [];
        state.pagination = {
          currentPage: action.payload.currentPage || action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.totalItems || action.payload.total || 0,
          itemsPerPage: action.payload.itemsPerPage || action.payload.limit || 9
        };
      })
      .addCase(noticeIndexThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "공지사항을 불러오는데 실패했습니다.";
      });
  }
});

export const { setAllNotices, setOngoingNotices, clearError } = noticesSlice.actions;
export default noticesSlice.reducer;