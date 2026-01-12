import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isSidebarCollapsed: false },
  reducers: {
    setSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    }
  }
});

export const { setSidebarCollapsed, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;