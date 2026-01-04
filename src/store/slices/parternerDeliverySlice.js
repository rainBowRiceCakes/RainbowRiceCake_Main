import { createSlice } from "@reduxjs/toolkit";
import { submitDeliveryRequest } from "../thunks/requests/submitDeliveryRequestThunk";

const initialState = {
  selectedPlans: [],
  customerDetails: {
    firstName: '',
    lastName: '',
    email: '',
    hotel: ''
  },
  loading: false,
  error: null
};

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    addPlan: (state, action) => {
      const existing = state.selectedPlans.find(p => p.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.selectedPlans.push(action.payload);
    },
    removePlan: (state, action) => {
      state.selectedPlans = state.selectedPlans.filter(p => p.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { planId, amount } = action.payload;
      const plan = state.selectedPlans.find(p => p.id === planId);
      if (plan) {
        plan.quantity += amount;
        if (plan.quantity <= 0) state.selectedPlans = state.selectedPlans.filter(p => p.id !== planId);
      }
    },
    setCustomerDetails: (state, action) => {
      state.customerDetails = { ...state.customerDetails, ...action.payload };
    },
    resetDelivery: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDeliveryRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitDeliveryRequest.fulfilled, (state) => {
        return initialState; // 성공 시 모든 상태(장바구니, 입력폼) 초기화
      })
      .addCase(submitDeliveryRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addPlan, removePlan, updateQuantity, setCustomerDetails, resetDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;