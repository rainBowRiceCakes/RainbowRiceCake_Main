// src/components/rider/mypage/profile/ProfileEdit.jsx
import { updateProfileThunk } from "../../../../store/thunks/profile/updateProfileThunk.js";
import { getProfileThunk } from "../../../../store/thunks/profile/getProfileThunk.js";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Modal from "../../../common/Modal.jsx";
import "./ProfileEdit.css";

function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.2217 3.33331C17.7946 2.76041 18.5911 2.42187 19.4282 2.42187C20.2653 2.42187 21.0618 2.76041 21.6347 3.33331C22.2076 3.90621 22.5462 4.70273 22.5462 5.53982C22.5462 6.37691 22.2076 7.17343 21.6347 7.74633L8.23926 21.1418L2.42188 22.5781L3.85817 16.7607L17.2217 3.33331Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const policyContents = {
  "이용약관": "이용약관 내용입니다...",
  "위치기반서비스 이용약관": "위치기반서비스 이용약관 내용입니다...",
  "개인정보처리방침": "개인정보처리방침 내용입니다...",
  "운영정책": "운영정책 내용입니다...",
};

export default function ProfileEdit() {
  const dispatch = useDispatch();

  const { profileData, isLoading } = useSelector((state) => state.profile);

  const [modalContent, setModalContent] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({ value: '' });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
  });

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      setProfile({
        ...profileData,
        name: profileData.rider_user?.name || "",
        email: profileData.rider_user?.email || "",
      });
    }
  }, [profileData]);

  const handleEdit = (field) => {
    setFormData({ value: profile[field] || '' });
    setEditingField(field);
  };

  const handlePolicyClick = (title) => {
    setModalContent({
      title: title,
      content: policyContents[title] || "내용을 불러올 수 없습니다."
    });
  };

  const handleSave = async () => {
    if (!editingField) return;

    const payload = {
      // 현재 수정 중인 값과 기존 값을 조합
      phone: editingField === 'phone' ? formData.value : profile.phone,
      address: editingField === 'address' ? formData.value : profile.address,
    };

    try {
      await dispatch(updateProfileThunk(payload)).unwrap();

      setProfile(prev => ({ ...prev, [editingField]: formData.value }));
      setEditingField(null);
      alert("정보가 수정되었습니다.");
    } catch (error) {
      alert(error.message || "수정 중 오류가 발생했습니다.");
    }
  };

  const renderEditableField = (field, label) => {
    const isEditing = editingField === field;
    return (
      <div className="pe-field">
        <label className="pe-label">{label}</label>
        {isEditing ? (
          <div className="pe-edit-container">
            <input
              className="pe-input"
              value={formData.value}
              onChange={(e) => setFormData({ value: e.target.value })}
              autoFocus
              disabled={isLoading}
            />
            <div className="pe-field-actions">
              <button onClick={() => setEditingField(null)} className="pe-save-btn" disabled={isLoading}>취소</button>
              <button onClick={handleSave} className="pe-save-btn" disabled={isLoading}>
                {isLoading ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        ) : (
          <div className="pe-value-group">
            <p className="pe-value">{profile[field] || "미등록"}</p>
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
            <img src={"/default.png"} alt="Rider profile" className="pe-avatar-img" />
            <button className="pe-edit-avatar-btn">
              <EditIcon />
            </button>
          </div>
        </div>

        <div className="pe-card">
          <div className="pe-field">
            <label className="pe-label">이름(기사)</label>
            <p className="pe-value">{profile.name}</p>
          </div>

          {renderEditableField("phone", "핸드폰 번호")}

          <div className="pe-field">
            <label className="pe-label">이메일</label>
            <p className="pe-value">{profile.email}</p>
          </div>

          {renderEditableField("address", "활동 지역/주소")}
          <p className="pe-warning">⚠️ 주소 변경 시 산재보험 등 정보가 갱신됩니다.</p>
        </div>

        <div className="pe-card">
          <h3 className="pe-section-title">정산 계좌 정보</h3>
          <div className="pe-field">
            <label className="pe-label">은행</label>
            <p className="pe-value">{profile.bankName || "정보 없음"}</p>
          </div>
          <div className="pe-field">
            <label className="pe-label">계좌번호</label>
            <p className="pe-value">{profile.accountNumber || "정보 없음"}</p>
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