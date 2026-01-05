// partner.routes.jsx
import PartnerDashboard from '../components/partner/main/PartnerDashboard.jsx';
import PartnerOrderListPage from "../components/partner/orders/PartnerOrderListPage.jsx";
import PartnerOrderDetailPage from "../components/partner/orders/PartnerOrderDetailPage.jsx";
import PartnerIssueReportPage from "../components/partner/issues/PartnerIssueReportPage.jsx";
import PartnerNoticeList from "../components/partner/notices/PartnerNoticeList.jsx";
import PartnerFaqList from "../components/partner/help/PartnerFaqList.jsx";
import PartnerProfile from "../components/partner/profiles/PartnerProfile.jsx";
import PartnerDeliveryRequestPage from "../components/partner/requests/PartnerDeliveryRequestPage.jsx";
// import PartnerMyPage from "../components/partner/mypage/RiderMyPage.jsx";

const partnerRoutes = [
  { index: true, element: <PartnerDashboard /> },

  // 주문 관련 (Orders)
  {
    path: "orders",
    children: [
      { index: true, element: <PartnerOrderListPage /> },
      { path: "new", element: <PartnerDeliveryRequestPage /> },
      { path: ":orderCode", element: <PartnerOrderDetailPage /> },
      { path: "questions", element: <PartnerIssueReportPage /> },
    ]
  },

  // 공지사항 (notices)
  { path: "notices", element: <PartnerNoticeList /> },

  // 고객센터 및 기타 (help)
  {
    path: "help",
    children: [
      { index: true, element: <PartnerFaqList /> },
      { path: "questions", element: <PartnerIssueReportPage /> },
    ]
  },

  // 프로필 (profile)
  { path: "profile", element: <PartnerProfile /> },

  // 404 Not Found
  { path: '*', element: <div>404 Not Found</div> },
];

export default partnerRoutes;