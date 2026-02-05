/**
 * @file src/components/main/sections/MainCS.jsx
 * @description 고객센터 페이지
 * 251230 v1.0.0 sara init
 * 260103 v2.0.0 sara update (비로그인 UI 개선: 오버레이 + 로그인 버튼 추가)
 * 260111 v3.0.0 sara update (FAQ 화살표 아이콘 추가 및 레이아웃 수정)
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
import ArrowIcon from '../../common/icons/ArrowIcon.jsx';
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

  const goMyInquiry = () => {
  if (!isLoggedIn) {
    setAlertModal({
      isOpen: true,
      title: t("alertErrorTitle"),
      message: t("coverLoginRequired"),
      next: () => navigate("/login", { state: { activeTab: "inquiry" } }),
    });
    return;
  }
  navigate("/mypage", { state: { activeTab: "inquiry" } });
};

  // [추가] 모달 제어를 위한 State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    next: null
  });

  const FAQ_DATA = [
    { q: t("csFaq1Question"), a: t("csFaq1Answer") },
    { q: t("csFaq2Question"), a: t("csFaq2Answer") },
    { q: t("csFaq3Question"), a: t("csFaq3Answer") },
    { q: t("csFaq4Question"), a: t("csFaq4Answer") },
    { q: t("csFaq5Question"), a: t("csFaq5Answer") },
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
  setAlertModal((prev) => {
    const nextFn = prev.next;
    // 모달 먼저 닫고
    setTimeout(() => {
      if (typeof nextFn === "function") nextFn();
    }, 0);
    return { ...prev, isOpen: false, next: null };
  });
};

  const onInquirySubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // 로그인 안 된 상태면 알림 또는 로그인 페이지 이동 처리
      alert(t('coverLoginRequired'));
      return;
    }

    // 프론트엔드 유효성 검사 (빈 값 체크) 로직 추가
    // trim()을 사용하여 공백만 입력된 경우도 체크
    const isTitleEmpty = !inqTitle.trim();
    const isContentEmpty = !inqContent.trim();

    if (isTitleEmpty || isContentEmpty) {
      let modalTitle = t("csInquiryErrorCheck") || "입력 확인";
      let modalMessage = "";

      if (isTitleEmpty && isContentEmpty) {
        modalTitle = t("csInquiryErrorInput") || "입력 오류";
        modalMessage = t("csInquiryInputErrorMsg") || "제목과 내용을 입력해주세요.";
      } else if (isTitleEmpty) {
        modalTitle = t("csInquiryErrorTitle") || "제목 오류";
        modalMessage = t("csInquiryTitleErrorMsg") || "제목을 입력해주세요.";
      } else {
        modalTitle = t("csInquiryErrorContent") || "내용 오류";
        modalMessage = t("csInquiryContentPlaceholder") || "내용을 입력해주세요.";
      }

      setAlertModal({
        isOpen: true,
        title: modalTitle,
        message: modalMessage
      });
      
      // 유효성 검사에 걸리면 API 호출을 하지 않고 함수를 종료
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
      // 백엔드 유효성 검사 실패 시 (프론트 검사를 통과했더라도 서버에서 거절된 경우)
      else {
        const errorPayload = result.payload;
        const errorList = Array.isArray(errorPayload?.data) ? errorPayload.data : [];
        
        let modalTitle = t("csInquiryErrorCheck");
        let modalMessage = t("csInquiryErrorMsg");

        const titleError = errorList.find(e => e.param === 'title');
        const contentError = errorList.find(e => e.param === 'content');

        if (titleError && !contentError) {
          // 제목 단독 에러
          modalTitle = t("csInquiryErrorTitle");
          modalMessage = t("csInquiryTitleErrorMsg");
        } else if (!titleError && contentError) {
          // 내용 단독 에러
          modalTitle = t("csInquiryErrorContent");
          modalMessage = t("csInquiryContentPlaceholder");
        } else if (titleError && contentError) {
          // 제목, 내용 동시 에러
          modalTitle = t("csInquiryErrorInput");
          modalMessage = t("csInquiryInputErrorMsg");
        } else if (errorPayload?.msg) {
          // 그 외 백엔드 에러
          if (errorPayload.msg === "요청 파라미터에 이상이 있습니다.") {
            modalMessage = t("genericBadRequestError");
          } else if (errorPayload.msg === "서비스 제공 상태가 원활하지 않습니다.") {
            modalMessage = t("genericSystemError");
          } else {
            modalMessage = errorPayload.msg; // 알 수 없는 에러는 그대로 표시
          }
        }

        // 실패 모달 표시
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
          onClick={goMyInquiry}
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
                  {/* 화살표 아이콘 영역 추가 */}
                  <div className="maincs-faq-icon-wrapper">
                    <ArrowIcon isOpen={openItems.has(idx)} size={20} />
                  </div>
                  <span className="maincs-faq-q-text">{x.q}</span>
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

              {formStatus.state === 'success' && (
                <div className="maincs-form-note-text">
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
        <CustomAlertModal 
          isOpen={alertModal.isOpen}
          onClose={handleCloseModal}
          title={alertModal.title}
          message={alertModal.message}
        />
  </div> 
  );
}