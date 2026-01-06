import { createSlice } from '@reduxjs/toolkit';
import { mypageIndexThunk } from '../thunks/myPage/myPageIndexThunk.js';

const initialState = {
  summary: null,
  loading: false,
  error: null,
};

const myPageIndexSlice = createSlice({
  name: 'myPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(mypageIndexThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mypageIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
        console.log( action.payload.data );
      })
      .addCase(mypageIndexThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default myPageIndexSlice.reducer;
