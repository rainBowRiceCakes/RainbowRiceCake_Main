import { createSlice } from '@reduxjs/toolkit';
import { hotelIndexThunk } from '../thunks/hotels/hotelIndexThunk';

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(hotelIndexThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(hotelIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // 서버에서 받은 호텔 배열 저장
      })
      .addCase(hotelIndexThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hotelSlice.reducer;