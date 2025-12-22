import "./RiderPhotoPage.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  attachPickupPhoto,
  attachDropoffPhoto,
  markCompleted,
  markDelivering, // ✅ 변경
} from "../../../../../src/store/slices/ordersSlice.js";

export default function RiderPhotoPage({ mode }) {
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders?.orders ?? []);
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
    await new Promise((r) => setTimeout(r, 600));

    if (isPickup) {
      dispatch(
        attachPickupPhoto({
          orderNo: order.orderNo,
          pickupPhotoUrl: previewUrl,
        })
      );

      // ✅ 픽업 사진 업로드 완료 → 배달 중(DELIVERING)
      dispatch(markDelivering(order.orderNo));
    } else {
      dispatch(
        attachDropoffPhoto({
          orderNo: order.orderNo,
          dropoffPhotoUrl: previewUrl,
        })
      );

      // ✅ 전달 사진 업로드 완료 → 배달 완료(COMPLETED)
      dispatch(markCompleted(order.orderNo));
    }

    setIsUploading(false);
    setIsSuccess(true);

    setTimeout(() => {
      if (isPickup) {
        navigate(`/rider/${id}/delivering/${order.orderNo}`);
      } else {
        navigate(`/rider/${id}`);
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

      <main className="rpp-main">
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
      </main>

      <footer className="rpp-footer">
        <button
          type="button"
          className="rpp-submit"
          disabled={!previewUrl || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "업로드 중..." : "업로드 완료"}
        </button>
      </footer>
    </div>
  );
}