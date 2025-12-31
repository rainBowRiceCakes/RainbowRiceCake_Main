import "./RiderPhotoPage.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// 통합된 orderSlice의 액션들로 임포트 경로와 이름을 확인하세요.
import {
  attachPickupPhoto,
  attachDropoffPhoto,
} from "../../../../../store/slices/ordersSlice.js";

export default function RiderPhotoPage({ mode }) {
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. 상태 경로 수정: state.orders.allOrders
  const orders = useSelector((state) => state.orders?.allOrders ?? []);
  const order = useMemo(
    () => orders.find((o) => String(o.orderNo) === String(orderId)),
    [orders, orderId]
  );

  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isPickup = mode === "pickup";
  const previewAlt = isPickup ? "pickup preview" : "dropoff preview";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!order) {
    return (
      <div style={{ padding: 16 }}>
        <p>주문 정보를 찾을 수 없어요 😭</p>
        <p>orderId: {orderId}</p>
      </div>
    );
  }

  const openCamera = () => fileRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!previewUrl || isUploading) return;

    setIsUploading(true);
    // 업로드 시뮬레이션
    await new Promise((r) => setTimeout(r, 600));

    if (isPickup) {
      // 2. 통합 리듀서 로직: 사진을 첨부하면 내부에서 statusCode가 'pick'으로 자동 변경됨
      dispatch(
        attachPickupPhoto({
          orderNo: order.orderNo,
          pickupPhotoUrl: previewUrl,
        })
      );
    } else {
      // 3. 통합 리듀서 로직: 사진을 첨부하면 내부에서 statusCode가 'com'으로 자동 변경됨
      dispatch(
        attachDropoffPhoto({
          orderNo: order.orderNo,
          dropoffPhotoUrl: previewUrl,
        })
      );
    }

    setIsUploading(false);
    setIsSuccess(true);

    setTimeout(() => {
      if (isPickup) {
        // 배송 중 페이지로 이동
        navigate(`/rider/${id}/delivering/${order.orderNo}`);
      } else {
        // 배송 완료 후 메인 탭으로 이동
        navigate(`/rider/${id}`, { state: { activeTab: "completed" } });
      }
    }, 650);
  };

  if (isSuccess) {
    return (
      <div className="rpp-success-page">
        <div className="rpp-success-card">
          <div className="rpp-check">✓</div>
          <p className="rpp-success-text">업로드 성공</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rpp-page">
      <header className="rpp-header">
        <h1 className="rpp-title">사진 촬영</h1>
      </header>

      <div className="rpp-main">
        <button type="button" className="rpp-upload-box" onClick={openCamera}>
          {previewUrl ? (
            <img className="rpp-preview" src={previewUrl} alt={previewAlt} />
          ) : (
            <>
              <div className="rpp-plus">+</div>
              <p className="rpp-hint">사진 업로드 해주세요!</p>
            </>
          )}
        </button>

        <input
          ref={fileRef}
          className="rpp-file"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>

      <div className="rpp-footer">
        <button
          type="button"
          className="rpp-submit"
          disabled={!previewUrl || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "업로드 중..." : "업로드 완료"}
        </button>
      </div>
    </div>
  );
}