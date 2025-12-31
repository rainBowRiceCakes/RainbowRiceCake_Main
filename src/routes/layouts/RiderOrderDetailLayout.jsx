// layouts/RiderOrderDetailLayout.jsx
import { Outlet, useMatches } from "react-router-dom";
import RiderBottomNav from "../../components/rider/common/RiderBottomNav.jsx";
import RiderSubHeader from "../../components/rider/common/RiderSubHeader.jsx";
import { useDispatch } from "react-redux";
import { reissueThunk } from "../../store/thunks/authThunk.js";
import { useEffect } from "react";
import './RiderOrderDetailLayout.css';

const RiderOrderDetailLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reissueThunk());
  }, [dispatch]);

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