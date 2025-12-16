/**
 * @file src/components/main/sections/MainDLVS.jsx
 * @description 배송 현황 페이지
 * 251216 v1.0.0 sara init 
 */

import { useState } from "react";
import './MainDLVS.css';

export default function MainDLVS() {
  const [result, setResult] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = (form.get("code") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();

    if (!code || !email) return;

    // 더미: code === none → 알림 + 초기화
    if (code.toLowerCase() === "none") {
      alert("정보가 없습니다.");
      e.currentTarget.reset();
      setResult(null);
      return;
    }

    setResult({
      code,
      email,
      step: "DELIVERING",
      timeline: [
        { t: "접수 완료", d: "지점에서 접수되었습니다." },
        { t: "기사 배정", d: "기사 배정이 완료되었습니다." },
        { t: "배송 중", d: "현재 목적지로 이동 중입니다." },
      ],
    });
  };

  // section -> div, class/id update
  return (
    <div className="maindlvs-frame mainshow-section-frame" id="deliverys">
      <div className="mainshow-section-wrapper">
        
        {/* Header Group (이전 section__head) */}
        <div className="maindlvs-header-group">
          <div>
            <h2 className="maindlvs-title-text">배송 현황</h2>
            <p className="maindlvs-desc-text">
              배송코드/Email 입력 → DB 조회 → 결과 출력. 없으면 알림 후 초기화.
            </p>
          </div>
        </div>

        <div className="maindlvs-grid-2">
          
          {/* 배송 조회 폼 (이전 card + form) */}
          <form className="maindlvs-card-box" onSubmit={onSubmit}>
            <h3 className="maindlvs-card-title-text">배송 조회</h3>

            <div className="maindlvs-form-fields-group">
              <label className="maindlvs-form-label-group">
                <div className="maindlvs-field-label">배송 코드</div>
                <input className="maindlvs-field-input" name="code" placeholder="예: A1B2C3" required />
              </label>

              <label className="maindlvs-form-label-group">
                <div className="maindlvs-field-label">Email</div>
                <input className="maindlvs-field-input" name="email" type="email" placeholder="name@email.com" required />
              </label>

              <button 
                className="maindlvs-submit-button maindlvs-submit-button--primary" 
                type="submit" 
              >
                조회하기
              </button>

              <div className="maindlvs-note-text">
                테스트: 배송 코드에 <b>none</b> 입력하면 “정보가 없습니다” 플로우 확인 가능
              </div>
            </div>
          </form>

          {/* 조회 결과 (이전 card) */}
          <div className="maindlvs-card-box">
            <h3 className="maindlvs-card-title-text">조회 결과</h3>

            {!result ? (
              <div className="maindlvs-result-placeholder">
                조회하면 상태/타임라인과 완료 시 사진 증빙을 보여줘.
              </div>
            ) : (
              <div className="maindlvs-result-content">
                <div className="maindlvs-result-meta-text">배송 코드: {result.code}</div>
                <div className="maindlvs-result-meta-text">Email: {result.email}</div>

                <div className="maindlvs-status-box">
                  <div className="maindlvs-status-title-text">현재 상태: {result.step}</div>
                  <div className="maindlvs-status-desc-text">
                    READY → ASSIGNED → PICKED_UP → DELIVERING → DELIVERED
                  </div>
                </div>

                <div className="maindlvs-timeline-group">
                  <div className="maindlvs-timeline-title-text">타임라인</div>
                  <div className="maindlvs-timeline-list">
                    {result.timeline.map((x, idx) => (
                      <div key={idx} className="maindlvs-timeline-item">
                        <div className="maindlvs-timeline-step-text">{x.t}</div>
                        <div className="maindlvs-timeline-desc-text">{x.d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="maindlvs-proof-group">
                  <div className="maindlvs-proof-title-text">사진 증빙(완료 시)</div>
                  <div className="maindlvs-proof-box">Proof Photo Placeholder</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}