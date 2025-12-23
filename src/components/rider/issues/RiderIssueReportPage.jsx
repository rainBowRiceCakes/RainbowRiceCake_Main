// components/rider/issues/RiderIssueReportPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./RiderIssueReportPage.css";

const ISSUE_TYPES = [
  { value: "LOST_DAMAGED", label: "[일반] 물품 분실·파손" },
  { value: "APP_SYSTEM", label: "[일반] 앱 / 시스템 오류" },
  { value: "SETTLEMENT", label: "[일반] 정산 / 수익 문의" },
  { value: "POLICY", label: "[일반] 운영 정책 문의" },
];

const MAX_PHOTOS = 1;

export default function RiderIssueReportPage({ reporterTypeFixed = "RIDER" }) {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const orders = useSelector((state) => state.orders?.orders ?? []);
  const order = useMemo(
    () => orders.find((o) => String(o.orderNo) === String(orderId)),
    [orders, orderId]
  );

  const reporterTypeLabel = reporterTypeFixed === "PARTNER" ? "매장" : "기사";

  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");

  // ✅ 모달 상태: 반드시 handleSubmit 위에 있어야 안전
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ 사진 업로드 상태
  const fileRef = useRef(null);
  const [photos, setPhotos] = useState([]); // { file, url, id }

  const openFilePicker = () => {
    if (photos.length >= MAX_PHOTOS) return;
    fileRef.current?.click();
  };

  const handleFilesSelected = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    const remain = MAX_PHOTOS - photos.length;
    const picked = fileList.slice(0, remain);

    const mapped = picked.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${
        crypto?.randomUUID?.() ?? Math.random()
      }`,
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

  // ✅ 활성화 조건: "이슈 유형 + 이슈 내용"만
  const canSubmit = issueType !== "" && message.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    console.log("ISSUE SUBMIT", {
      reporterType: reporterTypeFixed,
      orderNo: order?.orderNo ?? orderId,
      issueType,
      message: message.trim(),
      photos,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="rip-wrap">
      <header className="rip-topbar">
        <button className="rip-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="rip-title">이슈 신고</h1>
        <div className="rip-spacer" />
      </header>

      <div className="rip-main">
        <div className="rip-field">
          <label className="rip-label">신고자 유형</label>
          <div className="rip-input readOnly">{reporterTypeLabel}</div>
        </div>

        <div className="rip-field">
          <label className="rip-label">
            이슈 유형 <span className="req">*</span>
          </label>
          <select
            className="rip-select"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="">선택하세요</option>
            {ISSUE_TYPES.map((it) => (
              <option key={it.value} value={it.value}>
                {it.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rip-field">
          <label className="rip-label">
            이슈 내용 <span className="req">*</span>
          </label>
          <textarea
            className="rip-textarea"
            placeholder="주문 번호와 이슈 내용을 입력해주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="rip-field rip-photo-block">
          <label className="rip-label">사진 정보</label>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            style={{ display: "none" }}
          />

          <div className="rip-photo-grid">
            {photos.map((p) => (
              <div
                key={p.id}
                className="rip-photo-thumb"
                style={{ position: "relative" }}
              >
                <img src={p.url} alt="첨부 이미지" />
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  aria-label="사진 삭제"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                    fontWeight: 900,
                    lineHeight: "28px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                className="rip-photo-add"
                onClick={openFilePicker}
              >
                <div className="rip-photo-plus">+</div>
              </button>
            )}
          </div>

          <p
            style={{
              margin: "10px 2px 0",
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            최대 {MAX_PHOTOS}장까지 첨부할 수 있어요.
          </p>
        </div>

        <button
          type="button"
          className="rip-submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          이슈 신고하기
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
  );
}

// TODO: <RiderIssueReportPage reporterTypeFixed="PARTNER" /> 점주용에서는 이렇게 쓰기!