// src/components/rider/mypage/profile/ProfileEdit.jsx
import { updateProfileThunk } from "../../../../store/thunks/profile/updateProfileThunk.js";
import { getProfileThunk } from "../../../../store/thunks/profile/getProfileThunk.js";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import DaumPostcode from 'react-daum-postcode';
import Modal from "../../../common/Modal.jsx";
import "./ProfileEdit.css";

const policyContents = {
  "이용약관": "이용약관 내용입니다...",
  "위치기반서비스 이용약관": "위치기반서비스 이용약관 내용입니다...",
  "개인정보처리방침": "개인정보처리방침 내용입니다...",
  "운영정책": "운영정책 내용입니다...",
};

// 유효성 검사 상수 (백엔드와 동일하게 유지)
const REGEX = {
  PHONE: /^(01[016789]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/,
  // 주소: 한글, 영어, 숫자, 공백, 하이픈 허용 (2~100자)
  ADDRESS: /^[a-zA-Z0-9가-힣\s-]{2,100}$/
};

// 전화번호 자동 하이픈 포맷터
const formatPhone = (value) => {
  const nums = value.replace(/[^0-9]/g, ""); // 숫자만 남기기
  if (nums.length <= 3) return nums;
  if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  // 10자리(02-XXX-XXXX) 또는 11자리(010-XXXX-XXXX) 대응
  if (nums.length <= 11) {
    return nums.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  }
  return nums.slice(0, 11).replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
};

// 에러 메시지 판단 함수
const getValidationError = (field, value) => {
  const trimmedValue = value.trim();
  if (field === "phone") {
    if (!trimmedValue) return null; // 백엔드 optional 대응
    return REGEX.PHONE.test(trimmedValue) ? null : "형식이 올바르지 않습니다. (예: 010-1234-5678)";
  }
  if (field === "address") {
    if (!trimmedValue) return "주소는 필수 항목입니다.";
    return REGEX.ADDRESS.test(trimmedValue) ? null : "한글, 영어, 숫자, '-'만 2~100자 가능합니다.";
  }
  return null;
};

// ------------------------------------------------------------------- 프로필 수정 컴포넌트 시작
export default function ProfileEdit() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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
    if (!profileData) { // 데이터가 없을 때만 호출
      dispatch(getProfileThunk());
    }
  }, [dispatch, profileData]);

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
    setError(null); // 수정 시작 시 에러 초기화
    setEditingField(field);
  };

  const handlePolicyClick = (title) => {
    setModalContent({
      title: title,
      content: policyContents[title] || "내용을 불러올 수 없습니다."
    });
  };

  const handleInputChange = (e) => {
    let val = e.target.value;

    // 1. 휴대폰 번호일 경우 자동 하이픈 적용
    if (editingField === "phone") {
      val = formatPhone(val);
    }

    setFormData({ value: val });

    // 2. 실시간 검증 (인라인 피드백을 위해 에러 상태 업데이트)
    const errorMsg = getValidationError(editingField, val);
    setError(errorMsg);
  };

  const handleSave = async () => {
    // 저장 버튼 클릭 시 최종 검증
    const finalError = getValidationError(editingField, formData.value);
    if (finalError) {
      setError(finalError);
      return;
    }

    const payload = {
      phone: editingField === 'phone' ? formData.value : profile.phone,
      address: editingField === 'address' ? formData.value : profile.address,
    };

    try {
      await dispatch(updateProfileThunk(payload)).unwrap();
      setProfile(prev => ({ ...prev, [editingField]: formData.value }));
      setEditingField(null);
      // 성공 시 alert은 좋지만, 에러는 인라인으로 주는 게 정석입니다.
      alert("정보가 수정되었습니다.");
    } catch (err) {
      // 서버에서 날아온 에러 처리 (예: 이미 존재하는 번호 등)
      setError(err.message || "수정 중 오류가 발생했습니다.");
    }
  };

  // 주소 선택 완료 시 실행될 함수
  const handleAddressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    // 백엔드 정규식(/^[a-zA-Z0-9가-힣\s-]{2,100}$/)에 맞게 가공
    // 특수문자 () 등을 백엔드가 허용하지 않는다면 제거 로직이 필요할 수 있습니다.
    const cleanAddress = fullAddress.replace(/[()]/g, "");

    setFormData({ value: cleanAddress });
    setError(getValidationError('address', cleanAddress)); // 실시간 유효성 체크
    setIsAddressModalOpen(false); // 검색창 닫기
  };

  const renderEditableField = (field, label) => {
    const isEditing = editingField === field;

    // -----------------------------------------------------------------------리턴!
    return (
      <div className="pe-field">
        <label className="pe-label">{label}</label>
        {isEditing ? (
          /* 1. 수정 모드 (isEditing === true) */
          <div className="pe-edit-container">
            {field === 'address' ? (
              <div className="pe-address-input-group">
                <input
                  className={`pe-input ${error ? 'is-invalid' : ''}`}
                  value={formData.value}
                  readOnly
                  onFocus={() => setIsAddressModalOpen(true)}
                  onClick={() => setIsAddressModalOpen(true)}
                  placeholder="주소 검색을 이용해주세요."
                />
                <button
                  type="button"
                  className="pe-address-search-btn"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  주소 검색
                </button>
              </div>
            ) : (
              <input
                className={`pe-input ${error ? 'is-invalid' : ''}`}
                value={formData.value}
                onChange={handleInputChange}
                autoFocus
                disabled={isLoading}
              />
            )}

            {/* 인라인 에러 메시지 */}
            {error && <p className="pe-error-message">{error}</p>}

            <div className="pe-field-actions">
              <button
                type="button"
                onClick={() => { setEditingField(null); setError(null); }}
                className="pe-cancel-btn"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="pe-save-btn"
                disabled={isLoading || !!error}
              >
                {isLoading ? "저장 중..." : "저장"}
              </button>
            </div>

            {/* 주소 검색 모달은 수정 모드 안에서 띄움 */}
            {field === 'address' && isAddressModalOpen && (
              <Modal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                title="주소 검색"
              >
                <DaumPostcode onComplete={handleAddressComplete} autoClose={false} />
              </Modal>
            )}
          </div>
        ) : (
          /* 2. 일반 보기 모드 (isEditing === false) */
          <div className="pe-value-group">
            <p className="pe-value">{profile[field] || "미등록"}</p>
            <button
              type="button"
              className="pe-edit-btn"
              onClick={() => handleEdit(field)}
            >
              수정
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="pe-container">
        <div className="pe-card">
          <div className="pe-field">
            <label className="pe-label">이름(기사)</label>
            <p className="pe-value">{profile?.name || ""}</p>
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
          <h3 className="pe-section-title">정산 계좌 정보 <span className="pe-section-title-text">(수정을 원하시면 관리자에게 문의해주세요.)</span></h3>
          <div className="pe-field">
            <label className="pe-label">은행</label>
            <p className="pe-value">{profile.bank || "정보 없음"}</p>
          </div>
          <div className="pe-field">
            <label className="pe-label">계좌번호</label>
            <p className="pe-value">{profile.bankNum || "정보 없음"}</p>
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