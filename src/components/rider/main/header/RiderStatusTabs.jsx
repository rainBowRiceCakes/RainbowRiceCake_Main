// components/rider/main/RiderStatusTabs.jsx
import "./RiderStatusTabs.css";

export default function RiderStatusTabs({ activeTab, onChange }) {
  return (
    <div className="rider-status-tabs">
      <button
        type="button"
        className={`rider-status-tab ${activeTab === "waiting" ? "active" : ""}`}
        onClick={() => onChange("waiting")}
      >
        대기
      </button>

      <button
        type="button"
        className={`rider-status-tab ${activeTab === "inProgress" ? "active" : ""}`}
        onClick={() => onChange("inProgress")}
      >
        진행
      </button>

      <button
        type="button"
        className={`rider-status-tab ${activeTab === "completed" ? "active" : ""}`}
        onClick={() => onChange("completed")}
      >
        완료
      </button>
    </div>
  );
}