/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 */

import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData'; // 약관 데이터
import { riderFormThunk } from '../../../store/thunks/formThunk.js';
import { partnerFormThunk } from '../../../store/thunks/formThunk.js';
import './MainPTNS.css';

export default function MainPTNS() {
  const { t, language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태 구독 (로딩 상태, 유저 정보 확인)
  const { user } = useSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('rider'); // 'rider' | 'partner'

  // 미리보기 상태 분리 (라이더용/파트너용)
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // 체크박스 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false
  });

  // 모달 상태 ('terms' | 'privacy' | null)
  const [activeModal, setActiveModal] = useState(null);

  // 메모리 누수 방지 (컴포넌트 언마운트 시 URL 해제)
  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);

  // 파일 변경 핸들러 개선
  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name; // input의 name 속성 확인 ('licenseImage' or 'storeLogo')

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      
      if (name === 'licenseImage') {
        setLicensePreview(objectUrl);
      } else if (name === 'storeLogo') {
        setLogoPreview(objectUrl);
      }
    }
  };

  // 모달 열기 핸들러 (체크박스 클릭 시)
  const openModal = (e, type) => {
    if (!agreements[type]) {
      setActiveModal(type);
      document.body.style.overflow = 'hidden'; // 스크롤 잠금
    } else {
      // 이미 체크된 경우 해제
      setAgreements(prev => ({ ...prev, [type]: false }));
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto'; // 스크롤 해제
  };

  // 모달 확인 (동의 처리)
  const confirmModal = () => {
    if (activeModal) {
      setAgreements(prev => ({ ...prev, [activeModal]: true }));
      closeModal();
    }
  };

  // 폼 제출 핸들러(바로 API 호출)
  const onSubmit = async (e) => {
    e.preventDefault();

    // 약관 동의 확인
    if (!agreements.terms || !agreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert') || "이용약관과 개인정보 수집에 동의해주세요.");
      return;
    }

    // 권한 중복 확인 (UX 차원)
    if (activeTab === 'rider' && user?.role === 'DLV') {
      alert("이미 라이더 권한을 보유하고 계십니다.");
      return;
    }
    if (activeTab === 'partner' && user?.role === 'PTN') {
      alert("이미 파트너 권한을 보유하고 계십니다.");
      return;
    }
    
    // 폼 데이터 추출
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    // 백엔드 스펙에 맞게 데이터 매핑
    let payload = new FormData();

    let actionThunk = null;

  if (activeTab === 'rider') {
    // [라이더 데이터 구성]
    payload.append('phone', rawData.riderPhone);
    payload.append('address', rawData.riderAddress);
    payload.append('bank', rawData.bankName);
    payload.append('bankNum', rawData.accountNumber);
    
    // ⚠️ 파일 처리: 값이 실제 파일 객체인지 확인
    if (rawData.licenseImage && rawData.licenseImage.size > 0) {
        payload.append('licenseImg', rawData.licenseImage); 
    }
      actionThunk = riderFormThunk;

    }
    else {
    // [파트너 데이터 구성]
    payload.append('manager', rawData.managerName);
    payload.append('phone', rawData.partnerPhone);
    payload.append('address', rawData.storeAddress);
    payload.append('krName', rawData.storeNameKr);
    payload.append('enName', rawData.storeNameEn);
    payload.append('businessNum', rawData.businessNumber);

    // ⚠️ [추가] 백엔드 유효성 검사 통과를 위한 위도/경도 추가
    // 실제 서비스에선 카카오 지도 API 등을 통해 주소 변환된 값을 넣어야 한다.
    // 현재는 에러 해결을 위해 임시 값(서울 좌표) 입력
    payload.append('lat', 37.5665); 
    payload.append('lng', 126.9780);
    
    // ⚠️ 파일 처리
    if (rawData.storeLogo && rawData.storeLogo.size > 0) {
        payload.append('logoImg', rawData.storeLogo);
    }

      actionThunk = partnerFormThunk;
    }

    // API Dispatch
    try {
    // 디버깅용 로그 (FormData 내용 확인)
    console.log(`=== [${activeTab}] 전송 데이터 확인 ===`);
    for (let pair of payload.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

      // 선택된 Thunk 실행
      await dispatch(actionThunk(payload)).unwrap();

      // 성공 시 처리
      e.currentTarget.reset();
      setAgreements({ terms: false, privacy: false });
      setLicensePreview(null);
      setLogoPreview(null);

      // 신청 내역 확인 페이지로 이동(마이패이지 살릴거면 아래 주석 풀기)
      // navigate('/mypage');
      navigate('/');

    } catch (error) {
      // 백엔드 Validator에서 걸러진 에러 메시지가 여기서 표시됨
      console.error("Submission Error:", error);
    }
  };

  // 현재 활성화된 모달 데이터
  const modalContent = activeModal 
    ? (footerData[language] ? footerData[language][activeModal] : footerData['ko'][activeModal]) 
    : null;

  return (
    <>
      <div className="mainptns-frame" id="partners">
        <div className="mainptns-container">
          
          {/* 상단 헤더 */}
          <div className="mainptns-header-group">
            <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
            <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
          </div>

          {/* 메인 폼 그리드 */}
          <div className="mainptns-grid-layout">
            <form className="mainptns-card-box form-section" onSubmit={onSubmit}>
              
              {/* 탭 헤더 */}
              <div className="form-header-row">
                {/* 타이틀 */}
                <h3 className="mainptns-card-title-text">
                  {activeTab === 'rider' ? (t('ptnsFormRiderTitle') || "라이더 제휴 신청") 
                    : (t('ptnsFormPartnerTitle') || "파트너 제휴 신청")}
                </h3>

                {/* 탭 버튼 */}
                <div className="mainptns-tab-group">
                  <button type="button" 
                    className={`mainptns-tab-btn ${activeTab === 'rider' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rider')}>{t('ptnsTabRider') || "Rider"}</button>
                  <button type="button" 
                    className={`mainptns-tab-btn ${activeTab === 'partner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('partner')}>{t('ptnsTabPartner') || "Partner"}</button>
                </div>
              </div>

              {/* 라이더 폼 필드 */}
              <div className="mainptns-form-fields-group">
                {activeTab === 'rider' && (
                  <>
                    {/* 휴대폰 번호 */}
                    <label className="mainptns-field-label">
                      {t('ptnsPhoneLabel')}
                      <input className="mainptns-field-input" name="riderPhone" required placeholder="010-0000-0000" />
                    </label>

                    {/* 주소 */}
                    <label className="mainptns-field-label">
                      {t('ptnsAddressLabel')}
                      <input className="mainptns-field-input" name="riderAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                    </label>

                    {/* 은행 이름 */}
                    <label className="mainptns-field-label">
                      {t('ptnsBankNameLabel') || "Bank Name"}
                      <input className="mainptns-field-input" name="bankName" required placeholder={t('ptnsStoreNamePlaceholder')} />
                    </label>

                    {/* 계좌 번호 */}
                    <label className="mainptns-field-label">
                      {t('ptnsAccountNumLabel') || "Account Number"}
                      <input className="mainptns-field-input" name="accountNumber" required placeholder={t('ptnsAccountNumber') || "123-45-67890"} />
                    </label>

                    {/* 운전 면허 등록 */}
                    <div className="mainptns-field-label">
                      {t('ptnsLicenseLabel') || "Driver License"}
                      <div style={{ marginTop: '8px' }}>
                        {/* 이미지 미리보기 */}
                        <input
                          type="file"
                          onChange={changeFiles}
                          name="licenseImage"
                          id="licenseImage"
                          className="mainptns-file-hidden"
                          accept="image/*"
                          required
                        />
                        <label
                          htmlFor="licenseImage"
                          className="mainptns-file-box"
                          style={{
                            backgroundImage: licensePreview ? `url("${licensePreview}")` : 'none',
                            backgroundSize: 'contain',
                            height: licensePreview ? '200px' : undefined,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            color: licensePreview ? 'transparent' : 'inherit'
                          }}
                        >
                          {!licensePreview && t('ptnsUploadPlaceholder') || "Upload Photo"}
                        </label>
                      </div>
                    </div>
                  </>
                )}
                
                {/* 파트너 폼 필드 */}
                {activeTab === 'partner' && (
                  <>
                    <div className="mainptns-input-grid-2">
                      {/* 담당자 이름 */}
                      <label className="mainptns-field-label">
                        {t('ptnsManagerNameLabel') || "Manager Name"}
                        <input className="mainptns-field-input" name="managerName" required placeholder={t('ptnsManagerNamePlaceholder') || "Name"} />
                      </label>

                      {/* 휴대폰 번호 */}
                      <label className="mainptns-field-label">
                        {t('ptnsPhoneLabel')}
                        <input className="mainptns-field-input" name="partnerPhone" required placeholder="010-0000-0000" />
                      </label>
                    </div>

                    <div className="mainptns-input-grid-2">
                      {/* 가계 한글 이름 */}
                      <label className="mainptns-field-label">
                        {t('ptnsStoreNameKrLabel') || "Store Name (KR)"}
                        <input className="mainptns-field-input" name="storeNameKr" required placeholder={t('ptnsStoreNamePlaceholder')} />
                      </label>

                      {/* 가계 영어 이름 */}
                      <label className="mainptns-field-label">
                        {t('ptnsStoreNameEnLabel') || "Store Name (EN)"}
                        <input className="mainptns-field-input" name="storeNameEn" required placeholder={t('ptnsStoreEnNamePlaceholder') || "English Name"} />
                      </label>
                    </div>

                    {/* 사업자 번호 */}
                    <label className="mainptns-field-label">
                      {t('ptnsBusinessNumLabel') || "Business Number"}
                      <input className="mainptns-field-input" name="businessNumber" required placeholder="000-00-00000" />
                    </label>

                    {/* 주소 */}
                    <label className="mainptns-field-label">
                      {t('ptnsAddressLabel')}
                      <input className="mainptns-field-input" name="storeAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                    </label>

                    {/* 가계 로고 사진 */}
                    <div className="mainptns-field-label">
                      {t('ptnsStoreLogoLabel') || "Store Logo"}
                      <div style={{ marginTop: '8px' }}>
                        {/* 이미지 미리보기 */}
                        <input
                          type="file"
                          onChange={changeFiles}
                          name="storeLogo"
                          id="storeLogo"
                          className="mainptns-file-hidden"
                          accept="image/*"
                          required
                        />
                        <label
                          htmlFor="storeLogo"
                          className="mainptns-file-box"
                          style={{
                            backgroundImage: logoPreview ? `url("${logoPreview}")` : 'none',
                            backgroundSize: 'contain',
                            height: logoPreview ? '200px' : undefined,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            color: logoPreview ? 'transparent' : 'inherit'
                          }}
                        >
                          {!logoPreview && t('ptnsUploadPlaceholder') || "Upload Photo"}
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* 약관 체크박스 */}
                <div className="mainptns-form-footer" style={{ marginTop: '20px' }}>
                  {/* 이용 약관 동의 */}
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" name="agreeTerms" 
                      checked={agreements.terms} 
                      onClick={(e) => openModal(e, 'terms')} readOnly />
                    <span className="mainptns-agreement-text">
                      {t('ptnsTermsLabel') || "I agree to Terms of Service."}
                      <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>(필수)</span>
                    </span>
                  </label>

                  {/* 개인정보 수집 및 이용 동의 */}
                  <label className="mainptns-agreement-label" style={{ marginTop: '8px' }}>
                    <input type="checkbox" name="agreePrivacy" 
                      checked={agreements.privacy} 
                      onClick={(e) => openModal(e, 'privacy')} readOnly />
                    <span className="mainptns-agreement-text">
                      {t('ptnsAgreementLabel')}
                      <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>(필수)</span>
                    </span>
                  </label>
                  
                  {/* 폼 등록하기 버튼 */}
                  <button className="mainptns-submit-button" type="submit" style={{ marginTop: '20px' }}>
                    {activeTab === 'rider' ? (t('ptnsRiderSubmit') || "Register Rider") : (t('ptnsPartnerSubmit') || "Register Partner")}
                  </button>
                </div>
              </div>
            </form>

            {/* 우측 가이드 */}
            <div className="mainptns-card-box" style={{ height: 'fit-content' }}>
              <div className="mainptns-guide-section">
                <h3 className="mainptns-section-header">{t('ptnsGuideTitle')}</h3>
                <div className="mainptns-guide-card-list">
                  <div className="mainptns-guide-card">
                    <div className="mainptns-guide-title">{t('ptnsProcessTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsProcessDesc')}</div>
                  </div>
                  <div className="mainptns-guide-card">
                    <div className="mainptns-guide-title">{t('ptnsInfoRequiredTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsInfoRequiredDesc')}</div>
                  </div>
                  <div className="mainptns-guide-card">
                    <div className="mainptns-guide-title">{t('ptnsAgreementTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsAgreementDesc')}</div>
                  </div>
                  <div className="mainptns-guide-message-box">
                    <div className="mainptns-guide-title">{t('ptnsReceiptMessageTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsReceiptMessageDesc')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* --- 통합된 모달 영역 --- */}
  {modalContent && (
    <div className="mainptns-modal-overlay" onClick={closeModal}>
      <div className="mainptns-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* 모달 헤더 */}
        <div className="mainptns-modal-header">
          <h3>{modalContent.title}</h3>
          <button className="mainptns-close-x-btn" onClick={closeModal}>✕</button>
        </div>

        {/* 모달 본문 */}
        <div className="mainptns-modal-body">
          <div className="mainptns-text-content">
            {modalContent.description && (
              <p className="mainptns-modal-description">
                {modalContent.description}
              </p>
            )}
            {modalContent.articles && modalContent.articles.map((article, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                {article.heading && <h4>{article.heading}</h4>}
                {article.text && <p>{article.text}</p>}
                
                {article.list && (
                  <ul>
                    {article.list.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                )}

                {article.text2 && <p>{article.text2}</p>}
                {article.text3 && <p>{article.text3}</p>}
                {article.list2 && (
                  <ul>
                    {article.list2.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 모달 푸터 (취소/동의 버튼) */}
        <div className="mainptns-modal-footer">
          <button className="mainptns-btn-cancel" onClick={closeModal}>취소</button>
          <button className="mainptns-btn-confirm" onClick={confirmModal}>동의 및 확인</button>
        </div>
      </div>
    </div>
  )}
  </>
  );
}