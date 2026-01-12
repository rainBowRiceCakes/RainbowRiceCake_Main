import { createSlice } from '@reduxjs/toolkit';
import { myPageIndexThunk } from '../thunks/myPage/myPageIndexThunk.js';

const initialState = {
  summary: null, // { userName, deliveryStatus, inquiryStatus }가 저장될 공간
  loading: false,
  error: null,
};

const myPageIndexSlice = createSlice({
  name: 'myPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myPageIndexThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myPageIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data; 
        console.log("Slice Received Data:", action.payload.data);
      })
      .addCase(myPageIndexThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default myPageIndexSlice.reducer;
