import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileThunk } from '../../../store/thunks/profile/updateProfileThunk.js';
import { getProfileThunk } from '../../../store/thunks/profile/getProfileThunk.js';
import PartnerPolicyModal from './PartnerPolicyModal.jsx';
import './PartnerProfile.css';

const PartnerMyPage = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.profileData);
  const isLoading = useSelector((state) => state.profile.isLoading);
  const error = useSelector((state) => state.profile.error);
  const user = useSelector((state) => state.auth?.user);

  const [isEditing, setIsEditing] = useState(false);
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 마운트 시 프로필 가져오기
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // 프로필 데이터 동기화
  useEffect(() => {
    if (profile && !isEditing) {
      setManager(profile.manager || "");
      setPhone(profile.phone || "");
    }
  }, [profile, isEditing]);

  const handleSave = async () => {
    if (!profile) return;

    try {
      const updatedProfile = await dispatch(updateProfileThunk({
        manager,
        phone,
        userType: user?.role || 'PTN'
      })).unwrap();

      // 수정된 데이터로 상태 동기화
      setManager(updatedProfile.manager || "");
      setPhone(updatedProfile.phone || "");

      setIsEditing(false);
      alert("매장 정보가 성공적으로 수정되었습니다.");

      // 필요 시 전체 프로필 다시 불러오기
      dispatch(getProfileThunk());
    } catch (err) {
      alert(err?.msg || err || "수정에 실패했습니다.");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error?.msg || "알 수 없는 오류"}</div>;

  return (
    <div className="mypage_container">
      <h2 className="page_title">마이페이지</h2>

      <section className="profile_card">
        <div className="store_info_header">
          <div className="store_icon">🏪</div>
          <div className="store_name_block">
            <h3 className="store_name">{profile?.krName || "매장 정보 로딩 중..."}</h3>
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
            <label>매니저 이름</label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? "editable_input" : "readonly_input"}
            />
          </div>
          <div className="info_item">
            <label>연락처</label>
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
            <input type="text" value={profile?.partner_user?.email || ""} readOnly className="readonly_input" />
          </div>
          <div className="info_item full_width">
            <label>매장 주소</label>
            <input type="text" value={profile?.address || ""} readOnly className="readonly_input" />
          </div>
        </div>
      </section>

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