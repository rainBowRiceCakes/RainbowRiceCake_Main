import "./RiderPhotoPage.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadPickupPhoto, uploadCompletePhoto } from "../../../../../store/thunks/orders/orderPicsThunk.js";
import { useNavigate } from "react-router-dom";

export default function RiderPhotoPage({ mode, order, onClose }) {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const isPickup = order?.status === "mat";

  // 메모리 누수 방지
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 간단한 프론트엔드 파일 크기 체크 (백엔드 limits와 동기화: 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setFile(selectedFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      // ✅ 중요: 백엔드 .single("image")와 동일한 필드명 사용
      formData.append("image", file);

      const isPickup = order.status === "mat";
      // Thunk 실행 (백엔드 라우터: /:orderId/pickup-photo 또는 /complete-photo)
      const resultAction = await dispatch(
        isPickup
          ? uploadPickupPhoto({ orderId: order.id, formData })  // 픽업 단계
          : uploadCompletePhoto({ orderId: order.id, formData }) // 드롭오프 단계
      );

      if (uploadPickupPhoto.fulfilled.match(resultAction) || uploadCompletePhoto.fulfilled.match(resultAction)) {
        // 성공 시 팝업 닫기 -> 부모 컴포넌트가 바뀐 status(pick/com)를 감지해 UI 전환
        // ✅ 3. 분기 처리 로직 추가
        if (!isPickup) {
          // 'pick' 상태에서 올렸다면 이제 배달 완료(com)이므로 대시보드로 이동
          alert("배달이 완료되었습니다!");
          navigate("/riders"); // 대시보드 주소로 설정 (프로젝트 경로에 맞게 수정)
        } else {
          // 픽업 단계라면 다음 단계(호텔 이동)를 위해 팝업만 닫기
          onClose();
        }

      } else if (resultAction.payload) {
        alert(`업로드 실패: ${resultAction.payload.message}`);
      }
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rpp-page">
      <header className="rpp-header">
        <h1 className="rpp-title">{isPickup ? "수령 인증 (가게)" : "배달 완료 (호텔)"}</h1>
      </header>

      <div className="rpp-main">
        <button type="button" className="rpp-upload-box" onClick={() => fileRef.current?.click()}>
          {previewUrl ? (
            <img className="rpp-preview" src={previewUrl} alt="preview" />
          ) : (
            <>
              <div className="rpp-plus">+</div>
              <p className="rpp-hint">인증 사진 촬영하기</p>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="rpp-footer">
        <button className="rpp-submit" disabled={!file || isUploading} onClick={handleUpload}>
          {isUploading ? "업로드 중..." : "인증 완료"}
        </button>
      </div>
    </div>
  );
}