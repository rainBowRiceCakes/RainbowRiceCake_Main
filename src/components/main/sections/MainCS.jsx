/**
 * @file src/components/main/sections/MainCS.jsx
 * @description 고객센터 페이지 (CustomerCenter.jsx 내용 통합)
 * 251216 v1.0.0 sara init 
 */

import { useState } from "react";
import './MainCS.css';

const FAQ = [
  { q: "배송은 얼마나 걸려요?", a: "지점/거리/기사 배정 상황에 따라 달라요. 배송 현황에서 상태를 확인해줘." },
  { q: "보관 불가 물품이 있나요?", a: "현금/귀중품, 위험물, 파손 위험 물품, 음식물(부패 가능)은 불가예요." },
  { q: "분실/파손은 어떻게 처리돼요?", a: "정책 기준에 따라 접수 후 처리돼요. 필요 시 Email Callback으로 접수 가능." },
];

export default function MainCS() {
  const [open, setOpen] = useState(-1); // FAQ 열림 상태

  const onEmail = () => {
    window.location.href = "mailto:support@brand.com?subject=문의드립니다";
  };

  const onCallback = (e) => {
    e.preventDefault();
    alert("Email Callback 접수 완료(더미)");
    e.currentTarget.reset();
  };
  
  // NOTE: 제공해주신 MainCS.jsx는 전화상담/1:1문의 폼 구조였으나, CustomerCenter.jsx는 FAQ/챗봇 구조임.
  // 고객센터 섹션의 ID는 NAV에 따라 "cs"를 사용하고, 구조는 CustomerCenter.jsx의 내용을 최대한 따르되,
  // MainCS.css의 클래스명 규칙을 사용합니다. 
  
  return (
    <div className="maincs-frame mainshow-section-frame" id="cs">
        <div className="mainshow-section-wrapper">
          <div className="maincs-header-group">
            <div>
              <h2 className="maincs-title-text">고객센터</h2>
              <p className="maincs-subtitle-text">FAQ → 챗봇 → Email 문의 순으로 안내해요.</p>
            </div>

            <div className="maincs-actions-group">
              <button className="maincs-button maincs-button--primary" type="button" onClick={onEmail}>
                Email 문의하기
              </button>
            </div>
          </div>

          {/* grid-2 -> maincs-grid-2 */}
          <div className="maincs-grid-2">
            
            {/* 1. FAQ & 운영 시간 */}
            <div className="maincs-card-box maincs-card-box--faq">
              <h3 className="maincs-card-title-text">자주 묻는 질문 (FAQ)</h3>

              <div className="maincs-faq-list-group">
                {FAQ.map((x, idx) => (
                  <div key={idx} className="maincs-faq-item">
                    <button
                      type="button"
                      onClick={() => setOpen(idx === open ? -1 : idx)}
                      className="maincs-faq-button"
                    >
                      {x.q}
                    </button>

                    {open === idx && (
                      <div className="maincs-faq-body-text">
                        {x.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="maincs-info-box">
                <div className="maincs-info-title-text">운영 시간</div>
                <div className="maincs-info-desc-text">09:00 – 18:00 (KST)</div>
                <div className="maincs-info-desc-text">
                  운영 시간 외에도 Email 문의를 남겨줘.
                </div>
              </div>
            </div>

            {/* 2. 챗봇 & Email Callback */}
            <div className="maincs-card-box maincs-card-box--callback">
              <h3 className="maincs-card-title-text">챗봇 상담</h3>
              <p className="maincs-card-desc-text">
                FAQ 기반 자동응답 + 선택형 질문 제공. 해결 실패 시 Email Callback으로 전환.
              </p>

              <div className="maincs-chat-actions-group">
                <button className="maincs-button maincs-button--primary" type="button" onClick={() => alert("챗봇 이동(더미)")}>
                  챗봇 시작하기
                </button>
                <button className="maincs-button" type="button" onClick={onEmail}>
                  Email 문의로 전환
                </button>
              </div>

              <div className="maincs-callback-area">
                <h4 className="maincs-callback-title-text">Email Callback</h4>
                <p className="maincs-callback-desc-text">
                  상담 불가 상황에서 이메일을 남기면 다음 영업일 연락 안내를 제공해요.
                </p>

                <form onSubmit={onCallback} className="maincs-callback-form">
                  <label className="maincs-form-label-group">
                    <div className="maincs-field-label">이메일(필수)</div>
                    <input className="maincs-field-input" type="email" name="email" required placeholder="name@email.com" />
                  </label>

                  <label className="maincs-form-label-group">
                    <div className="maincs-field-label">문의 요약(선택)</div>
                    <input className="maincs-field-input" name="summary" placeholder="예: 배송 완료 사진이 안 보여요" />
                  </label>

                  <button className="maincs-button maincs-button--primary" type="submit" style={{ height: 44, borderRadius: 12 }}>
                    접수하기
                  </button>

                  <div className="maincs-form-note-text">
                    접수 완료: “문의가 접수되었습니다. 곧 연락드리겠습니다.”
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}