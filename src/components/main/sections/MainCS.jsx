/**
 * @file src/components/main/sections/MainCS.jsx
 * @description 고객센터 페이지
 * 260103 v1.0.5 update (비로그인 UI 개선: 오버레이 + 로그인 버튼 추가)
 */

import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MainCS.css";
import { LanguageContext } from "../../../context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { questionStoreThunk } from '../../../store/thunks/questions/questionStoreThunk.js';
import { questionImageUploadThunk } from '../../../store/thunks/questions/questionStoreThunk.js';
import { clearQuestionStore } from "../../../store/slices/questionStoreSlice.js";
import TrashBinIcon from '../../common/icons/TrashBinIcon.jsx';
import CustomAlertModal from '../../common/CustomAlertModal.jsx';


export default function MainCS() {
  const { t } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 로그인 상태 및 로딩 상태
  const { isLoggedIn } = useSelector((s) => s.auth);
  const { isLoading: loading } = useSelector((s) => s.questionStore);

  const [openItems, setOpenItems] = useState(new Set());
  const fileInputRef = useRef(null);

  const [inqTitle, setInqTitle] = useState("");
  const [inqContent, setInqContent] = useState("");
  const [inqFiles, setInqFiles] = useState(null);
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });

  // [추가] 모달 제어를 위한 State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  const FAQ_DATA = [
    { q: t("csFaq1Question"), a: t("csFaq1Answer") },
    { q: t("csFaq2Question"), a: t("csFaq2Answer") },
    { q: t("csFaq3Question"), a: t("csFaq3Answer") },
  ];

  // 파일 미리보기 로직
  const previews = useMemo(() => {
    if (!inqFiles) return [];
    return [{
      id: inqFiles.name,
      name: inqFiles.name,
      type: inqFiles.type,
      size: inqFiles.size,
      url: URL.createObjectURL(inqFiles),
    }];
  }, [inqFiles]);

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const onPickFiles = (e) => {
    if (!isLoggedIn) return;
    const pickedFile = e.target.files ? e.target.files[0] : null;
    setInqFiles(pickedFile);
    setFormStatus({ state: "idle", message: "" });
  };

  const removeFile = () => {
    setInqFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // [추가] 모달 닫기 핸들러
  const handleCloseModal = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  const onInquirySubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // 로그인 안 된 상태면 알림 또는 로그인 페이지 이동 처리
      alert(t('coverLoginRequired'));
      return;
    }

    // 기존 에러 메시지 초기화
    setFormStatus({ state: "idle", message: "" });

    // 이미지 업로드 로직
    try {
      let uploadedImagePath = null;

      if (inqFiles) {
        const resultUpload = await dispatch(questionImageUploadThunk(inqFiles)).unwrap();
        if (resultUpload?.data?.path) {
          uploadedImagePath = resultUpload.data.path;
        }
      }

      const payload = {
        title: inqTitle,
        content: inqContent,
        qnaImg: uploadedImagePath,
      };

      // 문의 등록 요청
      const result = await dispatch(questionStoreThunk(payload));

      // 결과 처리
      if (questionStoreThunk.fulfilled.match(result)) {
        // 성공 시 모달 띄우기 로직
        setInqTitle("");
        setInqContent("");
        setInqFiles(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        dispatch(clearQuestionStore());

        // 성공 모달 표시
        setAlertModal({
          isOpen: true,
          title: t("csInquirySuccessTitle") || "Success", 
          message: t("csInquirySuccessMsg") // "문의가 성공적으로 접수되었습니다."
        });
      }
      // 실패 시 (백엔드 유효성 검사 걸림)
      else {
        // thunk의 rejectWithValue로 넘어온 데이터 (백엔드 응답)
        const errorPayload = result.payload;
        const errorList = errorPayload?.data || []; // data 배열 추출
        
        // 기본 에러 메시지 설정
        let modalTitle = t("csInquiryErrorCheck") || "확인 필요";
        let modalMessage = t("csInquiryErrorMsg") || "처리 중 오류가 발생했습니다.";

        // 에러가 2개 이상인 경우 (제목, 내용 둘 다 문제)
        if (errorList.length >= 2) {
            modalTitle = t("csInquiryErrorInput");
            modalMessage = t("csInquiryInputErrorMsg");
        } 
        
        // 2. 에러가 1개인 경우 (기존 로직 유지)
        else if (errorList.length === 1) {
            const rawErrorMsg = errorList[0];
            
            if (typeof rawErrorMsg === 'string') {
                if (rawErrorMsg.startsWith('title:') || rawErrorMsg.includes('title')) {
                    modalTitle = t("csInquiryErrorTitle");
                    modalMessage = t("csInquiryTitleErrorMsg");
                } 
                else if (rawErrorMsg.startsWith('content:') || rawErrorMsg.includes('content')) {
                    modalTitle = t("csInquiryErrorContent");
                    modalMessage = t("csInquiryContentPlaceholder");
                } 
                else {
                    modalMessage = rawErrorMsg;
                }
            }
        } 
        
        // 3. data 배열이 없고 msg만 있는 경우 (일반 에러)
        else if (errorPayload?.msg) {
            modalMessage = errorPayload.msg;
        }

        // 실패 모달 표시 (성공 모달과 같은 컴포넌트 재사용)
        setAlertModal({
          isOpen: true,
          title: modalTitle,
          message: modalMessage
        });
        
        // 폼 하단 텍스트 에러도 동기화
        setFormStatus({ state: "error", message: modalMessage });
      }
    } catch (err) {
      console.error("Submission Error:", err);
      // 네트워크 에러 등
      setAlertModal({
        isOpen: true,
        title: "Error",
        message: t('csFileUploadError')
      });
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
            onClick={() => navigate('/mypage', { state: { activeTab: 'inquiry' } })}
          >
            {t("csViewMyInquiriesButton")}
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

        <div className={`maincs-card-box maincs-card-box--callback ${!isLoggedIn ? 'maincs-disabled' : ''}`}>
          {!isLoggedIn && (
            <div className="maincs-disabled-overlay">
              <span className="maincs-disabled-text">{t('coverLoginRequired')}</span>
              <button className="maincs-disabled-login-btn" onClick={() => navigate('/login')}>
                {t('headerLogin')}
              </button>
            </div>
          )}
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
                  onChange={(e) => setInqTitle(e.target.value)}
                  required
                  placeholder={t("csInquirySubjectPlaceholder")}
                  disabled={!isLoggedIn}
                />
              </label>
              <label className="maincs-form-label-group">
                <div className="maincs-field-label">{t("csInquiryContentLabel")}</div>
                <textarea
                  className="maincs-field-textarea"
                  name="content"
                  value={inqContent}
                  onChange={(e) => setInqContent(e.target.value)}
                  required
                  rows={4}
                  placeholder={t("csInquiryContentPlaceholder")}
                  disabled={!isLoggedIn}
                />
              </label>

              <div className="maincs-form-label-group">
                <div className="maincs-field-label">{t("csInquiryFileLabel")}</div>
                <div className="maincs-custom-file-input-wrapper">
                  <label htmlFor="custom-file-input" className="maincs-custom-file-button">
                    {t('csFileChooseBtn')}
                  </label>
                  <span className="maincs-custom-file-name">
                    {inqFiles ? inqFiles.name : t('csFileNoFileSelected')}
                  </span>
                  <input
                    ref={fileInputRef}
                    id="custom-file-input"
                    className="maincs-field-file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={onPickFiles}
                    disabled={!isLoggedIn} 
                  />
                </div>
              </div>

              {inqFiles && previews.length > 0 && (
                <div className="maincs-file-preview">
                  {previews.map((p) => (
                    <div className="maincs-file-preview-item" key={p.id}>
                      {p.type.startsWith("image/") ? (
                        <img className="maincs-file-thumb" src={p.url} alt={t('csFilePreviewAlt')} />
                      ) : (
                        <div className="maincs-file-nonimg">{t("csFilePlaceholder")}</div>
                      )}
                      <div className="maincs-file-meta">
                        <div className="maincs-file-name">{p.name}</div>
                        <div className="maincs-file-size">
                          {(p.size / 1024).toFixed(0)} {t('csFileSizeKB')}
                        </div>
                      </div>
                      <button type="button" className="maincs-preview-delete-btn" onClick={removeFile}>
                        <TrashBinIcon size={22} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="maincs-button maincs-button--primary"
                type="submit"
                disabled={loading || !isLoggedIn}
                style={{ height: 44, borderRadius: 12, margin: 5, opacity: (loading || !isLoggedIn) ? 0.7 : 1 }}
              >
                {loading ? t("csInquirySubmitLoading") : t("csInquirySubmit")}
              </button>

              {/* {questionError && (
                <div className="maincs-form-note-text" style={{ color: "crimson" }}>
                  {t('csInquiryErrorMsg')}
                </div>
              )} */}

              {/* {formStatus.state === 'error' && (
                <div className="maincs-form-note-text" style={{ color: "crimson" }}>
                  {formStatus.message}
                </div>
              )} */}
              {formStatus.state === 'success' && (
                <div className="maincs-form-note-text">
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* 모달 컴포넌트 렌더링 */}
      <CustomAlertModal 
        isOpen={alertModal.isOpen}
        onClose={handleCloseModal}
        title={alertModal.title}
        message={alertModal.message}
      />
  </div> 
  );
}