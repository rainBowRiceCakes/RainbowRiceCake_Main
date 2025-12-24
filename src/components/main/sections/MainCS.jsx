/**
 * @file src/components/main/sections/MainCS.jsx
 * @description 고객센터 페이지
 * 251216 v1.0.0 sara init
 * 251224 v1.0.1 update (챗봇 제거 → 문의 접수 폼(title,context,img))
 */


import { useState, useContext, useMemo, useEffect } from "react";
import "./MainCS.css";
import { LanguageContext } from "../../../context/LanguageContext";

export default function MainCS() {
  const { t } = useContext(LanguageContext);
  const [open, setOpen] = useState(-1); // FAQ 열림 상태

  // 문의 폼 상태
  const [inqTitle, setInqTitle] = useState("");
  const [inqContent, setInqContent] = useState("");
  const [inqFiles, setInqFiles] = useState([]); // File[]
  const [submitted, setSubmitted] = useState(false);

  const FAQ_DATA = [
    { q: t("csFaq1Question"), a: t("csFaq1Answer") },
    { q: t("csFaq2Question"), a: t("csFaq2Answer") },
    { q: t("csFaq3Question"), a: t("csFaq3Answer") },
  ];

  const onEmail = () => {
    window.location.href = `mailto:support@brand.com?subject=${t("csInquirySubject")}`;
  };

  // 파일 미리보기(URL)
  const previews = useMemo(() => {
    return inqFiles.map((f) => ({
      name: f.name,
      type: f.type,
      size: f.size,
      url: URL.createObjectURL(f),
    }));
  }, [inqFiles]);

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    setInqFiles(picked);
    setSubmitted(false);
  };

  const onInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);

    // ✅ 멀터 연동 시(추후):
    // const fd = new FormData();
    // fd.append("title", inqTitle);
    // fd.append("content", inqContent);
    // inqFiles.forEach((f) => fd.append("files", f));
    // await api.post("/api/inquiries", fd);

    setSubmitted(true);
    e.currentTarget.reset();
    setInqTitle("");
    setInqContent("");
    setInqFiles([]);
  };

  return (
    <div className="maincs-frame mainshow-section-frame" id="cs">
      <div className="mainshow-section-wrapper">
        <div className="maincs-header-group">
          <div>
            <h2 className="maincs-title-text">{t("csTitle")}</h2>
            <p className="maincs-subtitle-text">{t("csDesc")}</p>
          </div>

          <div className="maincs-actions-group">
            <button
              className="maincs-button maincs-button--primary"
              type="button"
              onClick={onEmail}
            >
              {t("csEmailInquiryButton")}
            </button>
          </div>
        </div>

        <div className="maincs-grid-2">
          {/* LEFT: FAQ */}
          <div className="maincs-card-box maincs-card-box--faq">
            <h3 className="maincs-card-title-text">{t("csFaqTitle")}</h3>

            <div className="maincs-faq-list-group">
              {FAQ_DATA.map((x, idx) => (
                <div key={idx} className="maincs-faq-item">
                  <button
                    type="button"
                    onClick={() => setOpen(idx === open ? -1 : idx)}
                    className="maincs-faq-button"
                  >
                    {x.q}
                  </button>

                  {open === idx && <div className="maincs-faq-body-text">{x.a}</div>}
                </div>
              ))}
            </div>

            <div className="maincs-info-box">
              <div className="maincs-info-title-text">{t("csOperatingHoursTitle")}</div>
              <div className="maincs-info-desc-text">{t("csOperatingHoursTime")}</div>
              <div className="maincs-info-desc-text">{t("csOperatingHoursNote")}</div>
            </div>
          </div>

          {/* RIGHT: 문의 접수 (기존 챗봇 영역 교체) */}
          <div className="maincs-card-box maincs-card-box--callback">
            <h3 className="maincs-card-title-text">문의</h3>
            <div className="maincs-callback-area">
              <p className="maincs-callback-desc-text">
                운영시간 외에도 문의를 남기면 확인 후 순차적으로 안내드려요.
              </p>
              <br></br>
              <form onSubmit={onInquirySubmit} className="maincs-callback-form">
                {/* 제목 */}
                <label className="maincs-form-label-group">
                  <div className="maincs-field-label">제목</div>
                  <input
                    className="maincs-field-input"
                    name="title"
                    value={inqTitle}
                    onChange={(e) => setInqTitle(e.target.value)}
                    required
                    placeholder="예: 배송 완료 사진이 안 보여요"
                  />
                </label>
                {/* 내용 */}
                <label className="maincs-form-label-group">
                  <div className="maincs-field-label">내용</div>
                  <textarea
                    className="maincs-field-textarea"
                    name="content"
                    value={inqContent}
                    onChange={(e) => setInqContent(e.target.value)}
                    required
                    rows={4}
                    placeholder="상황을 간단히 적어주세요. (주문번호/지점/시간대 등)"
                  />
                </label>

                {/* 첨부파일 */}
                <label className="maincs-form-label-group">
                  <div className="maincs-field-label">첨부파일 (선택)</div>
                  <input
                    className="maincs-field-file"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={onPickFiles}
                  />
                </label>

                {/* 첨부파일 미리보기(간단) */}
                {previews.length > 0 && (
                  <div className="maincs-file-preview">
                    {previews.map((p) => (
                      <div className="maincs-file-preview-item" key={p.url}>
                        {p.type.startsWith("image/") ? (
                          <img className="maincs-file-thumb" src={p.url} alt={p.name} />
                        ) : (
                          <div className="maincs-file-nonimg">FILE</div>
                        )}

                        <div className="maincs-file-meta">
                          <div className="maincs-file-name">{p.name}</div>
                          <div className="maincs-file-size">
                            {(p.size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="maincs-button maincs-button--primary"
                  type="submit"
                  style={{ height: 44, borderRadius: 12, margin: 5}}
                >
                  접수하기
                </button>

                {submitted && (
                  <div className="maincs-form-note-text">
                    문의가 접수되었습니다. 확인 후 연락드리겠습니다.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}