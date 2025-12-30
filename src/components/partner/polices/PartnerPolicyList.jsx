import { useState } from 'react';
import './PartnerPolicyList.css';

const PartnerPolicyPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const policies = [
    {
      title: "개인정보 처리방침",
      content: "RC(이하 '회사')는 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고...",
      date: "시행일자: 2025.01.01"
    },
    {
      title: "서비스 이용약관",
      content: "제1조 (목적) 이 약관은 회사가 제공하는 배송 대행 서비스의 이용 조건 및 절차를...",
      date: "시행일자: 2024.12.20"
    },
    {
      title: "취소 및 환불 규정",
      content: "배송 요청 후 기사가 매칭되기 전까지는 전액 환불이 가능하며, 픽업 이후에는...",
      date: "시행일자: 2025.01.01"
    }
  ];
  // TODO: 어드민에서 정책을 수정했을 때 점주 페이지에 바로 반영되는 연결 로직도 도와드릴까요

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="policy_page">
      <h2 className="page_title">도움말 & 정책</h2>

      <div className="policy_container">
        {policies.map((policy, index) => (
          <div key={index} className={`policy_item ${openIndex === index ? 'active' : ''}`}>
            <div className="policy_header" onClick={() => toggleAccordion(index)}>
              <div className="policy_header_left">
                <span className="policy_name">{policy.title}</span>
                <span className="policy_version">{policy.date}</span>
              </div>
              <span className="arrow_icon">{openIndex === index ? '▲' : '▼'}</span>
            </div>

            {openIndex === index && (
              <div className="policy_body">
                <div className="policy_text_content">
                  {policy.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerPolicyPage;