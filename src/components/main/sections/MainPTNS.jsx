/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init 
 */

import './MainPTNS.css';

export default function MainPTNS() {

  const onSubmit = (e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);

      if (!form.get("agree")) {
        alert("개인정보 수집·이용 동의가 필요해.");
        return;
      }

      alert("제휴 문의가 정상적으로 접수되었습니다. 검토 후 연락드리겠습니다.");
      e.currentTarget.reset();
    };

    return (
      <div className="mainptns-frame mainshow-section-frame" id="partners">
        <div className="mainshow-section-wrapper">
          <div className="mainptns-header-group">
            <div>
              <h2 className="mainptns-title-text">제휴 문의</h2>
              <p className="mainptns-desc-text">상호/주소/연락처 필수, 검증 후 접수 시간 기록.</p>
            </div>
          </div>

          {/* grid-2 -> mainptns-grid-2 */}
          <div className="mainptns-grid-2">
            
            {/* 1. 폼 영역 */}
            <form className="mainptns-card-box mainptns-card-box--form" onSubmit={onSubmit}>
              <h3 className="mainptns-card-title-text">제휴 문의 폼</h3>

              <div className="mainptns-form-fields-group">
                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">상호명 (필수)</div>
                  <input className="mainptns-field-input" name="storeName" required placeholder="사업자명 또는 매장명" />
                </label>

                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">주소 (필수)</div>
                  <input className="mainptns-field-input" name="address" required placeholder="도로명 주소" />
                </label>

                <div className="mainptns-input-grid-2">
                  <label className="mainptns-form-label-group">
                    <div className="mainptns-field-label">전화번호 (필수)</div>
                    <input
                      className="mainptns-field-input"
                      name="phone"
                      required
                      placeholder="010-0000-0000"
                      pattern="^[0-9\\-+() ]{7,20}$"
                    />
                  </label>
                  <label className="mainptns-form-label-group">
                    <div className="mainptns-field-label">이메일 (필수)</div>
                    <input className="mainptns-field-input" name="email" type="email" required placeholder="name@email.com" />
                  </label>
                </div>

                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">제휴 목적 / 문의 내용 (선택)</div>
                  <textarea
                    name="message"
                    placeholder="제휴를 원하는 이유 및 추가 문의 사항"
                    className="mainptns-form-textarea"
                  />
                </label>

                <label className="mainptns-agreement-label">
                  <input type="checkbox" name="agree" />
                  <span className="mainptns-agreement-text">
                    개인정보 수집·이용에 동의합니다. (필수)
                  </span>
                </label>

                <button className="mainptns-submit-button mainptns-submit-button--primary" type="submit">
                  제휴 문의 제출
                </button>
              </div>
            </form>

            {/* 2. 안내 영역 */}
            <div className="mainptns-card-box mainptns-card-box--guide">
              <h3 className="mainptns-card-title-text">제휴 안내</h3>

              <div className="mainptns-note-list-group">
                <div className="mainptns-note-item">
                  <div className="mainptns-note-title-text">접수 후 프로세스</div>
                  <div className="mainptns-note-desc-text">접수됨 → 검토 중 → 연락 완료/보류(추후 Admin 확장)</div>
                </div>
                <div className="mainptns-note-item">
                  <div className="mainptns-note-title-text">준비 정보</div>
                  <div className="mainptns-note-desc-text">상호/주소/연락처는 필수로 제출되어야 해요.</div>
                </div>
                <div className="mainptns-note-item">
                  <div className="mainptns-note-title-text">개인정보 동의</div>
                  <div className="mainptns-note-desc-text">동의 체크가 없으면 제출이 불가해요.</div>
                </div>
              </div>

              <div className="mainptns-message-box">
                <div className="mainptns-message-title-text">문의 접수 메시지</div>
                <div className="mainptns-message-desc-text">
                  “제휴 문의가 정상적으로 접수되었습니다. 검토 후 연락드리겠습니다.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}