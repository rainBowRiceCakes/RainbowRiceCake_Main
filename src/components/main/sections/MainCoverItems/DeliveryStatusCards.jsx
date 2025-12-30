/**
 * @file src/components/main/sections/MainCoverItems/DeliveryStatusCards.jsx
 * @description 배송 상태 4단계 스텝퍼 (waiting/matched/pickup/complete)
 * 251224 v1.0.0 sara init
 */

import { useTranslation } from "../../../../context/LanguageContext";
import "./DeliveryStatusCards.css";
import { FaClipboardCheck, FaUserCheck, FaTruckFast, FaCircleCheck } from "react-icons/fa6";

const STEPS_CONFIG = [
  { key: "req", labelKey: "deliveryStepRegister", Icon: FaClipboardCheck },
  { key: "match", labelKey: "deliveryStepMatching", Icon: FaUserCheck },
  { key: "pick", labelKey: "deliveryStepInProgress", Icon: FaTruckFast },
  { key: "com", labelKey: "deliveryStepCompleted", Icon: FaCircleCheck },
];

export default function DeliveryStatusCards({ status = "req" }) {
  const { t } = useTranslation();

  const STEPS = STEPS_CONFIG.map(step => ({
    ...step,
    label: t(step.labelKey)
  }));

  const stepIndex = (status) => {
    const idx = STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const active = stepIndex(status);

  return (
    <div className="dlvs-stepper" aria-label={t('deliveryStatusAriaLabel')}>
      {STEPS.map((step, i) => {
        const StepIcon = step.Icon;
        const isDone = i < active;
        const isActive = i === active;

        return (
          <div className="dlvs-step" key={step.key}>
            <div
              className={[
                "dlvs-circle",
                isDone ? "is-done" : "",
                isActive ? "is-active" : "",
              ].join(" ")}
              aria-hidden="true"
            >
              <StepIcon />
            </div>

            <div
              className={[
                "dlvs-label",
                isDone ? "is-done" : "",
                isActive ? "is-active" : "",
              ].join(" ")}
            >
              {step.label}
            </div>

            {i !== STEPS.length - 1 && <div className="dlvs-line" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}