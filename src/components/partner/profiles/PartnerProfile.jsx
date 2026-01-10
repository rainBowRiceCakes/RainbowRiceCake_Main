import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileThunk } from '../../../store/thunks/profile/updateProfileThunk.js';
import { getProfileThunk } from '../../../store/thunks/profile/getProfileThunk.js';
import PartnerPolicyModal from './PartnerPolicyModal.jsx';
import './PartnerProfile.css';

const PartnerProfile = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.profileData);
  const isLoading = useSelector((state) => state.profile.isLoading);
  const error = useSelector((state) => state.profile.error);
  const user = useSelector((state) => state.auth?.user);

  const [isEditing, setIsEditing] = useState(false);
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ manager: "", phone: "" });

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (profile && !isEditing) {
      setManager(profile.manager || "");
      setPhone(profile.phone || "");
      setFieldErrors({ manager: "", phone: "" }); // 수정 모드 아닐 때 에러 초기화
    }
  }, [profile, isEditing]);

  // 연락처 하이픈 자동 삽입 함수
  const formatPhoneNumber = (value) => {
    const rawValue = value.replace(/[^0-9]/g, ""); // 숫자만 남김
    if (rawValue.length <= 3) return rawValue;
    if (rawValue.length <= 7) return `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    if (rawValue.length <= 11) return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7)}`;
    return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
  };

  const handleManagerChange = (e) => {
    setManager(e.target.value);
    if (fieldErrors.manager) setFieldErrors({ ...fieldErrors, manager: "" });
  };

  // 취소 버튼 핸들러: 수정한 내용을 버리고 서버 데이터로 복구
  const handleCancel = () => {
    if (profile) {
      setManager(profile.manager || "");
      setPhone(profile.phone || "");
    }
    setFieldErrors({ manager: "", phone: "" });
    setIsEditing(false);
  };

  // 프론트엔드 유효성 검사 (백엔드 규칙 반영)
  const validate = () => {
    const errors = { manager: "", phone: "" };
    const managerRegex = /^[a-zA-Z0-9가-힣 ]{2,50}$/;
    const phoneRegex = /^(01[016789]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/;

    if (!manager.trim()) {
      errors.manager = "담당자 이름은 필수 항목입니다.";
    } else if (!managerRegex.test(manager)) {
      errors.manager = "한글, 영문, 숫자 조합으로 2~50자 사이로 입력해주세요.";
    }

    if (phone && !phoneRegex.test(phone)) {
      errors.phone = "올바른 전화번호 형식이어야 합니다. (예: 010-1234-5678)";
    }

    setFieldErrors(errors);
    return !errors.manager && !errors.phone;
  };

  const handleSave = async () => {
    if (!profile) return;
    if (!validate()) return; // 유효성 검증 실패 시 중단

    try {
      const updatedProfile = await dispatch(updateProfileThunk({
        manager,
        phone,
        userType: user?.role || 'PTN'
      })).unwrap();

      setManager(updatedProfile.manager || "");
      setPhone(updatedProfile.phone || "");
      setIsEditing(false);
      alert("매장 정보가 성공적으로 수정되었습니다.");
      dispatch(getProfileThunk());
    } catch (err) {
      alert(err?.msg || err || "수정에 실패했습니다.");
    }
  };

  if (isLoading) return <div className="loading_box">로딩 중...</div>;
  if (error) return <div className="error_box">오류: {error?.msg || "알 수 없는 오류"}</div>;

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

          <div className="profile_action_buttons">
            {isEditing ? (
              <>
                <button className="cancel_btn" onClick={handleCancel}>취소</button>
                <button className="edit_toggle_btn save" onClick={handleSave}>저장</button>
              </>
            ) : (
              <button className="edit_toggle_btn" onClick={() => setIsEditing(true)}>수정</button>
            )}
          </div>
        </div>

        <div className="info_grid">
          <div className="info_item">
            <label>매니저 이름</label>
            <input
              type="text"
              value={manager}
              onChange={handleManagerChange}
              readOnly={!isEditing}
              className={`${isEditing ? "editable_input" : "readonly_input"} ${fieldErrors.manager ? "error_input" : ""}`}
            />
            {fieldErrors.manager && <span className="field_error_text">{fieldErrors.manager}</span>}
          </div>

          <div className="info_item">
            <label>연락처</label>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              readOnly={!isEditing}
              className={`${isEditing ? "editable_input" : "readonly_input"} ${fieldErrors.phone ? "error_input" : ""}`}
            />
            {fieldErrors.phone && <span className="field_error_text">{fieldErrors.phone}</span>}
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

export default PartnerProfile;