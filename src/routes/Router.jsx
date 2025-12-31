/**
 * @file src/routes/Router.jsx
 * @description 라우터
 * 251214 v1.0.0 wook init
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import ProtectedRouter from "./ProtectedRouter.jsx"; // 인증/권한 로직 처리
import Social from "../components/main/auth/Social.jsx";
import NotFound from "../components/common/NotFound.jsx"; // Import the NotFound component

// [main/sections] 디렉토리의 개별 섹션 컴포넌트들
import MainShow from "../components/main/MainShow.jsx";
// MainCover는 메인 페이지의 헤드 섹션이므로 일반적으로 단독 라우트는 불필요하지만,
// 나머지 컴포넌트들은 개별 페이지로의 연결을 가정합니다.
import MainCover from '../components/main/sections/MainCover.jsx';
import MainInfo from '../components/main/sections/MainInfo.jsx';
import MainFee from '../components/main/sections/MainFee.jsx';
import MainCS from '../components/main/sections/MainCS.jsx';
import MainPTNS from '../components/main/sections/MainPTNS.jsx';
import MainPTNSSearch from "../components/main/sections/MainPTNSSearch.jsx";

// 신규 인증 및 사용자 관련 컴포넌트
import Login from "../components/main/auth/Login.jsx";
import MyPage from "../components/main/auth/MyPage.jsx";
import RiderLayout from "./layouts/RiderLayout.jsx";
import PartnerLayout from "./layouts/PartnerLayout.jsx";
import riderRoutes from "./rider.routes.jsx";
import partnerRoutes from "./partner.routes.jsx";

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
        path: '/sections/plans', // DGD Plans section
        element: <MainInfo />
      },
      {
        path: '/sections/fee', // Fee information section
        element: <MainFee />
      },
      {
        path: '/sections/support', // Customer Support section
        element: <MainCS />
      },
      {
        path: '/sections/partners', // Partnership inquiry section
        element: <MainPTNS />
      },
      {
        path: '/sections/branches', // Find Branches section
        element: <MainPTNSSearch />
      },

      // ---------------------------------
      // 2. 인증/게스트 라우트
      // ---------------------------------
      {
        path: '/login',
        element: <Login /> // 로그인/회원가입 선택 페이지
      },

      // ---------------------------------
      // 3. 보호된 라우트 그룹 (인증 필수)
      // ---------------------------------
      {
        element: <ProtectedRouter />, // ProtectedRouter로 하위 경로 보호
        children: [
          {
            path: '/mypage', // 마이페이지는 로그인한 사용자만 접근 가능
            element: <MyPage />
          },
        ]
      },
      // ---------------------------------
      // 4. 404 처리 or 소설 로그인 콜백
      // ---------------------------------
      {
        path: '*',
        element: <NotFound />
      },
      {
        path: '/callback/social',
        element: <Social />
      }
    ]
  },
  {
    path: "/riders",
    element: <RiderLayout />,
    children: riderRoutes,
  },
  {
    path: "/partners",
    element: <PartnerLayout />,
    children: partnerRoutes,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
};


