/**
 * @file src/components/main/sections/MainDLVS.jsx
 * @description 배송 현황 페이지. 로그인 시 내역 조회, 비로그인 시 단건 조회.
 * 251216 v1.0.0 sara init 
 * 260108 v2.0.0 user - pagination and list view for logged-in users
 */

import { useState, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import './MainDLVS.css';
import { LanguageContext } from '../../../context/LanguageContext';
import { myPageIndexThunk } from "../../../store/thunks/myPage/myPageIndexThunk.js";
import Pagination from "../../common/Pagination.jsx";
import MypageImgView from "../auth/MypageImgView/MypageImgView.jsx";

const ITEMS_PER_PAGE = 5;

export default function MainDLVS() {
  const { t } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { summary, loading: summaryLoading } = useSelector((state) => state.myPage);
  
  const [result, setResult] = useState(null); // For single tracking
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(myPageIndexThunk());
    }
  }, [dispatch, isLoggedIn]);

  // --- Start: Logic copied from MyPage.jsx for list view ---

  const deliveryList = useMemo(() => {
    if (!isLoggedIn || !summary?.deliveryStatus) return [];
    const rawList = summary.deliveryStatus.slice().reverse() ?? [];
    return rawList.map(order => ({
      ...order,
      pickupImage: order.order_image?.find(img => img.type === 'pick')?.img || null,
      completeImage: order.order_image?.find(img => img.type === 'com')?.img || null,
    }));
  }, [summary, isLoggedIn]);

  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return deliveryList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [deliveryList, currentPage]);

  const totalPages = Math.ceil(deliveryList.length / ITEMS_PER_PAGE);

  const [imgViewOpen, setImgViewOpen] = useState(false);
  const [imgViewSrc, setImgViewSrc] = useState("");
  const [imgViewAlt, setImgViewAlt] = useState("");

  const openImgView = (src, alt = "image") => {
    if (!src) return;
    setImgViewSrc(src);
    setImgViewAlt(alt);
    setImgViewOpen(true);
  };

  const closeImgView = () => setImgViewOpen(false);

  const getStatusLabel = (st) => {
    if (st === "req") return t('deliveryStatusOrderReceived');
    if (st === "mat") return t('deliveryStatusPickedUp');
    if (st === "pick") return t('deliveryStatusOnTheWay');
    if (st === "com") return t('deliveryStatusDelivered');
    return st;
  };

  const getStatusBadgeClass = (st) => {
    if (st === "com") return "is-completed";
    if (st === "pick") return "is-progress";
    if (st === "mat") return "is-matching";
    return "is-wait";
  };
  
  // --- End: Logic copied from MyPage.jsx ---

  const onSingleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = (form.get("code") || "").toString().trim();

    if (!code) return;

    if (code.toLowerCase() === "none") {
      alert(t('dlvsNoInfo'));
      e.currentTarget.reset();
      setResult(null);
      return;
    }

    // This is dummy data logic. In a real app, this would be an API call.
    setResult({
      code,
      step: "DELIVERING",
      timeline: [
        { t: t('dlvsTimelineStep1'), d: t('dlvsTimelineStep1Desc') },
        { t: t('dlvsTimelineStep2'), d: t('dlvsTimelineStep2Desc') },
        { t: t('dlvsTimelineStep3'), d: t('dlvsTimelineStep3Desc') },
      ],
    });
  };

  return (
    <div className="maindlvs-frame mainshow-section-frame" id="dlvs">
      <div className="mainshow-section-wrapper">
        
        <div className="maindlvs-header-group">
          <div>
            <h2 className="maindlvs-title-text">{t('dlvsTitle')}</h2>
            <p className="maindlvs-desc-text">
              {isLoggedIn ? t("myDeliveryHistory") : t('dlvsDesc')}
            </p>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="maindlvs-list-view">
            <div className="mypage-history-list">
              {summaryLoading ? (
                <div className="empty-msg">{t('loadingMessage')}</div>
              ) : paginatedDeliveries.length === 0 ? (
                  <div className="empty-msg">{t("noDeliveryHistory")}</div>
                ) : (
                  paginatedDeliveries.map((order) => (
                  // This is the card rendering logic from MyPage.jsx
                  <div key={order.id} className="mypage-card">
                    <div className="mypage-card-head">
                      <div className="mypage-card-title">
                        <span className="mypage-card-mini">{t('deliveryOrderNumber')}</span>
                        <strong className="mypage-card-strong">{order.orderCode}</strong>
                      </div>
                      <span className={`mypage-badge ${getStatusBadgeClass(order.status)}`}>
                         {getStatusLabel(order.status)}
                      </span>
                   </div>
  
                    <div className="mypage-card-body">
                      <div className="mypage-kv">
                        <span className="mypage-k">{t('deliveryRecipient')}</span>
                        <strong className="mypage-v">{order.name}</strong>
                      </div>
                      <div className="mypage-kv">
                        <span className="mypage-k">{t('deliveryPickupLocation')}</span>
                        <strong className="mypage-v">{order.order_partner.krName} ({order.order_partner.enName})</strong>
                      </div>
                      <div className="mypage-kv">
                        <span className="mypage-k">{t('deliveryDropOffLocation')}</span>
                        <strong className="mypage-v">{order.order_hotel.krName} ({order.order_hotel.enName})</strong>
                      </div>
  
                      <div className="mypage-img-split-container">
                        <div className="mypage-img-half">
                          <img
                            className="mypage-img-split"
                            src={ (["pick", "com"].includes(order.status)) && order.pickupImage ? order.pickupImage : "/resource/main-logo.png" }
                            alt="pickup"
                            onClick={() => { if ((["pick", "com"].includes(order.status)) && order.pickupImage) { openImgView(order.pickupImage, "pickup"); } }}
                            onError={(e) => (e.target.src = "/resource/main-logo.png")}
                          />
                          <span className="mypage-img-label">{t('deliveryPickedUpLabel')}</span>
                        </div>
                        <div className="mypage-img-half">
                            <img
                              className="mypage-img-split"
                              src={ order.status === "com" && order.completeImage ? order.completeImage : "/resource/main-logo.png" }
                              alt="delivered"
                              onClick={() => { if (order.status === "com" && order.completeImage) { openImgView(order.completeImage, "delivered"); } }}
                              onError={(e) => (e.target.src = "/resource/main-logo.png")}
                            />
                          <span className="mypage-img-label">{t('deliveryDeliveredLabel')}</span>
                        </div>
                      </div>
  
                      {order.order_rider && (
                        <div className="mypage-kv-group">
                          <div className="mypage-kv">
                            <span className="mypage-k">{t('deliveryDriverName')}</span>
                            <strong className="mypage-v">{order.order_rider.rider_user.name}</strong>
                          </div>
                          <div className="mypage-kv">
                            <span className="mypage-k">{t('deliveryDriverContact')}</span>
                            <strong className="mypage-v">{order.order_rider.phone}</strong>
                          </div>
                        </div>
                      )}
  
                      <div className="mypage-kv no-border">
                        <span className="mypage-k">{t('deliveryPaymentAmount')}</span>
                        <strong className="mypage-v price">
                          {order.price?.toLocaleString()}{t('currencyUnit')}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          // Original content for logged-out users
          <div className="maindlvs-grid-2">
            <form className="maindlvs-card-box" onSubmit={onSingleSubmit}>
              <h3 className="maindlvs-card-title-text">{t('dlvsTrackingFormTitle')}</h3>
              <div className="maindlvs-form-fields-group">
                <label className="maindlvs-form-label-group">
                  <div className="maindlvs-field-label">{t('dlvsCodeLabel')}</div>
                  <input className="maindlvs-field-input" name="code" placeholder={t('dlvsCodePlaceholder')} required />
                </label>
                <button className="maindlvs-submit-button maindlvs-submit-button--primary" type="submit" >
                  {t('dlvsTrackButton')}
                </button>
                <div className="maindlvs-note-text" dangerouslySetInnerHTML={{ __html: t('dlvsTestNote') }} />
              </div>
            </form>
  
            <div className="maindlvs-card-box">
              <h3 className="maindlvs-card-title-text">{t('dlvsResultTitle')}</h3>
              {!result ? (
                <div className="maindlvs-result-placeholder">{t('dlvsResultPlaceholder')}</div>
              ) : (
                <div className="maindlvs-result-content">
                  <div className="maindlvs-result-meta-text">{t('dlvsResultCode')} {result.code}</div>
                  <div className="maindlvs-status-box">
                    <div className="maindlvs-status-title-text">{t('dlvsResultCurrentStatus')} {result.step}</div>
                    <div className="maindlvs-status-desc-text">{t('dlvsStatusFlow')}</div>
                  </div>
                  <div className="maindlvs-timeline-group">
                    <div className="maindlvs-timeline-title-text">{t('dlvsTimelineTitle')}</div>
                    <div className="maindlvs-timeline-list">
                      {result.timeline.map((x, idx) => (
                        <div key={idx} className="maindlvs-timeline-item">
                          <div className="maindlvs-timeline-step-text">{x.t}</div>
                          <div className="maindlvs-timeline-desc-text">{x.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="maindlvs-proof-group">
                    <div className="maindlvs-proof-title-text">{t('dlvsPhotoProofTitle')}</div>
                    <div className="maindlvs-proof-box">{t('dlvsProofPhotoPlaceholder')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <MypageImgView
        isOpen={imgViewOpen}
        onClose={closeImgView}
        src={imgViewSrc}
        alt={imgViewAlt}
      />
    </div>
  );
}
