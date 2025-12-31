/**
 * @file src/components/main/sections/MainCS.jsx
 * @description 고객센터 페이지
 * 251216 v1.0.0 sara init
 * 251224 v1.0.1 update (챗봇 제거 → 문의 접수 폼(title,context,img))
 * 251225 v1.0.2 update (문의 접수 폼(email 칸 off/on 권한에 따른 작성 여부 + FAQ)
 */

import { useState, useContext, useMemo, useEffect, useRef } from "react";
import "./MainCS.css";
import { LanguageContext } from "../../../context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { questionStoreThunk } from '../../../store/thunks/questionStoreThunk.js';
import { questionImgStoreThunk } from '../../../store/thunks/questionImgStoreThunk.js';
import { clearQuestionStore } from "../../../store/slices/questionStoreSlice.js";
import TrashBinBoldShort from '../../common/icons/TrashBinBoldShort.jsx';

export default function MainCS() {
  const { t } = useContext(LanguageContext);
  const [openItems, setOpenItems] = useState(new Set());
  const dispatch = useDispatch();
  const { isLoading: loading, error: questionError } = useSelector((s) => s.questionStore);
  const fileInputRef = useRef(null);

  const [inqTitle, setInqTitle] = useState("");
  const [inqContent, setInqContent] = useState("");
  const [inqFiles, setInqFiles] = useState([]);
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });

  const FAQ_DATA = [
    { q: t("csFaq1Question"), a: t("csFaq1Answer") },
    { q: t("csFaq2Question"), a: t("csFaq2Answer") },
    { q: t("csFaq3Question"), a: t("csFaq3Answer") },
  ];

  const onEmail = () => {
    window.location.href = `mailto:support@brand.com?subject=${t("csInquirySubject")}`;
  };

  // 파일 미리보기 로직
  const previews = useMemo(() => {
    return inqFiles.map((f, index) => ({
      id: `${f.name}-${index}`,
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
    setFormStatus({ state: "idle", message: "" });
  };

  const removeFile = (indexToRemove) => {
    setInqFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * 문의 접수 제출 핸들러
   * 1. 첨부된 파일들을 순차적으로 업로드하여 서버 경로(path)를 획득합니다.
   * 2. 획득한 경로 배열과 제목, 내용을 합쳐 JSON으로 최종 제출합니다.
   */
  const onInquirySubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ state: "idle", message: "" });

    try {
      // 1. 파일 업로드 처리 (Multer) - 각 파일의 path를 배열로 수집
      const uploadedImagePaths = [];

      if (inqFiles.length > 0) {
        for (const file of inqFiles) {
          // postLicenseImageUploadThunk와 동일한 로직으로 개별 파일 업로드
          const resultUpload = await dispatch(questionImgStoreThunk(file)).unwrap();
          if (resultUpload?.data?.path) {
            uploadedImagePaths.push(resultUpload.data.path);
          }
        }
      }

      // 2. 최종 전송할 JSON 데이터(Payload) 구성
      const payload = {
        subject: inqTitle,
        message: inqContent,
        images: uploadedImagePaths, // 업로드 완료된 이미지 경로 리스트
      };

      // 3. API 전송 (JSON 요청)
      const result = await dispatch(questionStoreThunk(payload));

      if (questionStoreThunk.fulfilled.match(result)) {
        setFormStatus({ state: "success", message: t("csInquirySuccessMsg") });
        // 폼 초기화
        setInqTitle("");
        setInqContent("");
        setInqFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        dispatch(clearQuestionStore());
      } else {
        setFormStatus({ state: "error", message: t("csInquiryErrorMsg") || "Submit Failed" });
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setFormStatus({ state: "error", message: t('csFileUploadError') });
    }
  };

  return (
    <div className="maincs-frame mainshow-section-wrapper">
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
        <div className="maincs-card-box maincs-card-box--faq">
          <h3 className="maincs-card-title-text">{t("csFaqTitle")}</h3>

          <div className="maincs-faq-list-group">
            {FAQ_DATA.map((x, idx) => (
              <div key={idx} className="maincs-faq-item">
                <button
                  type="button"
                  onClick={() => {
                    const newOpenItems = new Set(openItems);
                    if (newOpenItems.has(idx)) {
                      newOpenItems.delete(idx);
                    } else {
                      newOpenItems.add(idx);
                    }
                    setOpenItems(newOpenItems);
                  }}
                  className="maincs-faq-button"
                >
                  {x.q}
                </button>

                {openItems.has(idx) && <div className="maincs-faq-body-text">{x.a}</div>}
              </div>
            ))}
          </div>

          <div className="maincs-info-box">
            <div className="maincs-info-title-text">{t("csOperatingHoursTitle")}</div>
            <div className="maincs-info-desc-text">{t("csOperatingHoursTime")}</div>
            <div className="maincs-info-desc-text">{t("csOperatingHoursNote")}</div>
          </div>
        </div>

        <div className="maincs-card-box maincs-card-box--callback">
          <h3 className="maincs-card-title-text">{t("csInquiryTitle")}</h3>
          <div className="maincs-callback-area">
            <p className="maincs-callback-desc-text">{t("csInquiryDesc")}</p>
            <form onSubmit={onInquirySubmit} className="maincs-callback-form">
              <label className="maincs-form-label-group">
                <div className="maincs-field-label">{t("csInquirySubjectLabel")}</div>
                <input
                  className="maincs-field-input"
                  name="title"
                  value={inqTitle}
                  onChange={(e) => {
                    setInqTitle(e.target.value);
                    setFormStatus({ state: "idle", message: "" });
                  }}
                  required
                  placeholder={t("csInquirySubjectPlaceholder")}
                />
              </label>
              <label className="maincs-form-label-group">
                <div className="maincs-field-label">{t("csInquiryContentLabel")}</div>
                <textarea
                  className="maincs-field-textarea"
                  name="content"
                  value={inqContent}
                  onChange={(e) => {
                    setInqContent(e.target.value);
                    setFormStatus({ state: "idle", message: "" });
                    if (questionError) dispatch(clearQuestionStore()); // 입력 시 Redux 에러도 초기화
                  }}
                  required
                  rows={4}
                  placeholder={t("csInquiryContentPlaceholder")}
                />
              </label>

              <div className="maincs-form-label-group">
                <div className="maincs-field-label">{t("csInquiryFileLabel")}</div>
                <div className="maincs-custom-file-input-wrapper">
                  <label htmlFor="custom-file-input" className="maincs-custom-file-button">
                    {t('csFileChooseBtn')}
                  </label>
                  <span className="maincs-custom-file-name">
                    {inqFiles.length > 0
                      ? inqFiles.map(f => f.name).join(', ')
                      : t('csFileNoFileSelected')}
                  </span>
                  <input
                    ref={fileInputRef}
                    id="custom-file-input"
                    className="maincs-field-file"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={onPickFiles}
                  />
                </div>
              </div>

              {previews.length > 0 && (
                <div className="maincs-file-preview">
                  {previews.map((p, index) => (
                    <div className="maincs-file-preview-item" key={p.id}>
                      {p.type.startsWith("image/") ? (
                        <img className="maincs-file-thumb" src={p.url} alt={p.name} />
                      ) : (
                        <div className="maincs-file-nonimg">{t("csFilePlaceholder")}</div>
                      )}

                      <div className="maincs-file-meta">
                        <div className="maincs-file-name">{p.name}</div>
                        <div className="maincs-file-size">
                          {(p.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <button type="button" className="maincs-preview-delete-btn" onClick={() => removeFile(index)}>
                        <TrashBinBoldShort size={22} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="maincs-button maincs-button--primary"
                type="submit"
                disabled={loading}
                style={{ height: 44, borderRadius: 12, margin: 5, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? t("csInquirySubmitLoading") : t("csInquirySubmit")}
              </button>

              {formStatus.state === 'error' && (
                <div className="maincs-form-note-text" style={{ color: "crimson" }}>
                  {formStatus.message}
                </div>
              )}

              {formStatus.state === 'success' && (
                <div className="maincs-form-note-text">
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
  </div> 
  );
}