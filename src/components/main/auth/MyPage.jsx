/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지, 내 문의/배송 내역 조회 (좌: 배송 / 우: 문의)
 * 251217 v1.0.0 sara init
 * 260103 v2.0.0 sara - question history feature
 * 260105 v2.0.1 sara - 탭 변경 시 fetch + orders thunk 응답 형태 반영
 * 260106 v2.1.0 sara - 이미지 로딩 에러 처리, CSS 수정, UI 정리 및 배송 경로 가시성 강화
 * 260106 v2.1.0 sara - deliveryStatus/inquiryStatus 응답 기반 UI + 토글
 * 260108 v3.0.0 user - 필터링, 페이지네이션, 역순 정렬 기능 추가
 */

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../../../context/LanguageContext.js";
import "./MyPage.css";
import { myPageIndexThunk } from "../../../store/thunks/myPage/myPageIndexThunk.js";
import MypageImgView from "../auth/MypageImgView/MypageImgView.jsx";
import Pagination from "../../common/Pagination.jsx";

const ITEMS_PER_PAGE = 5;

export default function MyPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  // 토글 (배송/문의)
  const [activeTab, setActiveTab] = useState("delivery"); // 'delivery' | 'inquiry'
  const { summary, loading: summaryLoading } = useSelector((state) => state.myPage);
  
  // 필터링 및 페이지네이션 상태
  const [deliveryFilter, setDeliveryFilter] = useState('all'); // 'all', 'processing', 'com'
  const [inquiryFilter, setInquiryFilter] = useState('all'); // 'all', 'reviewing', 'answered'
  const [deliveryPage, setDeliveryPage] = useState(1);
  const [inquiryPage, setInquiryPage] = useState(1);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    dispatch(myPageIndexThunk());
  }, [dispatch, location.state]);

  // 필터 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setDeliveryPage(1);
  }, [deliveryFilter]);

  useEffect(() => {
    setInquiryPage(1);
  }, [inquiryFilter]);

  // 원본 목록 (역순 정렬)
  const deliveryList = useMemo(() => {
    const rawList = summary?.deliveryStatus?.slice().reverse() ?? [];
    return rawList.map(order => ({
      ...order,
      pickupImage: order.order_image?.find(img => img.type === 'pick')?.img || null,
      completeImage: order.order_image?.find(img => img.type === 'com')?.img || null,
    }));
  }, [summary]);

  const inquiryList = useMemo(() => summary?.inquiryStatus?.slice().reverse() ?? [], [summary]);

  // 필터링된 목록
  const filteredDeliveryList = useMemo(() => {
    if (deliveryFilter === 'all') {
      return deliveryList;
    }
    if (deliveryFilter === 'com') {
      return deliveryList.filter(order => order.status === 'com');
    }
    return deliveryList.filter(order => order.status !== 'com');
  }, [deliveryList, deliveryFilter]);

  const filteredInquiryList = useMemo(() => {
    if (inquiryFilter === 'all') {
      return inquiryList;
    }
    if (inquiryFilter === 'answered') {
      return inquiryList.filter(q => Number(q.status) === 1);
    }
    return inquiryList.filter(q => Number(q.status) !== 1);
  }, [inquiryList, inquiryFilter]);
  
  // 페이지네이션된 목록
  const paginatedDeliveries = useMemo(() => {
    const startIndex = (deliveryPage - 1) * ITEMS_PER_PAGE;
    return filteredDeliveryList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDeliveryList, deliveryPage]);

  const paginatedInquiries = useMemo(() => {
    const startIndex = (inquiryPage - 1) * ITEMS_PER_PAGE;
    return filteredInquiryList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInquiryList, inquiryPage]);

  const deliveryTotalPages = Math.ceil(filteredDeliveryList.length / ITEMS_PER_PAGE);
  const inquiryTotalPages = Math.ceil(filteredInquiryList.length / ITEMS_PER_PAGE);

  const loading = summaryLoading;
  // State + open/close 함수 추가 (MyPage 사진 클릭해서 확대해 보는 처리)
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
      (summary?.deliveryStatus ?? []).forEach((order) => {
        if (order.status === "com") done += 1;
        else wait += 1;
      });
      return { wait, done };
    }, [summary]);

  // ---------- 문의 Summary (DB status 0/1 기반) ----------
  const inquirySummary = useMemo(() => {
      let done = 0;
      let wait = 0;
      (summary?.inquiryStatus ?? []).forEach((q) => {
        if (Number(q.status) === 1) done += 1;
        else wait += 1;
      });
      return { wait, done };
    }, [summary]);

    if (loading || !summary) {
      return (
        <div className="mypage-frame mypage-frame--auth">
          <div className="mypage-loading">{t('loadingMessage')}</div>
        </div>
      );
    }

  // ---------- UI Helper ----------
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

  const getInquiryBadge = (status) => {
    return Number(status) === 1 ? t('inquiryStatusResponseSent') : t('inquiryStatusUnderReview');
  };

  // ---------- Render ----------
  return (
    <div className="mypage-frame mypage-frame--auth">
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

      {activeTab === "delivery" && (
        <>
          <div className="mypage-summary-card">
            <div className="mypage-summary-head">
              <h3 className="mypage-panel-title" onClick={() => setDeliveryFilter('all')} style={{cursor: 'pointer'}}>
                {t("myDeliveryHistory")}
              </h3>
              <span className="mypage-panel-count">{deliveryList.length}</span>
            </div>

            <div className="mypage-summary-grid">
              <div className={`mypage-summary-item ${deliveryFilter === 'processing' ? 'is-active' : ''}`} onClick={() => setDeliveryFilter('processing')} style={{cursor: 'pointer'}}>
                <span className="mypage-summary-k">{t('deliverySummaryProcessing')}</span>
                <strong className="mypage-summary-v">{deliverySummary.wait}</strong>
              </div>
              <div className={`mypage-summary-item ${deliveryFilter === 'com' ? 'is-active' : ''}`} onClick={() => setDeliveryFilter('com')} style={{cursor: 'pointer'}}>
                <span className="mypage-summary-k">{t('deliverySummaryDelivered')}</span>
                <strong className="mypage-summary-v">{deliverySummary.done}</strong>
              </div>
            </div>
          </div>

          <div className="mypage-history-list">
            {paginatedDeliveries.length === 0 ? (
                <div className="empty-msg">{t("noDeliveryHistory")}</div>
              ) : (
                paginatedDeliveries.map((order) => (
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
                          src={
                            (["pick", "com"].includes(order.status)) && order.pickupImage
                              ? order.pickupImage
                              : "/resource/main-logo.png"
                          }
                          alt="pickup"
                          onClick={() => {
                            if ((["pick", "com"].includes(order.status)) && order.pickupImage) {
                              openImgView(order.pickupImage, "pickup");
                            }
                          }}
                          onError={(e) => (e.target.src = "/resource/main-logo.png")}
                        />
                        <span className="mypage-img-label">{t('deliveryPickedUpLabel')}</span>
                      </div>

                      <div className="mypage-img-half">
                          <img
                            className="mypage-img-split"
                            src={
                              order.status === "com" && order.completeImage
                                ? order.completeImage
                                : "/resource/main-logo.png"
                            }
                            alt="delivered"
                            onClick={() => {
                              if (order.status === "com" && order.completeImage) {
                                openImgView(order.completeImage, "delivered");
                              }
                            }}
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
          <Pagination 
            currentPage={deliveryPage}
            totalPages={deliveryTotalPages}
            onPageChange={setDeliveryPage}
          />
        </>
      )}

      {activeTab === "inquiry" && (
        <>
          <div className="mypage-summary-card">
            <div className="mypage-summary-head">
               <h3 className="mypage-panel-title" onClick={() => setInquiryFilter('all')} style={{cursor: 'pointer'}}>
                {t("myQuestionHistory")}
              </h3>
              <span className="mypage-panel-count">{inquiryList.length}</span>
            </div>

            <div className="mypage-summary-grid">
              <div className={`mypage-summary-item ${inquiryFilter === 'reviewing' ? 'is-active' : ''}`} onClick={() => setInquiryFilter('reviewing')} style={{cursor: 'pointer'}}>
                <span className="mypage-summary-k">{t('inquirySummaryUnderReview')}</span>
                <strong className="mypage-summary-v">{inquirySummary.wait}</strong>
              </div>
              <div className={`mypage-summary-item ${inquiryFilter === 'answered' ? 'is-active' : ''}`} onClick={() => setInquiryFilter('answered')} style={{cursor: 'pointer'}}>
                <span className="mypage-summary-k">{t('inquirySummaryResponseSent')}</span>
                <strong className="mypage-summary-v">{inquirySummary.done}</strong>
              </div>
            </div>
          </div>

          <div className="mypage-history-list">
            {paginatedInquiries.length === 0 ? (
              <div className="empty-msg">{t("noQuestionHistory")}</div>
            ) : (
              paginatedInquiries.map((q) => (
                <div key={q.id} className="mypage-card">
                  <div className="mypage-card-head">
                    <div className="mypage-card-title">
                      <span className="mypage-card-mini">{t('inquiryTitle')}</span>
                      <strong className="mypage-card-strong">{q.title}</strong>
                    </div>
                    <span className={Number(q.status) === 1 ? "mypage-badge is-completed" : "mypage-badge is-wait"}>
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
          <Pagination
            currentPage={inquiryPage}
            totalPages={inquiryTotalPages}
            onPageChange={setInquiryPage}
          />
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
