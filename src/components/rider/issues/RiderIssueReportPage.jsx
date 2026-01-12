// components/rider/issues/RiderIssueReportPage.jsx

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { questionImageUploadThunk, questionStoreThunk } from '../../../store/thunks/questions/questionStoreThunk.js';
import "./RiderIssueReportPage.css";

// 1. 유효성 검사 상수 정의
const VALIDATION = {
  TITLE: { MIN: 2, MAX: 200 },
  CONTENT: { MIN: 10, MAX: 5000 },
  ALLOWED_EXTS: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  MAX_PHOTOS: 1
};

export default function RiderIssueReportPage({ reporterTypeFixed = "DLV" }) { // 기본값 DLV(기사) 설정
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const user = useSelector((state) => state.auth?.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ title: null, content: null }); // 에러 상태 추가
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  // 2. 실시간 검증 로직
  const validateField = (name, value) => {
    const trimmed = value.trim();
    if (name === 'title') {
      if (!trimmed) return "제목은 필수입니다.";
      if (trimmed.length < VALIDATION.TITLE.MIN) return `최소 ${VALIDATION.TITLE.MIN}자 이상 입력해주세요.`;
      if (trimmed.length > VALIDATION.TITLE.MAX) return `최대 ${VALIDATION.TITLE.MAX}자까지 가능합니다.`;
      if (/\s{2,}/.test(value)) return "연속된 공백은 허용되지 않습니다.";
    }
    if (name === 'content') {
      if (!trimmed) return "내용은 필수입니다.";
      if (trimmed.length < VALIDATION.CONTENT.MIN) return `상황 설명을 위해 10자 이상 입력해주세요.`;
      if (trimmed.length > VALIDATION.CONTENT.MAX) return `최대 ${VALIDATION.CONTENT.MAX}자까지 가능합니다.`;
      if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(value)) return "허용되지 않는 문자가 포함되어 있습니다.";
    }
    return null;
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setErrors(prev => ({ ...prev, title: validateField('title', val) }));
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    setErrors(prev => ({ ...prev, content: validateField('content', val) }));
  };

  const handleFilesSelected = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    const file = fileList[0];
    const ext = file.name.split('.').pop().toLowerCase();

    // 확장자 및 파일명 보안 검증 (백엔드 조건 반영)
    if (!VALIDATION.ALLOWED_EXTS.includes(ext)) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (/[<>:"|?*\x00-\x1f]/.test(file.name)) {
      alert("파일명에 특수문자를 제거해주세요.");
      return;
    }

    const mapped = {
      id: `${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
    };

    setPhotos([mapped]); // MAX_PHOTOS가 1이므로 교체 방식
    e.target.value = "";
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return [];
    });
  };

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  // 3. 버튼 활성화 조건 (에러가 없고 글자수 충족 시)
  const canSubmit = !errors.title && !errors.content &&
    title.trim().length >= VALIDATION.TITLE.MIN &&
    content.trim().length >= VALIDATION.CONTENT.MIN;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting || !canSubmit) return;

    setIsSubmitting(true);
    // 연속 공백 자동 치환 (백엔드 custom val 정책 대응)
    const cleanTitle = title.trim().replace(/\s{2,}/g, ' ');
    const cleanContent = content.trim();

    try {
      const requestData = {
        orderId,
        title: cleanTitle,
        content: cleanContent,
        reporterType: reporterTypeFixed || "DLV"
      };

      if (photos.length > 0) {
        const uploadResult = await dispatch(questionImageUploadThunk(photos[0].file)).unwrap();
        if (uploadResult?.data?.path) requestData.qnaImg = uploadResult.data.path;
      }

      await dispatch(questionStoreThunk(requestData)).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      alert(error.message || "신고 접수에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rip-form-container">
      <div className="rip-wrap">
        <div className="rip-main">
          {/* 제목 필드 */}
          <div className="rip-field">
            <p className="rip-label">제목 <span className="req">*</span></p>
            <input
              className={`rip-input ${errors.title ? 'is-invalid' : ''}`}
              placeholder="예: 픽업지 주소가 다릅니다."
              value={title}
              onChange={handleTitleChange}
            />
            <div className="rip-field-info">
              {errors.title && <span className="rip-err-text">{errors.title}</span>}
              <span className="rip-char-count">{title.length}/{VALIDATION.TITLE.MAX}</span>
            </div>
          </div>

          {/* 내용 필드 */}
          <div className="rip-field">
            <p className="rip-label">내용 <span className="req">*</span></p>
            <textarea
              className={`rip-textarea ${errors.content ? 'is-invalid' : ''}`}
              placeholder="구체적인 상황을 입력해주세요 (10자 이상)"
              value={content}
              onChange={handleContentChange}
            />
            <div className="rip-field-info">
              {errors.content && <span className="rip-err-text">{errors.content}</span>}
              <span className="rip-char-count">{content.length}/{VALIDATION.CONTENT.MAX}</span>
            </div>
          </div>

          {/* 사진 업로드 영역 */}
          <div className="rip-field rip-photo-block">
            <p className="rip-label">증빙 사진</p>
            <div className="rip-photo-grid">
              {photos.map((p) => (
                <div key={p.id} className="rip-photo-thumb">
                  <img src={p.url} alt="첨부" />
                  <button type="button" onClick={() => removePhoto(p.id)} className="rip-photo-remove">×</button>
                </div>
              ))}
              {photos.length < VALIDATION.MAX_PHOTOS && (
                <button type="button" className="rip-photo-add" onClick={() => fileRef.current?.click()}>
                  <div className="rip-photo-plus">+</div>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFilesSelected} style={{ display: "none" }} />
          </div>

          <button type="submit" className="rip-submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? '전송 중...' : '이슈 신고하기'}
          </button>
        </div>
      </div>

      {isSubmitted && (
        <div className="rip-modal-overlay">
          <div className="rip-modal">
            <p className="rip-modal-title">접수 완료</p>
            <p className="rip-modal-desc">신고가 정상적으로 접수되었습니다.</p>
            <button type="button" className="rip-modal-btn" onClick={() => navigate(-1)}>확인</button>
          </div>
        </div>
      )}
    </form>
  );
}