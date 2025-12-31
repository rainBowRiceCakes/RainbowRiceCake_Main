import { Outlet } from "react-router-dom";
import "./RiderLayout.css";

export default function RiderLayout() {
  return (
    <div className="rider-shell">
      <div className="rider-container">
        <Outlet />
      </div>
    </div>
  );
}