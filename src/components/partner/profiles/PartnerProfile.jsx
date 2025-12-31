import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileThunk } from '../../../store/thunks/profile/updateProfileThunk.js';
import PartnerPolicyModal from './PartnerPolicyModal.jsx';
import './PartnerProfile.css';

const PartnerMyPage = () => {
  const dispatch = useDispatch();

  // 1. partnerSlice에서 profile 정보 가져오기
  const profile = useSelector((state) => state.partner?.profile);
  // 신고자 유형(PTN) 등을 위해 auth 정보도 필요할 수 있음
  const user = useSelector((state) => state.auth?.user);

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. 스토어의 profile 정보가 변경될 때마다 입력 필드 동기화
  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    try {
      // 3. 공통 Thunk 호출 (userType을 함께 전달하여 엔드포인트 구분)
      await dispatch(updateProfileThunk({
        phone,
        address,
        userType: user?.role || 'PTN'
      })).unwrap();

      setIsEditing(false);
      alert("매장 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      alert(error || "수정에 실패했습니다.");
    }
  };

  return (
    <div className="mypage_container">
      <h2 className="page_title">마이페이지</h2>

      <section className="profile_card">
        <div className="store_info_header">
          <div className="store_icon">🏪</div>
          <div className="store_name_block">
            {/* 프로필 데이터 노출 */}
            <h3 className="store_name">{profile?.storeName || "매장 정보 로딩 중..."}</h3>
            <p className="store_address_display">{profile?.address}</p>
          </div>
          <button
            className={`edit_toggle_btn ${isEditing ? 'save' : ''}`}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "저장하기" : "수정하기"}
          </button>
        </div>

        <div className="info_grid">
          <div className="info_item">
            <label>점주 이름</label>
            {/* 수정 불가 항목 */}
            <input type="text" value={profile?.ownerName || ""} readOnly className="readonly_input" />
          </div>
          <div className="info_item">
            <label>연락처</label>
            {/* 수정 가능 항목 */}
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? "editable_input" : "readonly_input"}
            />
          </div>
          <div className="info_item">
            <label>이메일</label>
            {/* 수정 불가 항목 */}
            <input type="text" value={profile?.email || ""} readOnly className="readonly_input" />
          </div>
          <div className="info_item full_width">
            <label>매장 주소</label>
            {/* 수정 가능 항목 */}
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? "editable_input" : "readonly_input"}
            />
          </div>
        </div>
      </section>

      {/* 알림 설정 및 약관 링크 영역 (기존 코드와 동일) */}
      <section className="settings_section">
        <h4>알림 설정</h4>
        <div className="settings_grid">
          <div className="setting_toggle_item">
            <div className="setting_text">
              <strong>배송 및 정산</strong>
              <span>배송 상태, 정산 완료 등의 업데이트 알림</span>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </section>

      <section className="policy_links_section">
        <div className="policy_link_item" onClick={() => setIsModalOpen(true)}>
          <span>서비스 이용 약관 및 개인정보 처리방침</span>
          <span className="arrow">›</span>
        </div>
      </section>

      <PartnerPolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="개인정보처리방침"
        content="매장 서비스 이용을 위한 약관 본문 내용..."
      />
    </div>
  );
};

export default PartnerMyPage;