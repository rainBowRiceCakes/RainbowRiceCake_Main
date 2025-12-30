import { useState } from 'react';
import './PartnerFaqList.css';
import { useNavigate } from 'react-router-dom';

const PartnerFaqPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "배송 요청",
      question: "배송 요청은 몇 시까지 가능한가요?",
      answer: "RC 서비스의 기본 운영 시간은 오전 09:00부터 오후 22:00까지입니다. 다만, 호텔 및 지역별 상황에 따라 연장 운영될 수 있으니 상세 공지사항을 확인해 주세요."
    },
    {
      category: "기사/배송",
      question: "기사 배정이 너무 지연될 때는 어떻게 하나요?",
      answer: "우천 시나 피크 시간대에는 배정이 다소 늦어질 수 있습니다. 15분 이상 배정이 안 될 경우 '이슈 신고하기' 버튼을 통해 고객센터로 실시간 문의를 주시면 빠른 배정을 도와드립니다."
    },
    {
      category: "취소/환불",
      question: "주문 취소 시 수수료가 발생하나요?",
      answer: "기사가 매칭되기 전 취소는 100% 무료입니다. 하지만 기사가 이미 매칭되어 매장으로 이동 중인 경우 배차 취소 수수료가 발생할 수 있습니다."
    },
    {
      category: "시스템",
      question: "프린터 출력 설정은 어디서 하나요?",
      answer: "마이페이지 > 하드웨어 설정 메뉴에서 영수증 프린터 및 블루투스 기기를 연결하고 테스트 인쇄를 진행할 수 있습니다."
    },
    {
      category: "정산",
      question: "정산 내역은 언제 확정되나요?",
      answer: "전일 배송 완료 건에 대한 정산은 익일 오전 10시에 확정되며, 매월 말일 일괄 정산되어 등록하신 계좌로 입금됩니다."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq_page">
      <div className="faq_header">
        <h2 className="faq_title">자주 묻는 질문</h2>
        <p className="faq_subtitle">매장 운영과 배송 서비스에 대해 궁금한 점을 확인하세요.</p>
      </div>

      <div className="faq_container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq_item ${openIndex === index ? 'active' : ''}`}>
            <div className="faq_question" onClick={() => toggleFaq(index)}>
              <span className="faq_cat_badge">{faq.category}</span>
              <span className="faq_q_text">{faq.question}</span>
              <span className="faq_arrow">{openIndex === index ? '▲' : '▼'}</span>
            </div>

            <div className={`faq_answer ${openIndex === index ? 'show' : ''}`}>
              <div className="faq_a_inner">
                <span className="faq_a_icon">A.</span>
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 이슈 신고 및 1:1 문의 버튼 섹션 */}
      <div className="faq_footer">
        <div className="support_box">
          <p>원하는 답변을 찾지 못하셨나요?</p>
          <div className="support_btn_group">
            <button
              className="btn_report"
              onClick={() => navigate('/partner/help/questions')}
            >⚠️ 이슈 신고하기</button>
            {/*TODO <button className="btn_contact">💬 1:1 문의하기</button> */}
            {/* 문의 내역 리스트 페이지도 같이 구성해야 할까..? 아우 짜증나^^ */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerFaqPage;