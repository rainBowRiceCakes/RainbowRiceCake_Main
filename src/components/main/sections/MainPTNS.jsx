/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 (카카오 주소 검색 추가)
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 * 260102 v2.1.0 sara 미리보기 사진 삭제 기능 removeFile 복구, 주소 변환 부분 searchAddressToCoords 유틸로 분리
 * 260103 v2.2.0 sara placeholder 다국어 처리, 휴지통 아이콘 컴포넌트화
 * 260106 v2.3.0 sara 카카오 플레이스 검색 기능 추가 및 폼 데이터 핸들링 방식 변경
 * 260108 v2.4.0 jun 제휴 폼 CustomAlertModal 적용
*/

import { useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData';
import { riderFormThunk, partnerFormThunk } from '../../../store/thunks/formThunk.js';
import TrashBinIcon from '../../common/icons/TrashBinIcon.jsx';
import { riderImageUploadThunk, partnerImageUploadThunk } from '../../../store/thunks/imageUploadThunk.js'; 
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { searchAddressToCoords } from '../../../utils/searchAddressToCoords.js';
import DaumPostcode from "react-daum-postcode";
import CustomAlertModal from '../../common/CustomAlertModal.jsx';
import './MainPTNS.css';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function MainPTNS() {
  const { t, lang } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // 1. 폼 데이터 상태 관리
  const [riderFormData, setRiderFormData] = useState({ riderPhone: '', riderAddress: '', bankName: '', accountNumber: '' });
  const [partnerFormData, setPartnerFormData] = useState({ managerName: '', partnerPhone: '', storeNameKr: '', storeNameEn: '', businessNumber: '', storeAddress: '' });

  // 2. 프리뷰 및 실제 파일 상태 관리
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // 3. Input 초기화를 위한 Ref
  const riderFileInputRef = useRef(null);
  const partnerFileInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const isSelectingRef = useRef(false);

  // 4. 약관 동의 및 약관 모달 상태
  const [riderAgreements, setRiderAgreements] = useState({ terms: false, privacy: false });
  const [partnerAgreements, setPartnerAgreements] = useState({ terms: false, privacy: false });
  const [activeModal, setActiveModal] = useState(null);

  // 4-1. 유효성 검사 및 에러 알림용 커스텀 모달 상태
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // 5. 카카오 주소 검색 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeSearchInput, setActiveSearchInput] = useState(null); 
  const [isRiderPostcodeOpen, setIsRiderPostcodeOpen] = useState(false);
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

  // 6. 카카오 API 로더
  const [kakaoLoading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  // 7. 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);
  
  // 8. 외부 클릭 핸들러
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 9. 카카오 플레이스 검색
  useEffect(() => {
    if (!debouncedSearchKeyword?.trim()) return;
    if (!activeSearchInput) return;
    if (kakaoLoading || isSelectingRef.current || !window.kakao?.maps?.services) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(debouncedSearchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
        setIsSearchDropdownOpen(true);
      } else {
        setSearchResults([]);
        setIsSearchDropdownOpen(false);
      }
    }, { useMapBounds: false }); 
  }, [debouncedSearchKeyword, kakaoLoading, activeSearchInput]);

  // 10. 핸들러 함수들
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    const setter = formType === 'rider' ? setRiderFormData : setPartnerFormData;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = (e, formType) => {
    const { name, value } = e.target;
    const setter = formType === 'rider' ? setRiderFormData : setPartnerFormData;
    setter(prev => ({ ...prev, [name]: value }));
    setSearchKeyword(value);
    setActiveSearchInput(name);
  };
  
  const handleSelectPlace = (place) => {
    isSelectingRef.current = true;
    const address = place.road_address_name || place.address_name;
    const setter = activeSearchInput === 'riderAddress' ? setRiderFormData : setPartnerFormData;
    setter(prev => ({ ...prev, [activeSearchInput]: address }));
    setSearchKeyword(address);
    setIsSearchDropdownOpen(false);
    setActiveSearchInput(null);
    setTimeout(() => { isSelectingRef.current = false; }, 100);
  };
  
  const removeFile = (type) => {
    if (type === 'licenseImg') {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      setLicensePreview(null);
      setLicenseFile(null);
      if (riderFileInputRef.current) riderFileInputRef.current.value = '';
    } else if (type === 'logo') {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      setLogoFile(null);
      if (partnerFileInputRef.current) partnerFileInputRef.current.value = '';
    }
  };

  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (name === 'licenseImg') {
        setLicenseFile(file);
        setLicensePreview(objectUrl);
      } else if (name === 'storeLogo') {
        setLogoFile(file);
        setLogoPreview(objectUrl);
      }
    }
  };

  const closeAlert = () => {
    setAlertState(prev => {
      if (prev.onConfirm) prev.onConfirm();
      return { ...prev, isOpen: false, onConfirm: null };
    });
  };

  const openModal = (target, type) => {
    if (!isLoggedIn) {
      setAlertState({ isOpen: true, title: '로그인 필요', message: t('coverLoginRequired') });
      return;
    }
    const currentAgreements = target === 'rider' ? riderAgreements : partnerAgreements;
    if (!currentAgreements[type]) {
      setActiveModal(`${target}_${type}`);
      document.body.style.overflow = 'hidden';
    } else {
      const setter = target === 'rider' ? setRiderAgreements : setPartnerAgreements;
      setter(prev => ({ ...prev, [type]: false }));
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const confirmModal = () => {
    if (activeModal) {
      const [target, type] = activeModal.split('_'); 
      const setter = target === 'rider' ? setRiderAgreements : setPartnerAgreements;
      setter(prev => ({ ...prev, [type]: true }));
      closeModal();
    }
  };
  
  const handleRiderPostcodeComplete = (data) => {
    const roadAddr = data.roadAddress || "";
    setRiderFormData((prev) => ({
      ...prev,
      riderAddress: roadAddr,
    }));
    setSearchKeyword("");
    setSearchResults([]);
    setIsSearchDropdownOpen(false);
    setActiveSearchInput(null);
    setIsRiderPostcodeOpen(false);
    document.body.style.overflow = "auto";
  };

  const openRiderPostcode = () => {
    setIsRiderPostcodeOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeRiderPostcode = () => {
    setIsRiderPostcodeOpen(false);
    document.body.style.overflow = "auto";
  };

  // 11. 폼 제출 로직 (라이더)
  const onSubmitRider = async (e) => {
    e.preventDefault();

    // [1] 로그인 & 약관 체크
    if (!isLoggedIn) {
      setAlertState({ isOpen: true, title: '로그인 필요', message: t('coverLoginRequired') });
      return navigate('/login');
    }
    if (!riderAgreements.terms || !riderAgreements.privacy) {
        setAlertState({ isOpen: true, title: '동의 필요', message: t('ptnsAgreeRequiredAlert') });
        return;
    }

    // 항목별 상세 유효성 검사
    // [라이더] 연락처
    const phoneRegex = /^(01[016789]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/;

    if (!riderFormData.riderPhone.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsPartnerPhoneInputErrorMsg'), message: t('ptnsPartnerPhoneInputError') });
      return;
    }
    if (!phoneRegex.test(riderFormData.riderPhone)) {
        setAlertState({ isOpen: true, title: t('ptnsPartnerPhoneInputErrorMsg'), message: t('ptnsInvalidPhoneAlert') });
        return;
    }

    // [라이더] 주소
    // 빈 값 체크
    if (!riderFormData.riderAddress.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsAddressInputErrorMsa'), message: t('ptnsAddressInputError') });
      return;
    }

    // [라이더] 은행명
    const bankRegex = /^[a-zA-Z가-힣]{2,10}$/;

    if (!riderFormData.bankName.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsBankNameInputErrorMsg'), message: t('ptnsBankNameInputError') });
      return;
    }
    if (!bankRegex.test(riderFormData.bankName)) {
      setAlertState({ isOpen: true, title: t('ptnsBankNameInputErrorMsg'), message: t('ptnsBankNameValidationError') });
      return;
    }

    // [라이더] 계좌번호
    const numericRegex = /^[0-9]{10,16}$/;

    if (!riderFormData.accountNumber.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsBankNumInputErrorMsg'), message: t('ptnsBankNumInputError') });
      return;
    }
    // 길이 체크
    if (riderFormData.accountNumber.length < 10 || riderFormData.accountNumber.length > 16) {
        setAlertState({ isOpen: true, title: t('ptnsBankNumInputErrorMsg'), message: t('ptnsBankNumLengthError') });
        return;
    }
    // 유효 문자 체크
    if (!numericRegex.test(riderFormData.accountNumber)) {
        setAlertState({ isOpen: true, title: t('ptnsBankNumInputErrorMsg'), message: t('ptnsInvalidAccountAlert') });
        return;
    }

    // 2-5. 파일 (운전면허증)
    if (!licenseFile) {
        setAlertState({ 
          isOpen: true, 
          title: t('ptnsImageInputErrorMsg'),
          message: t('ptnsLicenseRequiredAlert') || '운전면허증 사진을 등록해주세요.'
        });
        return;
    }

    // [3] 백엔드 전송
    try {
      let licenseImgPath = null;
      if (licenseFile) {
        const uploadResult = await dispatch(riderImageUploadThunk(licenseFile)).unwrap();
        licenseImgPath = uploadResult.data.path;
      }

      const coords = await searchAddressToCoords(riderFormData.riderAddress);
      if (!coords?.lat || !coords?.lng) {
        setAlertState({ isOpen: true, title: '주소 오류', message: t('ptnsAddressCoordsError') });
        return;
      }

      const payload = {
        phone: riderFormData.riderPhone,
        address: riderFormData.riderAddress,
        bank: riderFormData.bankName,
        bankNum: riderFormData.accountNumber,
        licenseImg: licenseImgPath,
        lat: Number(coords.lat),
        lng: Number(coords.lng),
      };

      await dispatch(riderFormThunk(payload)).unwrap();
      
      setAlertState({
        isOpen: true,
        title: t('ptnsApplicationCompletedMsg'),
        message: t('ptnsRiderApplicationCompleted'),
        onConfirm: () => navigate('/') 
      });

    } catch (error) {
      console.error("Rider Submit Error:", error);
      const backendMsg = error.msg || error.message || t('ptnsErrorAlert');
      setAlertState({ isOpen: true, title: '신청 실패', message: backendMsg, onConfirm: null });
    }
  };

  // 12. 폼 제출 로직 (파트너)
  const onSubmitPartner = async (e) => {
    e.preventDefault();

    // 로그인 & 약관 체크
    if (!isLoggedIn) {
      setAlertState({ isOpen: true, title: '로그인 필요', message: t('coverLoginRequired') });
      return navigate('/login');
    }
    if (!partnerAgreements.terms || !partnerAgreements.privacy) {
      setAlertState({ isOpen: true, title: '동의 필요', message: t('ptnsAgreeRequiredAlert') });
      return;
    }
    
    // 항목별 상세 유효성 검사
    // [파트너] 담당자명
    const managerRegex = /^[a-zA-Z0-9가-힣 ]{2,50}$/;

    if (!partnerFormData.managerName.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsManagerNameInputErrorMsg'), message: t('ptnsManagerNameInputError') });
      return;
    }
    if (!managerRegex.test(partnerFormData.managerName)) {
      setAlertState({ isOpen: true, title: t('ptnsManagerNameInputErrorMsg'), message: t('ptnsManagerNameValidationError') })
      return;
    }

    // [파트너] 연락처
    const phoneRegex = /^(01[016789]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/;

    if (!partnerFormData.partnerPhone.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsPartnerPhoneInputErrorMsg'), message: t('ptnsPartnerPhoneInputError') });
      return;
    }
    if (!phoneRegex.test(partnerFormData.partnerPhone)) {
      setAlertState({ isOpen: true, title: t('ptnsPartnerPhoneInputErrorMsg'), message: t('ptnsInvalidPhoneAlert') });
      return;
    }

    // [파트너] 상호명(한글)
    const krNameRegex = /^[가-힣\s]{2,100}$/;

    if (!partnerFormData.storeNameKr.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsBusinessNameInputErrorMsg'), message: t('ptnsBusinessKrNameInputError') });
      return;
    }
    if (!krNameRegex.test(partnerFormData.storeNameKr)) {
      setAlertState({ isOpen: true, title: t('ptnsBusinessNameInputErrorMsg'), message: t('ptnsBusinessKrNameValidationError') });
      return;
    }


    // [파트너] 상호명(영문)
    const enNameRegex = /^[a-zA-Z\s]{2,100}$/;

    if (!partnerFormData.storeNameEn.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsBusinessNameInputErrorMsg'), message: t('ptnsBusinessEnNameInputError') });
      return;
    }

    if (!enNameRegex.test(partnerFormData.storeNameEn)) {
      setAlertState({ isOpen: true, title: t('ptnsBusinessNameInputErrorMsg'), message: t('ptnsBusinessEnNameValidationError') });
      return;
    }
    
    // [파트너] 사업자번호
    const businessNumRegex = /^\d{10}$/;

    if (!partnerFormData.businessNumber.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsBusinessNumInputErrorMsg'), message: t('ptnsBusinessNumInputError') });
      return;
    }
    if (!businessNumRegex.test(partnerFormData.businessNumber)) {
      setAlertState({ isOpen: true, title: t('ptnsBusinessNumInputErrorMsg'), message: t('ptnsInvalidBusinessNumAlert') });
      return;
    }

    // [파트너] 주소
    const addressRegex = /^[가-힣a-zA-Z0-9-\s,().#]+$/;

    // 빈 값 체크
    if (!partnerFormData.storeAddress.trim()) {
      setAlertState({ isOpen: true, title: t('ptnsAddressInputErrorMsa'), message: t('ptnsAddressInputError') });
      return;
    }

    // 정규식 체크(길이 체크)
    if (partnerFormData.storeAddress.length < 2 || partnerFormData.storeAddress.length > 200) {
        setAlertState({ isOpen: true, title: t('ptnsAddressInputErrorMsa'), message: t('ptnsAddressLengthError') });
        return;
    }

    // 유효 문자 체크
    if (!addressRegex.test(partnerFormData.storeAddress)) {
      setAlertState({ isOpen: true, title: t('ptnsAddressInputErrorMsa'), message: t('ptnsAddressValidationError') });
      return;
    }

    // [파트너] 이미지 파일
    if (!logoFile) {
      setAlertState({ 
        isOpen: true, 
        title: t('ptnsImageInputErrorMsg'), 
        message: t('ptnsLogoRequiredAlert') || '매장 로고 사진을 등록해주세요.'
      });
      return;
    }

    // 백엔드 전송
    try {
      let logoImgPath = null;

      console.log(logoFile);

      if (logoFile) {
        const uploadResult = await dispatch(partnerImageUploadThunk(logoFile)).unwrap();
        logoImgPath = uploadResult.data.path;
      }

      const coords = await searchAddressToCoords(partnerFormData.storeAddress);
      if (!coords?.lat || !coords?.lng) {
        setAlertState({ isOpen: true, title: t('ptnsAddressInputErrorMsa'), message: t('ptnsAddressCoordsError') });
        return;
      }

      const payload = { 
        manager: partnerFormData.managerName,
        phone: partnerFormData.partnerPhone,
        krName: partnerFormData.storeNameKr,
        enName: partnerFormData.storeNameEn,
        businessNum: partnerFormData.businessNumber,
        address: partnerFormData.storeAddress,
        logoImg: logoImgPath, 
        lat: coords.lat, 
        lng: coords.lng,
        status: 'REQ'
      };

      await dispatch(partnerFormThunk(payload)).unwrap();
      
      setAlertState({
        isOpen: true,
        title: t('ptnsApplicationCompletedMsg'),
        message: t('ptnsPartnerApplicationCompleted'),
        onConfirm: () => navigate('/') 
      });

    } catch (error) {
      console.error("Partner Submit Error:", error);
      const backendMsg = error.msg || error.message || t('ptnsErrorAlert');
      setAlertState({ isOpen: true, title: '신청 실패', message: backendMsg, onConfirm: null });
    }
  };

  const modalType = activeModal ? activeModal.split('_')[1] : null;
  const modalContent = modalType ? footerData[lang]?.[modalType] || footerData.ko?.[modalType] : null;

  // 13. 렌더링
  return (
    <>
      <div className="mainptns-frame" id="partners">
        <div className="mainptns-container" ref={searchContainerRef}>
          <div className="mainptns-header-group">
            <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
            <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
          </div>

          <div className="mainptns-grid-layout">
            {/* 라이더 폼 */}
            <form id="rider-application-form" className={`mainptns-card-box form-section ${!isLoggedIn ? 'mainptns-disabled' : ''}`} onSubmit={onSubmitRider}>
              {!isLoggedIn && (
               <div className="mainptns-disabled-overlay">
                  <span className="mainptns-disabled-text">{t('coverLoginRequired')}</span>
                  <button type="button" className="mainptns-disabled-login-btn" onClick={() => navigate('/login')}>
                    {t('headerLogin')}
                  </button>
                </div>
                )}
                <div className="form-header-row"><h3 className="mainptns-card-title-text">{t('ptnsFormRiderTitle')}</h3></div>
                <div className="mainptns-form-fields-group">
                  <label className="mainptns-field-label">{t('ptnsPhoneLabel')}
                    <input className="mainptns-field-input" name="riderPhone" placeholder={t('ptnsRiderPhonePlaceholder')} value={riderFormData.riderPhone} onChange={(e) => handleInputChange(e, 'rider')} />
                  </label>
                  <div style={{ position: 'relative' }}>
                    <label className="mainptns-field-label">{t('ptnsAddressLabel')}
                    
                      <div className="mainptns-address-row">
                        <input
                          className="mainptns-field-input"
                          name="riderAddress"
                          placeholder={t('ptnsAddressPlaceholder')}
                          value={riderFormData.riderAddress}
                          readOnly
                          onClick={openRiderPostcode}
                        />
                        <button
                          type="button"
                          className="mainptns-address-search-btn"
                          onClick={openRiderPostcode}
                        >
                          {t('ptnsAddressSearchButton')}
                        </button>
                      </div>
                    
                    </label>
                    {isSearchDropdownOpen && activeSearchInput === 'riderAddress' && searchResults.length > 0 && (
                        <ul className="ptnssearch-dropdown-list">
                          {searchResults.map((place) => (
                            <li key={place.id} onClick={() => handleSelectPlace(place)}>
                              <div className="place-name">{place.place_name}</div>
                              <div className="place-address">{place.road_address_name || place.address_name}</div>
                            </li>
                          ))}
                        </ul>
                    )}
                  </div>
                  <label className="mainptns-field-label">{t('ptnsBankNameLabel')}
                    <input className="mainptns-field-input" name="bankName" placeholder={t('ptnsBankNamePlaceholder')} value={riderFormData.bankName} onChange={(e) => handleInputChange(e, 'rider')} />
                  </label>
                  <label className="mainptns-field-label">{t('ptnsAccountNumLabel')}
                    <input className="mainptns-field-input" name="accountNumber" placeholder={t('ptnsAccountNumPlaceholder')} value={riderFormData.accountNumber} onChange={(e) => handleInputChange(e, 'rider')} />
                  </label>
                  <div className="mainptns-field-label">
                    {t('ptnsLicenseLabel')}
                    <div style={{ marginTop: '8px', position: 'relative' }}>
                      <input type="file" onChange={changeFiles} name="licenseImg" id="licenseImg" className="mainptns-file-hidden" accept="image/*" ref={riderFileInputRef} disabled={!isLoggedIn} />
                      <label htmlFor="licenseImg" className="mainptns-file-box" style={{ backgroundImage: licensePreview ? `url("${licensePreview}")` : 'none', backgroundSize: 'contain', height: licensePreview ? '200px' : '80px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: licensePreview ? 'transparent' : '#ccc' }}>
                        {!licensePreview && (t('ptnsUploadPlaceholder'))}
                      </label>
                      {licensePreview && (<button type="button" className="mainptns-preview-delete-btn" onClick={() => removeFile('licenseImg')}><TrashBinIcon size={22} /></button>)}
                    </div>
                  </div>
                </div>
                <div className="mainptns-form-footer">
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" checked={riderAgreements.terms} onClick={() => openModal('rider', 'terms')} readOnly />
                    <span className="mainptns-agreement-text">{t('ptnsTermsLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                  </label>
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" checked={riderAgreements.privacy} onClick={() => openModal('rider', 'privacy')} readOnly />
                    <span className="mainptns-agreement-text">{t('ptnsAgreementLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                  </label>
                  <button className="mainptns-submit-button" type="submit">{t('ptnsRiderSubmit')}</button>
                </div>
            </form>

            {/* 파트너 폼 */}
            <form id="partner-application-form" className={`mainptns-card-box form-section ${!isLoggedIn ? 'mainptns-disabled' : ''}`} onSubmit={onSubmitPartner}>
              {!isLoggedIn && (
               <div className="mainptns-disabled-overlay">
                  <span className="mainptns-disabled-text">{t('coverLoginRequired')}</span>
                  <button type="button" className="mainptns-disabled-login-btn" onClick={() => navigate('/login')}>{t('headerLogin')}</button>
                </div>
                )}
                <div className="form-header-row"><h3 className="mainptns-card-title-text">{t('ptnsFormPartnerTitle')}</h3></div>
                <div className="mainptns-form-fields-group">
                    <div className="mainptns-input-grid-2">
                      <label className="mainptns-field-label">{t('ptnsManagerNameLabel')}
                        <input className="mainptns-field-input" name="managerName" placeholder={t('ptnsManagerNamePlaceholder')} disabled={!isLoggedIn} value={partnerFormData.managerName} onChange={(e) => handleInputChange(e, 'partner')} />
                      </label>
                      <label className="mainptns-field-label">{t('ptnsPhoneLabel')}
                        <input className="mainptns-field-input" name="partnerPhone" placeholder={t('ptnsPartnerPhonePlaceholder')} disabled={!isLoggedIn} value={partnerFormData.partnerPhone} onChange={(e) => handleInputChange(e, 'partner')} />
                      </label>
                    </div>
                    <div className="mainptns-input-grid-2">
                      <label className="mainptns-field-label">{t('ptnsStoreNameKrLabel')}
                        <input className="mainptns-field-input" name="storeNameKr" placeholder={t('ptnsStoreNameKrPlaceholder')} disabled={!isLoggedIn} value={partnerFormData.storeNameKr} onChange={(e) => handleInputChange(e, 'partner')} />
                      </label>
                      <label className="mainptns-field-label">{t('ptnsStoreNameEnLabel')}
                        <input className="mainptns-field-input" name="storeNameEn" placeholder={t('ptnsStoreNameEnPlaceholder')} disabled={!isLoggedIn} value={partnerFormData.storeNameEn} onChange={(e) => handleInputChange(e, 'partner')} />
                      </label>
                    </div>
                    <label className="mainptns-field-label">{t('ptnsBusinessNumLabel')}
                      <input className="mainptns-field-input" name="businessNumber" placeholder={t('ptnsBusinessNumPlaceholder')} maxLength="10" disabled={!isLoggedIn} value={partnerFormData.businessNumber} onChange={(e) => handleInputChange(e, 'partner')} />
                    </label>
                    <div style={{ position: 'relative' }}>
                      <label className="mainptns-field-label">{t('ptnsAddressLabel')}
                        <input className="mainptns-field-input" name="storeAddress" placeholder={t('ptnsAddressPlaceholder')} disabled={!isLoggedIn} value={partnerFormData.storeAddress} onChange={(e) => handleAddressSearch(e, 'partner')} autoComplete="off" />
                      </label>
                      {isSearchDropdownOpen && activeSearchInput === 'storeAddress' && searchResults.length > 0 && (
                          <ul className="ptnssearch-dropdown-list">
                            {searchResults.map((place) => (
                              <li key={place.id} onClick={() => handleSelectPlace(place)}>
                                <div className="place-name">{place.place_name}</div>
                                <div className="place-address">{place.road_address_name || place.address_name}</div>
                              </li>
                            ))}
                          </ul>
                      )}
                    </div>
                    <div className="mainptns-field-label">
                      {t('ptnsStoreLogoLabel')}
                      <div style={{ marginTop: '8px', position: 'relative' }}>
                        <input type="file" onChange={changeFiles} name="storeLogo" id="storeLogo" className="mainptns-file-hidden" accept="image/*" ref={partnerFileInputRef} disabled={!isLoggedIn} />
                        <label htmlFor="storeLogo" className="mainptns-file-box" style={{ backgroundImage: logoPreview ? `url("${logoPreview}")` : 'none', backgroundSize: 'contain', height: logoPreview ? '200px' : '80px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: logoPreview ? 'transparent' : '#ccc', cursor: !isLoggedIn ? 'not-allowed' : 'pointer' }}>
                          {!logoPreview && (t('ptnsUploadPlaceholder'))}
                        </label>
                        {logoPreview && isLoggedIn && (<button type="button" className="mainptns-preview-delete-btn" onClick={() => removeFile('logo')}><TrashBinIcon size={22} /></button>)}
                      </div>
                    </div>
                  </div>  
                  <div className="mainptns-form-footer">
                      <label className="mainptns-agreement-label">
                        <input type="checkbox" checked={partnerAgreements.terms} onClick={() => openModal('partner', 'terms')} readOnly disabled={!isLoggedIn} />
                        <span className="mainptns-agreement-text">{t('ptnsTermsLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                      </label>
                      <label className="mainptns-agreement-label">
                        <input type="checkbox" checked={partnerAgreements.privacy} onClick={() => openModal('partner', 'privacy')} readOnly disabled={!isLoggedIn} />
                        <span className="mainptns-agreement-text">{t('ptnsAgreementLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                      </label>
                      <button className="mainptns-submit-button" type="submit" disabled={!isLoggedIn}>{t('ptnsPartnerSubmit')}</button>
                  </div>
              </form>
          </div>

          {/* 약관 상세 내용 모달 */}
          {modalContent && (
            <div className="mainptns-modal-overlay" onClick={closeModal}>
              <div className="mainptns-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="mainptns-modal-header">
                  <h3>{modalContent.title}</h3>
                  <button className="mainptns-close-x-btn" onClick={closeModal}>{t('footerCloseX')}</button>
                </div>
                <div className="mainptns-modal-body">
                  <div className="mainptns-text-content">
                    {modalContent.description && <p className="mainptns-modal-description">{modalContent.description}</p>}
                    {modalContent.articles?.map((article, idx) => (
                      <div key={idx} style={{ marginBottom: '20px' }}>
                        {article.heading && <h4>{article.heading}</h4>}
                        {article.text && <p>{article.text}</p>}
                        {article.list && <ul>{article.list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mainptns-modal-footer">
                  <button className="mainptns-btn-cancel" onClick={closeModal}>{t('ptnsModalCancel')}</button>
                  <button className="mainptns-btn-confirm" onClick={confirmModal}>{t('ptnsModalConfirm')}</button>
                </div>
              </div>
            </div>
          )}

          {isRiderPostcodeOpen && (
              <div className="mainptns-postcode-overlay" onClick={closeRiderPostcode}>
                <div className="mainptns-postcode-box" onClick={(e) => e.stopPropagation()}>
                  <div className="mainptns-postcode-header">
                    <h3 className="mainptns-postcode-title">{t('ptnsPostcodeModalTitle')}</h3>
                    <button type="button" className="mainptns-postcode-close" onClick={closeRiderPostcode}>
                      {t('footerCloseX')}
                    </button>
                  </div>

                  <DaumPostcode
                    onComplete={handleRiderPostcodeComplete}
                    autoClose={false}
                    style={{ width: "100%", height: "420px" }}
                  />
                </div>
              </div>
           )}
           
           <CustomAlertModal 
             isOpen={alertState.isOpen}
             title={alertState.title}
             message={alertState.message}
             onClose={closeAlert}
           />
        </div>
      </div>
    </>
  )
}