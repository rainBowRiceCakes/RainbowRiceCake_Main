// components/rider/main/RiderMainPage.jsx
import "./RiderMainPage.css";
import { useState, useMemo } from "react";

import RiderInfoBar from "./header/RiderInfoBar.jsx";
import RiderStatusTabs from "./header/RiderStatusTabs.jsx";
import RiderNoticeBar from "./header/RiderNoticeBar.jsx";

import RiderWaitingView from "../orders/waiting/RiderWaitingView.jsx";
import RiderInProgressView from "../orders/inProgress/RiderInProgressView.jsx";
import RiderCompletedView from "../orders/completed/RiderCompletedView.jsx";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ORDER_STATUS } from "../../../src/constants/orderStatus.js";
import { acceptOrder } from "../../../src/store/slices/ordersSlice.js";

export default function RiderMainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const orders = useSelector((state) => state.orders?.orders ?? []);
  const [activeTab, setActiveTab] = useState("waiting");

  const tabOrders = useMemo(() => {
    const waiting = orders.filter((o) => o.statusCode === ORDER_STATUS.REQUESTED);

    // ✅ 진행 = 픽업이동(MATCHED) + 호텔이동(DELIVERING)
    const inProgress = orders.filter((o) =>
      [ORDER_STATUS.MATCHED, ORDER_STATUS.DELIVERING].includes(o.statusCode)
    );

    const completed = orders.filter((o) => o.statusCode === ORDER_STATUS.COMPLETED);

    return { waiting, inProgress, completed };
  }, [orders]);

  const handleAccept = (orderNo) => {
    dispatch(acceptOrder(orderNo));
    navigate(`/rider/${id}/navigate/${orderNo}`, {
      state: {
        justAccepted: true,
        message: "배달이 시작됐어요! 픽업 장소로 이동해주세요 🚴‍♂️",
      },
    });
  };

  return (
    <div className="rider-main">
      <RiderInfoBar />
      <RiderStatusTabs activeTab={activeTab} onChange={setActiveTab} />
      <RiderNoticeBar />

      {activeTab === "waiting" && (
        <RiderWaitingView orders={tabOrders.waiting} onAccept={handleAccept} />
      )}

      {activeTab === "inProgress" && (
        <RiderInProgressView orders={tabOrders.inProgress} />
      )}

      {activeTab === "completed" && (
        <RiderCompletedView orders={tabOrders.completed} />
      )}
    </div>
  );
}