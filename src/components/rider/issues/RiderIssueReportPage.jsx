// components/rider/issues/RiderIssueReportPage.jsx

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { questionImageUploadThunk, questionStoreThunk } from '../../../store/thunks/questions/questionStoreThunk.js';
import "./RiderIssueReportPage.css";

const MAX_PHOTOS = 1;

export default function RiderIssueReportPage({ reporterTypeFixed = null }) {
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
      // 1. 기본 텍스트 데이터 준비
      // 현재 Questions 테이블에 order_id/dlv_id 컬럼이 없으므로
      // 백엔드에서 찾을 수 있게 내용(content)에 주문 번호를 포함시키는 것이 안전합니다.
      const requestData = {
        title: title.trim(),
        content: `[주문번호: ${orderId}] ${content.trim()}`,
      };

      console.log("보내는 데이터:", requestData);


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
    <form onSubmit={handleSubmit}>
      <div className="rip-wrap">
        <div className="rip-main">
          <div className="rip-field">
            <p className="rip-label">신고자 유형</p>
            <div className="rip-input readOnly">{reporterTypeLabel}</div>
          </div>

          <div className="rip-field">
            <p className="rip-label">
              제목 <span className="req">*</span>
            </p>
            <input
              className="rip-input"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="rip-field">
            <p className="rip-label">
              내용 <span className="req">*</span>
            </p>
            <textarea
              className="rip-textarea"
              placeholder="주문 번호와 이슈 내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="rip-field rip-photo-block">
            <p className="rip-label">사진 정보</p>
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
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    aria-label="사진 삭제"
                    className="rip-photo-remove"
                  >
                    ×
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className="rip-photo-add"
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="rip-photo-plus">+</div>
                </button>
              )}
            </div>

            <p className="rip-photo-hint">
              Optional / 최대 {MAX_PHOTOS}장까지 첨부 가능
            </p>
          </div>

          <button
            type="submit"
            className="rip-submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? '전송 중...' : '이슈 신고하기'}
          </button>
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
    </form>
  );
}

// TODO: <RiderIssueReportPage reporterTypeFixed="PARTNER" /> 점주용에서는 이렇게 쓰기!