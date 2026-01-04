/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지, 내 문의/배송 내역 조회
 * 251217 v1.0.0 sara init
 * 260103 v2.0.0 sara - question history feature
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../../../context/LanguageContext";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import { orderIndexThunk } from "../../../store/thunks/orders/orderIndexThunk.js";
import { getMyQuestionsThunk } from "../../../store/thunks/questions/getMyQuestionsThunk.js";
import { setAllOrders } from "../../../store/slices/ordersSlice.js";
import { clearQuestions } from "../../../store/slices/questionsSlice.js";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(localStorage.getItem('myPageActiveTab') || 'delivery');

  // Redux state
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { allOrders } = useSelector((state) => state.orders);
  const { questions, loading: questionsLoading } = useSelector((state) => state.questions);

  // Persist active tab to localStorage
  useEffect(() => {
    localStorage.setItem('myPageActiveTab', activeTab);
  }, [activeTab]);

  // Fetch data based on the active tab
  useEffect(() => {
    if (!isLoggedIn) return; // Only check isLoggedIn here. ProtectedRouter ensures user is available.

    // If user object is not yet fully populated, wait for next render cycle.
    // This handles potential race conditions where isLoggedIn is true but user details are still loading.
    if (isLoggedIn && !user) return; 

    if (activeTab === "delivery") {
      dispatch(orderIndexThunk({ userId: user?.id, role: "COM" })) // Safely access user.id
        .unwrap()
        .then((res) => {
          const list = Array.isArray(res?.data) ? res.data : [];
          dispatch(setAllOrders(list));
        })
        .catch((error) => {
          console.error("Failed to fetch orders:", error);
          dispatch(setAllOrders([]));
        });
    } else if (activeTab === "question") {
      dispatch(getMyQuestionsThunk()); // getMyQuestionsThunk likely handles user ID internally or via token.
    }

    // Cleanup function to clear data when component unmounts or tab changes
    return () => {
      if (activeTab === "question") {
        dispatch(clearQuestions());
      }
      // Consider adding clearAllOrders if necessary when tab changes from delivery
    };
  }, [isLoggedIn, activeTab, dispatch, user]); // Added user back to deps to ensure re-fetch when user object fully loads

  // Render non-authenticated view
  if (!isLoggedIn) {
    return (
      <div className="mypage-frame mypage-frame--unauth">
        <div className="mypage-lock-box">
          <div className="mypage-lock-icon">🔒</div>
          <h2 className="mypage-lock-title">{t("myPageLoginRequired")}</h2>
          <button className="mypage-login-btn" onClick={() => navigate("/login")}>
            {t("myPageLogin")}
          </button>
        </div>
      </div>
    );
  }

  // Render authenticated view
  return (
    <div className="mypage-frame mypage-frame--auth">
      <div className="mypage-profile-card">
        <div className="mypage-profile-circle">👤</div>
        <div>
          <div className="mypage-user-name">{user?.name || t("myPageUserName")}</div>
          <div className="mypage-user-email">{user?.email || t("myPageUserEmail")}</div>
        </div>
      </div>

      <div className="mypage-tab-nav">
        <button className={activeTab === "delivery" ? "is-active" : ""} onClick={() => setActiveTab("delivery")}>
          {t("myDeliveryHistory")}
        </button>
        <button className={activeTab === "question" ? "is-active" : ""} onClick={() => setActiveTab("question")}>
          {t("myQuestionHistory")}
        </button>
      </div>

      <div className="mypage-tab-content">
        {activeTab === "delivery" ? (
          <div className="mypage-history-list">
            {allOrders.length > 0 ? (
              allOrders.map((order) => {
                const isCompleted = order.status === ORDER_STATUS.COMPLETED;
                return (
                  <div key={order.id} className="mypage-order-card">
                    <div className="order-card-header">
                      <span className="order-no">No. {order.id}</span>
                      <span className={`status-badge ${isCompleted ? "is-completed" : "is-pending"}`}>
                        {isCompleted ? "✓ " : ""}
                        {t(`orderStatus.${order.status}`)}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <strong className="order-name">{order.name || "-"}</strong>
                      <span className="order-price">
                        {typeof order.price === "number" ? order.price.toLocaleString() : "-"}원
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-msg">{t("noDeliveryHistory")}</div>
            )}
          </div>
        ) : (
          <div className="mypage-history-list">
            {questionsLoading ? (
              <div className="empty-msg">Loading...</div>
            ) : questions.length > 0 ? (
              questions.map((q) => {
                let imageUrl = null;
                if (q.qnaImg) {
                  try {
                    const imgData = JSON.parse(q.qnaImg);
                    imageUrl = imgData.url || q.qnaImg;
                  } catch (e) {
                    imageUrl = q.qnaImg;
                  }
                }
                console.log('Question:', q);
                console.log('q.qnaImg:', q.qnaImg);
                console.log('Parsed imageUrl:', imageUrl);

                return (
                  <div key={q.id} className="mypage-question-card">
                    <div className="question-card-header">
                      <span className="question-title">{q.title}</span>
                      <span className={`status-badge ${q.isAnswered ? "is-completed" : "is-pending"}`}>
                        {q.isAnswered ? t('questionAnswered') : t('questionPending')}
                      </span>
                    </div>
                    <div className="question-card-body">
                      <p className="question-content">{q.content}</p>
                      {imageUrl && <img src={imageUrl} alt="Question attachment" className="question-image" />}
                    </div>
                    {q.isAnswered && q.answer && (
                      <div className="question-card-footer">
                        <p className="question-answer">{q.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="empty-msg">{t("noQuestionHistory")}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
