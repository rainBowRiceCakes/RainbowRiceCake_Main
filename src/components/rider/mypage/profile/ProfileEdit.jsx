// src/components/rider/mypage/profile/ProfileEdit.jsx
import { useState } from "react";
import "./ProfileEdit.css";
import Modal from "../../../common/Modal";

// A simple pencil icon component for the edit button
function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.2217 3.33331C17.7946 2.76041 18.5911 2.42187 19.4282 2.42187C20.2653 2.42187 21.0618 2.76041 21.6347 3.33331C22.2076 3.90621 22.5462 4.70273 22.5462 5.53982C22.5462 6.37691 22.2076 7.17343 21.6347 7.74633L8.23926 21.1418L2.42188 22.5781L3.85817 16.7607L17.2217 3.33331Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Dummy content for policies
const policyContents = {
  "이용약관": "이용약관 내용입니다. 서비스 이용에 감사드립니다...",
  "위치기반서비스 이용약관": "위치기반서비스 이용약관 내용입니다. 사용자의 위치 정보는 서비스 제공을 위해서만 사용됩니다...",
  "개인정보처리방침": "개인정보처리방침 내용입니다. 사용자의 정보는 안전하게 관리됩니다...",
  "운영정책": "운영정책 내용입니다. 공정한 서비스 운영을 위해 최선을 다하겠습니다...",
};

export default function ProfileEdit() {
  const [modalContent, setModalContent] = useState(null);
  const [editingField, setEditingField] = useState(null); // null, 'phone', or 'address'

  const [profile, setProfile] = useState({
    name: "김민재",
    phone: "+82 10-0000-0000",
    email: "minjae1004@gmail.com",
    address: "대구 남구 어쩌구 저쩌구",
    bankName: "신한은행",
    accountNumber: "123-123-123456",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  });

  const [formData, setFormData] = useState({ value: '' });

  const handlePolicyClick = (title) => {
    setModalContent({
      title: title,
      content: policyContents[title] || "내용을 불러올 수 없습니다."
    });
  };

  const handleEdit = (field) => {
    setFormData({ value: profile[field] });
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleSave = () => {
    if (!editingField) return;
    setProfile(prevProfile => ({ ...prevProfile, [editingField]: formData.value }));
    setEditingField(null);
  };

  const handleFormChange = (e) => {
    setFormData({ value: e.target.value });
  };

  const renderField = (field, label) => {
    const isCurrentlyEditing = editingField === field;

    return (
      <div className="pe-field">
        <label className="pe-label">{label}</label>
        {isCurrentlyEditing ? (
          <div>
            <input
              type={field === 'phone' ? 'tel' : 'text'}
              name={field}
              className="pe-input"
              value={formData.value}
              onChange={handleFormChange}
              autoFocus
            />
            <div className="pe-field-actions">
              <button className="pe-cancel-btn" onClick={handleCancel}>취소</button>
              <button className="pe-save-btn" onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <div className="pe-value-group">
            <p className="pe-value">{profile[field]}</p>
            <button className="pe-edit-btn" onClick={() => handleEdit(field)}>수정</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="pe-container">
        <div className="pe-avatar-section">
          <div className="pe-avatar-wrapper">
            <img src={profile.avatarUrl} alt="Rider profile" className="pe-avatar-img" />
            <button className="pe-edit-avatar-btn" aria-label="Edit profile picture">
              <EditIcon />
            </button>
          </div>
        </div>

        <div className="pe-card">
          <div className="pe-field">
            <label className="pe-label">이름</label>
            <p className="pe-value">{profile.name}</p>
          </div>
          {renderField("phone", "핸드폰 번호")}
          <div className="pe-field">
            <label className="pe-label">이메일</label>
            <p className="pe-value">{profile.email}</p>
          </div>
          <div className="pe-field">
            {/* We render the address field slightly differently due to the warning */}
            <label className="pe-label">주소</label>
            {editingField === 'address' ? (
              <div>
                <input
                  type="text"
                  name="address"
                  className="pe-input"
                  value={formData.value}
                  onChange={handleFormChange}
                  autoFocus
                />
                <div className="pe-field-actions">
                  <button className="pe-cancel-btn" onClick={handleCancel}>취소</button>
                  <button className="pe-save-btn" onClick={handleSave}>저장</button>
                </div>
              </div>
            ) : (
              <div className="pe-value-group">
                <p className="pe-value">{profile.address}</p>
                <button className="pe-edit-btn" onClick={() => handleEdit('address')}>수정</button>
              </div>
            )}
            <p className="pe-warning">
              <span className="pe-warning-icon">⚠️</span>
              주소 변경 시 보험 정보가 함께 갱신됩니다.
            </p>
          </div>
        </div>

        <div className="pe-card">
          <div className="pe-field">
            <label className="pe-label">은행이름</label>
            <p className="pe-value">{profile.bankName}</p>
          </div>
          <div className="pe-field">
            <label className="pe-label">계좌번호</label>
            <p className="pe-value">{profile.accountNumber}</p>
          </div>
        </div>

        <div className="pe-card">
          {Object.keys(policyContents).map(title => (
            <button key={title} className="pe-policy-link" onClick={() => handlePolicyClick(title)}>
              <span>{title}</span>
              <span className="pe-policy-chev">›</span>
            </button>
          ))}
        </div>
      </div>

      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
          title={modalContent.title}
        >
          <p>{modalContent.content}</p>
        </Modal>
      )}
    </>
  );
}
