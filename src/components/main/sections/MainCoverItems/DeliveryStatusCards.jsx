/**
 * @file src/components/main/sections/MainCoverItems/DeliveryStatusCards.jsx
 * @description 배송 상태 4단계 스텝퍼 (waiting/matched/pickup/complete)
 * 251224 v1.0.0 sara init
 */

import "./DeliveryStatusCards.css";
import { FaClipboardCheck, FaUserCheck, FaTruckFast, FaCircleCheck } from "react-icons/fa6";

const STEPS = [
  { key: "waiting", label: "등록", Icon: FaClipboardCheck },
  { key: "matched", label: "기사매칭", Icon: FaUserCheck },
  { key: "pickup", label: "배송중", Icon: FaTruckFast },
  { key: "complete", label: "배송완료", Icon: FaCircleCheck },
];

const stepIndex = (status) => {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
};

export default function DeliveryStatusCards({ status = "waiting" }) {
  const active = stepIndex(status);

  return (
    <div className="dlvsStepper" aria-label="배송 상태 단계">
      {STEPS.map((step, i) => { // Get the whole step object
        const { key, label } = step;
        const StepIcon = step.Icon; // Extract Icon separately
        const isDone = i < active;
        const isActive = i === active;

        return (
          <div className="dlvsStep" key={key}>
            <div
              className={[
                "dlvsStepCircle",
                isDone ? "is-done" : "",
                isActive ? "is-active" : "",
              ].join(" ")}
              aria-hidden="true"
            >
              <StepIcon /> {/* Used as a component */}
            </div>

            <div
              className={[
                "dlvsStepLabel",
                isDone ? "is-done" : "",
                isActive ? "is-active" : "",
              ].join(" ")}
            >
              {label}
            </div>

            {i !== STEPS.length - 1 && (
              <div className="dlvsStepLine" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
