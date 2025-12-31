import { createSlice } from "@reduxjs/toolkit";

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    selectedPlan: null,    // { id: 'basic', name: 'Basic', quantity: 1 }
    customerDetails: null, // 외국인 고객이 입력할 정보
    status: 'idle',        // idle | loading | success
  },
  reducers: {
    selectPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    updateQuantity: (state, action) => {
      if (state.selectedPlan) {
        // 수량은 최소 1개 이상으로 유지
        state.selectedPlan.quantity = Math.max(1, state.selectedPlan.quantity + action.payload);
      }
    },
    setCustomerDetails: (state, action) => {
      state.customerDetails = action.payload;
    },
    resetDelivery: (state) => {
      state.selectedPlan = null;
      state.customerDetails = null;
      state.status = 'idle';
    }
  }
});

export const { selectPlan, updateQuantity, setCustomerDetails, resetDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;