import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 정의
const initialState = {
    activeMenu: 'home', // 기본값은 '홈'
};

export const partnerMenuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        // 메뉴를 변경하는 액션
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
    },
});

// 액션 생성함수 수출
export const { setActiveMenu } = partnerMenuSlice.actions;

// 리듀서 수출
export default partnerMenuSlice.reducer;