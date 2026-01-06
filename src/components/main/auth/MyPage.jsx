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
import { useTranslation } from "../../../context/LanguageContext";
import "./MyPage.css";
import { myPageIndexThunk } from "../../../store/thunks/myPage/myPageIndexThunk";

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

  // useMemi 가 조건부 호출 되지 않도록 기본값 세팅
  const deliveryList = summary ? summary.deliveryStatus : [];
  const inquiryList = summary ? summary.inquiryStatus : [];
  const loading = summaryLoading;

  // ---------- Summary 계산 ----------
  const deliverySummary = useMemo(() => {
    let done = 0;
    let wait = 0;
    for (let i = 0; i < deliveryList.length; i++) {
      if (deliveryList[i].status === "com") done += 1;
      else wait += 1;
    }
    return { wait, done };
  }, [deliveryList]);

  const inquirySummary = useMemo(() => {
    let done = 0;
    let wait = 0;
    for (let i = 0; i < inquiryList.length; i++) {
      if (inquiryList[i].status === true) done += 1;
      else wait += 1;
    }
    return { wait, done };
  }, [inquiryList]);

  // ✅ 이제 early return 해도 훅 순서 안 깨짐
  if (loading || !summary) {
    return (
      <div className="mypage-frame mypage-frame--auth">
        <div className="mypage-loading">Loading...</div>
      </div>
    );
  }

  // ---------- UI Helper ----------
  const getStatusLabel = (st) => {
    // status 코드가 req/mat/pick/com
    if (st === "req") return "Register";
    if (st === "mat") return "Driver Matching";
    if (st === "pick") return "In Progress";
    if (st === "com") return "Completed";
    return st;
  };

  const getStatusBadgeClass = (st) => {
    if (st === "com") return "is-completed";
    if (st === "pick") return "is-progress";
    if (st === "mat") return "is-matching";
    return "is-wait";
  };

  const getInquiryBadge = (statusBool) => {
    return statusBool ? "Completed" : "Waiting";
  };

  // ---------- Render ----------
  return (
    <div className="mypage-frame mypage-frame--auth">
      {/* back */}
      <button className="mypage-back-btn" onClick={() => navigate("/")} type="button">
        <span className="back-icon">←</span>
      </button>

      {/* profile */}
      <div className="mypage-profile-card">
        <div className="mypage-profile-circle">👤</div>
        <div className="mypage-profile-meta">
          <div className="mypage-user-name">{summary.userName}</div>
          <div className="mypage-user-sub">{t("myPageSubTitle") || "My activity overview"}</div>
        </div>
      </div>

      {/* ✅ toggle tabs */}
      <div className="mypage-tabs" role="tablist" aria-label="MyPage Tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "delivery"}
          className={activeTab === "delivery" ? "mypage-tab is-active" : "mypage-tab"}
          onClick={() => setActiveTab("delivery")}
        >
          {t("myDeliveryHistory")}
          <span className="mypage-tab-badge">{deliveryList.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "inquiry"}
          className={activeTab === "inquiry" ? "mypage-tab is-active" : "mypage-tab"}
          onClick={() => setActiveTab("inquiry")}
        >
          {t("myQuestionHistory")}
          <span className="mypage-tab-badge">{inquiryList.length}</span>
        </button>
      </div>

      {/* ✅ 선택된 탭만 “화면 전체” 출력 */}
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
                <span className="mypage-summary-k">Waiting</span>
                <strong className="mypage-summary-v">{deliverySummary.wait}</strong>
              </div>
              <div className="mypage-summary-item">
                <span className="mypage-summary-k">Completed</span>
                <strong className="mypage-summary-v">{deliverySummary.done}</strong>
              </div>
            </div>
          </div>

          {/* history list */}
          <div className="mypage-history-list">
            {deliveryList.length === 0 ? (
              <div className="empty-msg">{t("noDeliveryHistory")}</div>
            ) : (
              deliveryList.map((order) => (
                <div key={order.id} className="mypage-card">
                  <div className="mypage-card-head">
                    <div className="mypage-card-title">
                      <span className="mypage-card-mini">Order Number</span>
                      <strong className="mypage-card-strong">{order.orderCode}</strong>
                    </div>

                    <span className={"mypage-badge " + getStatusBadgeClass(order.status)}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="mypage-card-body">
                    <div className="mypage-kv">
                      <span className="mypage-k">Recipient</span>
                      <strong className="mypage-v">{order.name}</strong>
                    </div>

                    <div className="mypage-kv">
                      <span className="mypage-k">Pickup Location</span>
                      <strong className="mypage-v">{order.order_partner.krName}</strong>
                    </div>

                    <div className="mypage-kv">
                      <span className="mypage-k">Drop-off Location</span>
                      <strong className="mypage-v">{order.order_hotel.krName}</strong>
                    </div>

                    {/* rider가 null일 수 있어서 조건 렌더 (?. 사용 안 함) */}
                    {order.order_rider !== null && (
                      <div className="mypage-kv-group">
                        <div className="mypage-kv">
                          <span className="mypage-k">Driver Name</span>
                          <strong className="mypage-v">{order.order_rider.rider_user.name}</strong>
                        </div>
                        <div className="mypage-kv">
                          <span className="mypage-k">Driver Contact</span>
                          <strong className="mypage-v">{order.order_rider.phone}</strong>
                        </div>
                      </div>
                    )}

                    <div className="mypage-kv no-border">
                      <span className="mypage-k">Payment Amount</span>
                      <strong className="mypage-v price">
                        {order.price.toLocaleString()}KRW
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
                <span className="mypage-summary-k">Waiting</span>
                <strong className="mypage-summary-v">{inquirySummary.wait}</strong>
              </div>
              <div className="mypage-summary-item">
                <span className="mypage-summary-k">Completed</span>
                <strong className="mypage-summary-v">{inquirySummary.done}</strong>
              </div>
            </div>
          </div>

          {/* history list */}
          <div className="mypage-history-list">
            {inquiryList.length === 0 ? (
              <div className="empty-msg">{t("noQuestionHistory")}</div>
            ) : (
              inquiryList.map((q) => (
                <div key={q.id} className="mypage-card">
                  <div className="mypage-card-head">
                    <div className="mypage-card-title">
                      <span className="mypage-card-mini">Title</span>
                      <strong className="mypage-card-strong">{q.title}</strong>
                    </div>

                    <span className={q.status ? "mypage-badge is-completed" : "mypage-badge is-wait"}>
                      {getInquiryBadge(q.status)}
                    </span>
                  </div>

                  <div className="mypage-card-body">
                    <div className="mypage-content">{q.content}</div>

                    <div className="mypage-img-wrap">
                      <img
                        className="mypage-img"
                        src={q.qnaImg}
                        alt="inquiry"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>

                    {/* res(답변) 있으면 노출 (DB에서 아직 null일 수 있음) */}
                    {q.res !== null && (
                      <div className="mypage-answer">
                        <div className="mypage-answer-k">Answer</div>
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
    </div>
  );
}
