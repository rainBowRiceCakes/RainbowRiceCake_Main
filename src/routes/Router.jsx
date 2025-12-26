/**
 * @file src/routes/Router.jsx
 * @description 라우터
 * 251214 v1.0.0 wook init
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
// import ProtectedRouter from "./ProtectedRouter.jsx"; // 인증/권한 로직 처리

// [main/sections] 디렉토리의 개별 섹션 컴포넌트들
import MainShow from "../components/main/MainShow.jsx";
// MainCover는 메인 페이지의 헤드 섹션이므로 일반적으로 단독 라우트는 불필요하지만,
// 나머지 컴포넌트들은 개별 페이지로의 연결을 가정합니다.
import MainCover from '../components/main/sections/MainCover.jsx';
import MainInfo from '../components/main/sections/MainInfo.jsx';
import MainFee from '../components/main/sections/MainFee.jsx';
// import MainDLVS from '../components/main/sections/MainDLVS.jsx';
import MainCS from '../components/main/sections/MainCS.jsx';
import MainPTNS from '../components/main/sections/MainPTNS.jsx';
import MainPTNSSearch from "../components/main/sections/MainPTNSSearch.jsx";

// 신규 인증 및 사용자 관련 컴포넌트
import Login from "../components/main/auth/Login.jsx";
import MyPage from "../components/main/auth/MyPage.jsx";
import Register from "../components/main/auth/Register.jsx";

// 사용자 정의 라우트 객체
const router = createBrowserRouter([
  {
    element: <App />, // App.jsx를 최상위 Layout으로 사용 (Header, Footer 포함)
    children: [
      {
        path: '/',
        element: <MainShow />,
        // MainShow는 모든 섹션을 포함하는 메인 화면
        // 'loader'에 정의한 처리는 라우트 진입 시 실행 됨
        // 'redirect'를 이용해서 해당 라우터로 이동
        loader: async () => {
          return null;
        }
      },
      // ---------------------------------
      // 1. MainShow 페이지 라우트
      // ---------------------------------      
      { 
        path: '/sections/cover', 
        element: <MainCover /> 
      },
      { 
        path: '/sections/info', 
        element: <MainInfo /> 
      },
      { 
        path: '/sections/fee', 
        element: <MainFee /> 
      },
      // { 
      //   path: '/sections/dlvs', 
      //   element: <MainDLVS /> 
      // },
      { 
        path: '/sections/cs', 
        element: <MainCS /> 
      },
      { 
        path: '/sections/ptns', 
        element: <MainPTNS /> 
      },
      { 
        path: '/sections/ptnssearch', 
        element: <MainPTNSSearch /> 
      },
      
      // ---------------------------------
      // 2. 인증/게스트 라우트
      // ---------------------------------
      { 
        path: '/login',
        element: <Login /> // 로그인/회원가입 선택 페이지
      },      
      { 
        path: '/mypage',
        element: <MyPage /> // 마이페이지
      }, 
      // { 
      //   path: '/register',
      //   element: <Register /> // 회원가입 폼
      // }, 

      // ---------------------------------
      // 3. 404 처리
      // ---------------------------------
      {
        path: '*',
        element: <div>404 Not Found</div>
      },

// // ---------------------------------
//             // 3. 보호된 라우트 그룹 (ProtectedRouter 사용)
//             // ---------------------------------
//             { 
//                 element: <ProtectedRouter />, 
//                 children: [
//                     // *참고: ProtectedRouter 내부의 정규식과 매칭되는 경로를 할당합니다.
//                     {
//                         path: '/mypage', // AUTH_REQUIRED_ROUTES에 매칭될 경로
//                         element: <MyPage /> 
//                     },
//                     // 기타 보호가 필요한 경로들을 여기에 추가...
//                 ]
//         ]
//     }
// ]);
      ]
    }
]);

export default function Router() {
    return <RouterProvider router={router} />;
};


