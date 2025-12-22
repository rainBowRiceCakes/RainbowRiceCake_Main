// src/routes/rider.routes.jsx
import { Navigate } from "react-router-dom";
// main pages
import RiderMainPage from "../components/rider/main/RiderMainPage.jsx";
import RiderNavFlowPage from "../components/rider/orders/inProgress/actions/RiderNavFlowPage.jsx";
import RiderOrderDetailPage from "../components/rider/orders/RiderOrderDetailPage.jsx";
import RiderIssueReportPage from "../components/rider/issues/RiderIssueReportPage.jsx";
import RiderPhotoPage from "../components/rider/orders/inProgress/actions/RiderPhotoPage.jsx"

// mypage layout and pages
import RiderMyPage from "../components/rider/account/MyPage.jsx";
// import RiderNoticeList from "../components/rider/account/notices/RiderNoticeList.jsx";
// import RiderFaqList from "../components/rider/account/help/RiderFaqList.jsx";
import RiderMyPageLayout from "./layouts/RiderMyPageLayout.jsx";

const riderRoutes = [
  // ✅ /rider 로 들어오면 /rider/1 로 보내기 (개발용)
  { index: true, element: <Navigate to="1" replace /> },

  // ✅ /rider/:id 아래로 전부 모으기
  {
    path: ":id",
    children: [
      // ✅ 메인 대시보드 (고정 헤더와 bottomnav 없음)
      { index: true, element: <RiderMainPage /> },

      // ✅ 진행 플로우
      { path: "navigate/:orderId", element: <RiderNavFlowPage mode="pickup" /> },
      { path: "pickup-photo/:orderId", element: <RiderPhotoPage mode="pickup" /> },
      { path: "delivering/:orderId", element: <RiderNavFlowPage mode="deliver" /> },
      { path: "dropoff-photo/:orderId", element: <RiderPhotoPage mode="dropoff" /> },

      // ✅ 주문 상세 / 이슈
      { path: "orders/:orderId", element: <RiderOrderDetailPage /> },
      { path: "orders/:orderId/issue", element: <RiderIssueReportPage /> },

      // 👤 마이페이지 그룹 (헤더+바텀탭 고정)
      {
        path: "mypage",
        element: <RiderMyPageLayout />,
        children: [
          { index: true, element: <RiderMyPage />, handle: { title: "마이페이지" } },
          // { path: "notices", element: <RiderNoticeList />, handle: { title: "공지사항" } },
          // { path: "help", element: <RiderFaqList />, handle: { title: "도움말 / 문의하기" } },
          // policy, profile, settlement, history...
        ],
      },
    ],
  },
];

export default riderRoutes;

// /rider/waiting
// /rider/in-progress
// /rider/completed
// /rider/in-progress/:orderId
// /rider/completed/:orderId

