// components/rider/layout/RiderMyPageLayout.jsx
import "./RiderMyPageLayout.css";
import { Outlet, useMatches } from "react-router-dom";
import RiderSubHeader from "../../components/rider/common/RiderSubHeader.jsx";
import RiderBottomNav from "../../components/rider/common/RiderBottomNav.jsx";

export default function RiderMyPageLayout() {
  const matches = useMatches();

  const title =
    [...matches].reverse().find((m) => m.handle?.title)?.handle.title ?? "";

  return (
    <div className="rider-mypage-layout">
      {/* ✅ 폭을 통일할 프레임 */}
      <div className="rider-mypage-frame">
        <RiderSubHeader title={title} />

        <main className="rider-mypage-content">
          <Outlet />
        </main>

        <RiderBottomNav />
      </div>
    </div>
  );
}