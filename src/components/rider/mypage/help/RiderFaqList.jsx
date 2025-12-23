// src/components/rider/mypage/help/RiderFaqList.jsx
import "./RiderFaqList.css";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyFaq } from "../../../../data/dummyFaq.js";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="faq-item">
      <button className="faq-question-btn" onClick={onToggle}>
        <span className="faq-question-text">{item.question}</span>
        <span className={`faq-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <div className="faq-answer-content">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function RiderFaqList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [openFaqId, setOpenFaqId] = useState(null);

  const categories = useMemo(() => 
    ["전체", ...new Set(dummyFaq.map(item => item.category))]
  , []);

  const filteredFaq = useMemo(() => {
    if (activeCategory === "전체") {
      return dummyFaq;
    }
    return dummyFaq.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const handleTabClick = (category) => {
    setActiveCategory(category);
    setOpenFaqId(null); // 카테고리 변경 시 열려있는 질문 닫기
  };

  const handleFaqToggle = (id) => {
    setOpenFaqId(prevId => (prevId === id ? null : id));
  };

  const handleNavigateToIssueReport = () => {
    navigate(`/rider/${id}/mypage/issue`);
  };

  return (
    <div className="faq-container">
      <div className="faq-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`faq-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleTabClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFaq.map(item => (
          <FaqItem
            key={item.id}
            item={item}
            isOpen={openFaqId === item.id}
            onToggle={() => handleFaqToggle(item.id)}
          />
        ))}
        </div>
        <div className="faq-report-container">
        <button className="faq-report-btn" onClick={handleNavigateToIssueReport}>
          이슈 신고 하기
        </button>
        </div>
    </div>
  );
}
