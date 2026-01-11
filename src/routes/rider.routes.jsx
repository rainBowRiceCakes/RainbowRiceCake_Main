// src/routes/rider.routes.jsx
// main pages
import RiderMainPage from "../components/rider/main/RiderMainPage.jsx";
import RiderNavFlowPage from "../components/rider/orders/inProgress/actions/RiderNavFlowPage.jsx";
import RiderOrderDetailPage from "../components/rider/orders/RiderOrderDetailPage.jsx";
import RiderIssueReportPage from "../components/rider/issues/RiderIssueReportPage.jsx";
import RiderPhotoPage from "../components/rider/orders/inProgress/actions/RiderPhotoPage.jsx"

// mypage layout and pages
import RiderNoticeList from "../components/rider/mypage/notices/RiderNoticeList.jsx";
import ProfileEdit from "../components/rider/mypage/profile/ProfileEdit.jsx";
import DeliveryHistory from "../components/rider/mypage/history/DeliveryHistory.jsx";
import SettlementList from "../components/rider/mypage/settlement/SettlementList.jsx";
import RiderFaqList from "../components/rider/mypage/help/RiderFaqList.jsx";
import RiderMyPageLayout from "./layouts/RiderMyPageLayout.jsx";
import RiderMyPage from "../components/rider/mypage/RiderMyPage.jsx";
import RiderOrderDetailLayout from "./layouts/RiderOrderDetailLayout.jsx";
import InquiryHistoryPage from "../components/rider/mypage/inquiry/InquiryHistoryPage.jsx";

const riderRoutes = [
  { index: true, element: <RiderMainPage /> },

  // ✅ 진행 플로우
  { path: "orders/:orderCode/nav", element: <RiderNavFlowPage /> },
  { path: "orders/:orderCode/pickup-photo", element: <RiderPhotoPage /> },
  { path: "orders/:orderCode/dropoff-photo", element: <RiderPhotoPage /> },

  // 🔹 주문 상세 / 이슈 (공용 레이아웃)
  {
    path: "orders",
    element: <RiderOrderDetailLayout />,
    children: [
      { path: ":orderCode", element: <RiderOrderDetailPage />, handle: { title: "주문 상세보기" } },
      { path: ":orderCode/questions", element: <RiderIssueReportPage />, handle: { title: "도움 요청하기" } },
    ],
  },
  // 👤 마이페이지 그룹 (헤더+바텀탭 고정)
  {
    path: "mypage",
    element: <RiderMyPageLayout />,
    children: [
      { index: true, element: <RiderMyPage />, handle: { title: "마이페이지" } },
      { path: "notices", element: <RiderNoticeList />, handle: { title: "공지사항" } },
      { path: "profile", element: <ProfileEdit />, handle: { title: "내 정보" } },
      { path: "orders", element: <DeliveryHistory />, handle: { title: "배송 히스토리" } },
      { path: "orders/:orderCode", element: <RiderOrderDetailPage />, handle: { title: "주문 상세보기" } },
      { path: "orders/:orderCode/questions", element: <RiderIssueReportPage />, handle: { title: "도움 요청하기" } },
      { path: "settlement", element: <SettlementList />, handle: { title: "정산 내역" } },
      { path: "help", element: <RiderFaqList />, handle: { title: "고객센터" } },
      { path: "inquiry", element: <InquiryHistoryPage />, handle: { title: "내 문의 내역" } },
      { path: "help/questions", element: <RiderIssueReportPage />, handle: { title: "도움 요청하기" } },
    ],
  },
];

export default riderRoutes;

// /rider/waiting
// /rider/in-progress
// /rider/completed
// /rider/in-progress/:orderId
// /rider/completed/:orderId


// routes/riderRoutes.js
// import { Navigate } from "react-router-dom";

// import RiderMainPage from "../pages/RiderMainPage";
// import RiderNavFlowPage from "../pages/RiderNavFlowPage";
// import RiderPhotoPage from "../pages/RiderPhotoPage";
// import RiderOrderDetailPage from "../pages/RiderOrderDetailPage";
// import RiderIssueReportPage from "../pages/RiderIssueReportPage";

// import RiderMyPageLayout from "../layouts/RiderMyPageLayout";
// import RiderDetailLayout from "../layouts/RiderDetailLayout";

// const riderRoutes = [
//   { index: true, element: <Navigate to="1" replace /> },

//   {
//     path: ":id",
//     children: [
//       // 메인 (풀스크린)
//       { index: true, element: <RiderMainPage /> },

//       // 진행 플로우 (풀스크린)
//       { path: "navigate/:orderId", element: <RiderNavFlowPage mode="pickup" /> },
//       { path: "pickup-photo/:orderId", element: <RiderPhotoPage mode="pickup" /> },
//       { path: "delivering/:orderId", element: <RiderNavFlowPage mode="deliver" /> },
//       { path: "dropoff-photo/:orderId", element: <RiderPhotoPage mode="dropoff" /> },

//       // 🔹 주문 상세 / 이슈 (공용 레이아웃)
//       {
//         element: <RiderDetailLayout />,
//         children: [
//           { path: "orders/:orderId", element: <RiderOrderDetailPage /> },
//           { path: "orders/:orderId/issue", element: <RiderIssueReportPage /> },
//           { path: "mypage/issue", element: <RiderIssueReportPage /> },
//         ],
//       },

//       // 👤 마이페이지
//       {
//         path: "mypage",
//         element: <RiderMyPageLayout />,
//         children: [
//           { index: true, element: <RiderMyPage /> },
//           { path: "notices", element: <RiderNoticeList /> },
//           { path: "profile", element: <ProfileEdit /> },
//           { path: "history", element: <DeliveryHistory /> },
//           { path: "settlement", element: <SettlementList /> },
//           { path: "help", element: <RiderFaqList /> },
//         ],
//       },
//     ],
//   },
// ];

// export default riderRoutes;