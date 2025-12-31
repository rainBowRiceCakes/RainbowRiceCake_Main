export const submitDeliveryRequest = createAsyncThunk(
  "delivery/submit",
  async (_, { getState, rejectWithValue }) => {
    const { delivery } = getState();
    try {
      const response = await axios.post("/api/delivery/request", {
        plan: delivery.selectedPlan,
        customer: delivery.customerDetails
      });
      return response.data; // 성공 시 모달 노출 유도
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);