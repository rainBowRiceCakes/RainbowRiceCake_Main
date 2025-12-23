import { createSlice } from "@reduxjs/toolkit";

const noticesSlice = createSlice({
  name: "notices",
  initialState: {
    allNotices: [],
    todaysNotices: [],
  },
  reducers: {
    setAllNotices: (state, action) => {
      state.allNotices = action.payload;
    },
    setTodaysNotices: (state, action) => {
      state.todaysNotices = action.payload;
    },
  },
});

export const { setAllNotices, setTodaysNotices } = noticesSlice.actions;
export default noticesSlice.reducer;