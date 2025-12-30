import { createSlice } from "@reduxjs/toolkit";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk";

const riderSlice = createSlice({
	name: "rider",
	initialState: {
		riderInfo: null, // 차량번호, 면허번호 등 라이더 고유 데이터
		loading: false,
	},
	reducers: {
		setRiderInfo: (state, action) => {
			state.riderInfo = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
			// 라이더 역시 주소/전화번호 수정 성공 시 자신의 상태 업데이트
			if (state.riderInfo) {
				state.riderInfo.phone = action.payload.phone;
				state.riderInfo.address = action.payload.address;
			}
		});
	},
});

export const { setRiderInfo } = riderSlice.actions;
export default riderSlice.reducer;