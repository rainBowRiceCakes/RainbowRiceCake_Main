/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지, 내 문의/배송 내역 조회 (좌: 배송 / 우: 문의)
 * 251217 v1.0.0 sara init
 * 260103 v2.0.0 sara - question history feature
 * 260105 v2.0.1 sara - 탭 변경 시 fetch + orders thunk 응답 형태 반영
 * 260106 v2.1.0 sara - 이미지 로딩 에러 처리, CSS 수정, UI 정리 및 배송 경로 가시성 강화
 * 260106 v2.1.0 sara - deliveryStatus/inquiryStatus 응답 기반 UI + 토글
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../../../context/LanguageContext.js";
import "./MyPage.css";
import { myPageIndexThunk } from "../../../store/thunks/myPage/myPageIndexThunk.js";
import MypageImgView from "../auth/MypageImgView/MypageImgView.jsx";

export default function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // 토글 (배송/문의)
  const [activeTab, setActiveTab] = useState("delivery"); // 'delivery' | 'inquiry'
  const { summary, loading: summaryLoading } = useSelector((state) => state.myPage);

  useEffect(() => {
    dispatch(myPageIndexThunk());
  }, [dispatch]);

  // useMemo 가 조건부 호출 되지 않도록 기본값 세팅
  const deliveryList = useMemo(() => {
    const rawList = summary?.deliveryStatus ?? [];
    return rawList.map(order => ({
      ...order,
      pickupImage: order.order_image?.find(img => img.type === 'pick')?.img || null,
    completeImage: order.order_image?.find(img => img.type === 'com')?.img || null,
    }));
  }, [summary]);

  const inquiryList = useMemo(() => summary?.inquiryStatus ?? [], [summary]);
  const loading = summaryLoading;
  //s tate + open/close 함수 추가 (MyPage 사진 클릭해서 확대해 보는 처리)
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


  // ---------- 배송 Summary (DB status 0/1 기반) ----------
  const deliverySummary = useMemo(() => {
      let done = 0;
      let wait = 0;
      deliveryList.forEach((order) => {
        if (order.status === "com") done += 1;
        else wait += 1;
      });
      return { wait, done };
    }, [deliveryList]);

  // ---------- 문의 Summary (DB status 0/1 기반) ----------
  const inquirySummary = useMemo(() => {
      let done = 0;
      let wait = 0;
      inquiryList.forEach((q) => {
        // DB status가 1이면 완료, 0이면 대기
        if (Number(q.status) === 1) done += 1;
        else wait += 1;
      });
      return { wait, done };
    }, [inquiryList]);

    if (loading || !summary) {
      return (
        <div className="mypage-frame mypage-frame--auth">
          <div className="mypage-loading">{t('loadingMessage')}</div>
        </div>
      );
    }

  // ---------- UI Helper ----------
  const getStatusLabel = (st) => {
    // status 코드가 req/mat/pick/com
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

  // 문의 답변 상태 텍스트 
  const getInquiryBadge = (status) => {
    return Number(status) === 1 ? t('inquiryStatusResponseSent') : t('inquiryStatusUnderReview');
  };

  // ---------- Render ----------
  return (
    <div className="mypage-frame mypage-frame--auth">
      {/* back */}
      <button className="mypage-back-btn" onClick={() => navigate("/")} type="button">
        <span className="back-icon">{t('backIcon')}</span>
      </button>

      {/* profile */}
      <div className="mypage-profile-card">
        <div className="mypage-profile-circle">👤</div>
        <div className="mypage-profile-meta">
          <div className="mypage-user-name">{summary.userName}</div>
          <div className="mypage-user-sub">{t("myPageSubTitleDefault")}</div>
        </div>
      </div>

      {/* toggle tabs */}
      <div className="mypage-tabs" role="tablist">
        <button
          type="button"
          className={activeTab === "delivery" ? "mypage-tab is-active" : "mypage-tab"}
          onClick={() => setActiveTab("delivery")}
        >
          {t("myDeliveryHistory")}
          <span className="mypage-tab-badge">{deliveryList.length}</span>
        </button>

        <button
          type="button"
          className={activeTab === "inquiry" ? "mypage-tab is-active" : "mypage-tab"}
          onClick={() => setActiveTab("inquiry")}
        >
          {t("myQuestionHistory")}
          <span className="mypage-tab-badge">{inquiryList.length}</span>
        </button>
      </div>

      {/* 선택된 탭( 배송 || 문의 )만 “화면 전체” 출력 */}
      {activeTab === "delivery" && (
        <>
          {/* summary (대기/완료만) */}
          <div className="mypage-summary-card">
            <div className="mypage-summary-head">
              <h3 className="mypage-panel-title">{t("myDeliveryHistory")}</h3>
              <span className="mypage-panel-count">{deliveryList.length}</span>
            </div>

            <div className="mypage-summary-grid">
              <div className="mypage-summary-item">
                <span className="mypage-summary-k">{t('deliverySummaryProcessing')}</span>
                <strong className="mypage-summary-v">{deliverySummary.wait}</strong>
              </div>
              <div className="mypage-summary-item">
                <span className="mypage-summary-k">{t('deliverySummaryDelivered')}</span>
                <strong className="mypage-summary-v">{deliverySummary.done}</strong>
              </div>
            </div>
          </div>

          {/* Delivery history list */}
          <div className="mypage-history-list">
            {deliveryList.length === 0 ? (
                <div className="empty-msg">{t("noDeliveryHistory")}</div>
              ) : (
                deliveryList.map((order) => (
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

                    {/* 배송 관련 이미지 영역: 좌(Pickup) / 우(Complete) */}
                    <div className="mypage-img-split-container">
                      {/* 왼쪽: Pickup 이미지 기사가 사진을 올린 시점부터 노출 */}
                      <div className="mypage-img-half">
                        {/* 왼쪽: Pickup 이미지 (type === 'pick') */}
                        <img
                          className="mypage-img-split"
                          src={
                            (["pick", "com"].includes(order.status)) &&
                            order.order_image?.find((img) => img.type === "pick")?.img
                              ? order.order_image.find((img) => img.type === "pick").img
                              : "/resource/main-logo.png"
                          }
                          alt="pickup"
                          onClick={() => {
                            const pickSrc =
                              (["pick", "com"].includes(order.status)) &&
                              order.order_image?.find((img) => img.type === "pick")?.img
                                ? order.order_image.find((img) => img.type === "pick").img
                                : null;

                            // ✅ 실제 이미지 있을 때만 모달 오픈 (로고 placeholder는 제외)
                            if (pickSrc) openImgView(pickSrc, "pickup");
                          }}
                          onError={(e) => (e.target.src = "/resource/main-logo.png")}
                        />
                        <span className="mypage-img-label">{t('deliveryPickedUpLabel')}</span>
                      </div>

                      {/* 오른쪽: Complete 이미지 - 완료(com) 시점에만 노출 (type === 'com') */}
                      <div className="mypage-img-half">
                          <img
                            className="mypage-img-split"
                            src={
                              order.status === "com" && order.order_image?.find((img) => img.type === "com")?.img
                                ? order.order_image.find((img) => img.type === "com").img
                                : "/resource/main-logo.png"
                            }
                            alt="delivered"
                            onClick={() => {
                              const comSrc =
                                order.status === "com" && order.order_image?.find((img) => img.type === "com")?.img
                                  ? order.order_image.find((img) => img.type === "com").img
                                  : null;

                              if (comSrc) openImgView(comSrc, "delivered");
                            }}
                            onError={(e) => (e.target.src = "/resource/main-logo.png")}
                          />
                        <span className="mypage-img-label">{t('deliveryDeliveredLabel')}</span>
                      </div>
                    </div>

                    {/* rider가 null일 수 있음 (mat 상태 이후부터 노출) */}
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

                    <div className="mypage-kv">
                      <span className="mypage-k">{t('deliveryPlan')}</span>
                      <strong className="mypage-v">
                        {order.cntS === 1 && "Basic"}
                        {order.cntM === 1 && "Standard"}
                        {order.cntL === 1 && "Premium"}
                      </strong>
                    </div>

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
        </>
      )}

      {activeTab === "inquiry" && (
        <>
          {/* summary (대기/완료만) */}
          <div className="mypage-summary-card">
            <div className="mypage-summary-head">
              <h3 className="mypage-panel-title">{t("myQuestionHistory")}</h3>
              <span className="mypage-panel-count">{inquiryList.length}</span>
            </div>

            <div className="mypage-summary-grid">
              <div className="mypage-summary-item">
                <span className="mypage-summary-k">{t('inquirySummaryUnderReview')}</span>
                <strong className="mypage-summary-v">{inquirySummary.wait}</strong>
              </div>
              <div className="mypage-summary-item">
                <span className="mypage-summary-k">{t('inquirySummaryResponseSent')}</span>
                <strong className="mypage-summary-v">{inquirySummary.done}</strong>
              </div>
            </div>
          </div>

          {/* Questions history list */}
          <div className="mypage-history-list">
            {inquiryList.length === 0 ? (
              <div className="empty-msg">{t("noQuestionHistory")}</div>
            ) : (
              inquiryList.map((q) => (
                <div key={q.id} className="mypage-card">
                  <div className="mypage-card-head">
                    <div className="mypage-card-title">
                      <span className="mypage-card-mini">{t('inquiryTitle')}</span>
                      <strong className="mypage-card-strong">{q.title}</strong>
                    </div>
                    <span className={q.status === 1 ? "mypage-badge is-completed" : "mypage-badge is-wait"}>
                      {getInquiryBadge(q.status)}
                    </span>
                  </div>

                  <div className="mypage-card-body">
                    <div className="mypage-content">{q.content}</div>
                      {q.qnaImg && (
                        <div className="mypage-img-wrap">
                          <img
                            className="mypage-img"
                            src={q.qnaImg}
                            alt={t("inquiryImageAlt")}
                            onClick={() => openImgView(q.qnaImg, t("inquiryImageAlt"))}
                            onError={(e) => (e.target.parentNode.style.display = "none")}
                          />
                        </div>
                      )}
                    {/* res(답변) */}
                    {q.res && (
                      <div className="mypage-answer">
                        <div className="mypage-answer-k">{t('inquiryAnswer')}</div>
                        <div className="mypage-answer-v">{q.res}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      <MypageImgView
        isOpen={imgViewOpen}
        onClose={closeImgView}
        src={imgViewSrc}
        alt={imgViewAlt}
      />
    </div>
  );
}
