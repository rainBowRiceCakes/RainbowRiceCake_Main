import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { questionImageUploadThunk, questionStoreThunk } from '../../../store/thunks/questions/questionStoreThunk.js';
import "./PartnerIssueReportPage.css";

const MAX_PHOTOS = 1;

export default function PartnerIssueReportPage({ reporterTypeFixed = "PTN" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Store에서 user 정보 가져오기
  const user = useSelector((state) => state.auth?.user);

  // props가 있으면 props 우선, 없으면 user.role 사용
  const reporterType = reporterTypeFixed || user?.role;

  const getReporterLabel = (type) => {
    const labels = {
      COM: "일반 유저",
      DLV: "기사",
      PTN: "매장"
    };
    return labels[type] || "사용자";
  };

  const reporterTypeLabel = getReporterLabel(reporterType);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 사진 업로드 상태
  const fileRef = useRef(null);
  const [photos, setPhotos] = useState([]); // { file, url, id }

  const handleFilesSelected = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    const remain = MAX_PHOTOS - photos.length;
    const picked = fileList.slice(0, remain);

    const mapped = picked.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  // ✅ 언마운트 시 objectURL 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p?.url) URL.revokeObjectURL(p.url);
      });
    };
    // 의도: 언마운트 시점에 마지막 photos를 정리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 활성화 조건: "제목 + 이슈 내용"
  const canSubmit = title.trim() && content.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting || !canSubmit) return;

    setIsSubmitting(true);

    try {
      const requestData = {
        title,
        content,
        orderId,
        reporterType: reporterTypeFixed
      };

      // 2. 이미지 업로드 처리
      if (photos.length > 0 && photos[0].file) {
        try {
          const uploadResult = await dispatch(
            questionImageUploadThunk(photos[0].file)
          ).unwrap();

          // 서비스단에서 createData.qnaImg를 찾으므로 키 이름을 qnaImg로 맞춤
          if (uploadResult?.data?.path) {
            requestData.qnaImg = uploadResult.data.path;
          }
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          if (!window.confirm('이미지 업로드에 실패했습니다. 이미지 없이 진행할까요?')) {
            setIsSubmitting(false);
            return;
          }
        }
      }

      await dispatch(questionStoreThunk(requestData)).unwrap();
      setIsSubmitted(true);

    } catch (error) {
      console.error('문의 접수 실패:', error);
      const errorMsg = error.response?.data?.msg || '문의 접수에 실패했습니다.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rip-page-container">
      <header className="rip-page-header">
        <h2 className="rip-page-title">이슈 신고 접수</h2>
        <p className="rip-page-subtitle">배송 중 발생한 문제나 요청사항을 보내주시면 신속히 처리해 드립니다.</p>
      </header>

      <div className="rip-content-grid">
        {/* 왼쪽: 안내 및 주문 정보 요약 */}
        <div className="rip-side-info">
          <div className="rip-info-card">
            <h3>신고 안내</h3>
            <ul>
              <li>접수된 내용은 담당자가 확인 후 24시간 이내에 답변드립니다.</li>
              <li>긴급한 상황은 고객센터(1588-XXXX)로 직접 연락 주세요.</li>
              <li>사진을 첨부해 주시면 더 정확한 확인이 가능합니다.</li>
            </ul>
          </div>

          {orderId && (
            <div className="rip-info-card order-summary">
              <h3>관련 주문 정보</h3>
              <p><span>주문 번호:</span> #{orderId}</p>
              <p><span>신고자:</span> {reporterTypeLabel} (점주님)</p>
            </div>
          )}
        </div>

        {/* 오른쪽: 실제 입력 폼 */}
        <form className="rip-form-main" onSubmit={handleSubmit}>
          <section className="rip-form-section">
            <div className="rip-field">
              <p className="rip-label">신고자 유형</p>
              <div className="rip-input readOnly">{reporterTypeLabel}</div>
            </div>
            <div className="rip-field">
              <label className="rip-label">제목 <span className="req">*</span></label>
              <input
                className="rip-input"
                placeholder="어떤 문제가 발생했나요?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="rip-field">
              <label className="rip-label">이슈 상세 내용 <span className="req">*</span></label>
              <textarea
                className="rip-textarea"
                placeholder="상황을 구체적으로 설명해 주세요. (예: 기사가 픽업을 오지 않음, 상품 파손 등)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </section>

          <section className="rip-form-section">
            <label className="rip-label">증빙 사진 첨부</label>
            <div className="rip-photo-upload-area">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFilesSelected}
                style={{ display: "none" }}
              />

              <div className="rip-photo-grid">
                {photos.map((p) => (
                  <div key={p.id} className="rip-photo-thumb">
                    <img src={p.url} alt="첨부 이미지" />
                    <button type="button" onClick={() => removePhoto(p.id)} className="rip-photo-remove">×</button>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <button type="button" className="rip-photo-add" onClick={() => fileRef.current?.click()}>
                    <div className="rip-photo-plus">+</div>
                    <span>사진 추가</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="rip-form-actions">
            <button type="button" className="rip-btn-cancel" onClick={() => navigate(-1)}>취소</button>
            <button
              type="submit"
              className="rip-submit-btn"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? '전송 중...' : '이슈 신고하기'}
            </button>
          </div>
        </form>
      </div>
      {isSubmitted && (
        <div className="rip-modal-overlay">
          <div className="rip-modal">
            <p className="rip-modal-title">이슈가 신고 완료되었습니다.</p>
            <p className="rip-modal-desc">
              담당 부서에서 확인 후 순차적으로 안내드릴 예정입니다.
            </p>
            <button
              type="button"
              className="rip-modal-btn"
              onClick={() => navigate(-1)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
