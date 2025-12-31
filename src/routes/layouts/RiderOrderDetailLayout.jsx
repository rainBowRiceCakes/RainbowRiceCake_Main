// layouts/RiderOrderDetailLayout.jsx
import { Outlet, useMatches } from "react-router-dom";
import RiderBottomNav from "../../components/rider/common/RiderBottomNav.jsx";
import RiderSubHeader from "../../components/rider/common/RiderSubHeader.jsx";

const RiderOrderDetailLayout = () => {
  const matches = useMatches();

  const title =
    [...matches].reverse().find((m) => m.handle?.title)?.handle.title ?? "";

  return (
    <>
      <RiderSubHeader title={title} />
      <main>
        <Outlet />
      </main>
      <RiderBottomNav />
    </>
  );
};

export default RiderOrderDetailLayout;