import PartnerLayout from "./layouts/PartnerLayout.jsx";
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
  { path: "orders/new", element: <PartnerDeliveryRequestPage /> },
  { path: "orders/:orderId/questions", element: <PartnerIssueReportPage /> },
  { path: "orders/:orderId", element: <PartnerOrderDetailPage /> },
  { path: "orders", element: <PartnerOrderListPage /> },
  // { path: "mypage", element: <PartnerMyPage /> },
  { path: "notices", element: <PartnerNoticeList /> },
  { path: "help", element: <PartnerFaqList /> },
  { path: "help/questions", element: <PartnerIssueReportPage /> },
  { path: "profile", element: <PartnerProfile /> },
  {
    path: '*',
    element: <div>404 Not Found</div>
  },
];

export default partnerRoutes;