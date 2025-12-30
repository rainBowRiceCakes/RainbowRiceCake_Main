export const LANG_CNG = {
  // --- src/components/main/MainShow.jsx ---
  navPlans: {
    ko: "요금제",
    en: "Plans",
  },
  navBranches: {
    ko: "지점찾기",
    en: "Branches",
  },
  navFee: {
    ko: "요금안내",
    en: "Fee",
  },
  navSupport: {
    ko: "고객지원",
    en: "Support",
  },
  navPartners: {
    ko: "제휴문의",
    en: "Partners",
  },

  // --- src/components/main/sections/MainCover.jsx ---
  coverImageAlt: {
    ko: "우리 서비스 이미지 (1020*500)",
    en: "Our service image (1020*500)",
  },
  coverDeliveryTracking: {
    ko: "배송 조회",
    en: "Track Shipment",
  },
  coverOrderNumberPlaceholder: {
    ko: "주문 번호를 입력해주세요",
    en: "Please enter your order number",
  },
  coverTrackButton: {
    ko: "조회",
    en: "Track",
  },
  coverGoToMyDeliveries: {
    ko: "내 배송 현황 보러가기",
    en: "Go to My Deliveries",
  },

  // --- src/components/main/sections/MainInfo.jsx (Pricing Plans) ---
  planTitle: {
    ko: "DGD의 다양한 배송 플랜",
    en: "DGD's Various Delivery Plans",
  },
  planSelect: {
    ko: "선택하기",
    en: "Select Plan",
  },
  planSelected: {
    ko: "선택됨",
    en: "Selected",
  },
  planRecommended: {
    ko: "Recommended",
    en: "Recommended",
  },

  // Plan Names
  planNameBasic: { ko: "Basic", en: "Basic" },
  planNameStandard: { ko: "Standard", en: "Standard" },
  planNamePremium: { ko: "Premium", en: "Premium" },

  // Plan Prices
  planPriceBasic: { ko: "5,000", en: "5,000" },
  planPriceStandard: { ko: "10,000", en: "10,000" },
  planPricePremium: { ko: "15,000", en: "15,000" },

  // Plan Features
  planFeature1ItemDelivery: { ko: "물품 1개 배송", en: "1 Item Delivery" },
  planFeatureSameDay: { ko: "당일 배송", en: "Same-day" },
  planFeatureQRRegistration: { ko: "QR 등록", en: "QR Registration" },
  
  // Currency Unit
  currencyUnit: { ko: "원", en: "KRW" },


  // --- src/components/main/sections/MainPTNSSearch.jsx ---
  ptnsSearchLocationError: {
    ko: "현재 위치를 가져올 수 없습니다. 기본 위치로 지도를 엽니다.",
    en: "Cannot retrieve current location. Opening map with default location.",
  },
  ptnsSearchGeolocationError: {
    ko: "이 브라우저에서는 Geolocation이 지원되지 않습니다.",
    en: "Geolocation is not supported by this browser.",
  },
  ptnsSearchTitle: {
    ko: "제휴 지점 찾기",
    en: "Find Affiliated Branches",
  },
  ptnsSearchDesc: {
    ko: "가까운 제휴 매장 및 보관소를 검색하고 위치를 확인해보세요.",
    en: "Search for nearby affiliated stores and storage locations to check their positions.",
  },
  ptnsSearchPlaceholder: {
    ko: "버튼을 눌러 내 주변 제휴점을 찾아보세요.",
    en: "Press the button to find affiliated stores near you.",
  },
  ptnsSearchFindNearMe: {
    ko: "내 주변 찾기",
    en: "Find Near Me",
  },
  ptnsSearchInputPlaceholder: {
    ko: "지점명, 매장명 검색...",
    en: "Search by branch or store name...",
  },
  ptnsSearchCurrentLocation: {
    ko: "현 위치",
    en: "Current Location",
  },
  ptnsSearchLoadingLocation: {
    ko: "위치 정보를 불러오는 중입니다...",
    en: "Loading location information...",
  },
  ptnsMapLoading: {
    ko: "지도를 불러오는 중입니다...",
    en: "Loading map...",
  },
  ptnsMapError: {
    ko: "지도를 불러오는 데 실패했습니다.",
    en: "Failed to load map.",
  },
  mainLocationHeadquarters: {
    ko: "본점 위치",
    en: "Headquarters"
  },
  mainLocationMyLocation: {
    ko: "내 위치",
    en: "My Location"
  },

  // --- src/components/main/sections/MainFee.jsx ---
  feeTitle: {
    ko: "가격 안내",
    en: "Pricing Information",
  },
  feeDesc: {
    ko: "합리적인 가격과 신선함을 위한 배송/픽업 지점을 확인하세요.",
    en: "Check our delivery/pickup locations for reasonable prices and freshness.",
  },
  feeDaeguDeliveryTitle: {
    ko: "대구 지역 배송료 안내",
    en: "Daegu Area Delivery Fee Guide",
  },
  feeOrderAmount: {
    ko: "주문 금액",
    en: "Order Amount",
  },
  feeBaseFee: {
    ko: "기본 배송료",
    en: "Base Delivery Fee",
  },
  feeOver10000: {
    ko: "10,000원 이상",
    en: "Over 10,000 KRW",
  },
  feeFree: {
    ko: "무료",
    en: "Free",
  },
  feeBetween5000And10000: {
    ko: "5,000원 ~ 10,000원 미만",
    en: "5,000 KRW to under 10,000 KRW",
  },
  fee1000KRW: {
    ko: "1,000원",
    en: "1,000 KRW",
  },
  feeRegionalSurchargeTitle: {
    ko: "지역별 추가요금",
    en: "Regional Surcharges",
  },
  feeDaebongEtc: {
    ko: "대봉1동, 대신동, 성내동 :",
    en: "Daebong 1-dong, Daesin-dong, Seongnae-dong :",
  },
  feePlus500: {
    ko: "+500원",
    en: "+500 KRW",
  },
  feeNaedangEtc: {
    ko: "내당동, 대명동, 두류동 :",
    en: "Naedang-dong, Daemyeong-dong, Duryu-dong :",
  },
  feePlus1000: {
    ko: "+1,000원",
    en: "+1,000 KRW",
  },
  feeSamdeokEtc: {
    ko: "삼덕동 및 기타 외곽 지역은",
    en: "For Samdeok-dong and other suburban areas,",
  },
  fee1500KRW: {
    ko: "1,500원",
    en: "1,500 KRW",
  },
  feeNightHolidaySurchargeTitle: {
    ko: "야간 및 공휴일 할증",
    en: "Night & Holiday Surcharges",
  },
  feeNightHours: {
    ko: "23:00 ~ 02:00 (일,월,수,금)",
    en: "23:00 - 02:00 (Sun, Mon, Wed, Fri)",
  },

  // --- src/components/main/sections/MainDLVS.jsx ---
  dlvsNoInfo: {
    ko: "정보가 없습니다.",
    en: "No information available.",
  },
  dlvsTitle: {
    ko: "배송 현황",
    en: "Delivery Status",
  },
  dlvsDesc: {
    ko: "배송코드/Email 입력 → DB 조회 → 결과 출력. 없으면 알림 후 초기화.",
    en: "Enter Delivery Code/Email → DB Search → Display Result. If not found, notify and reset.",
  },
  dlvsTrackingFormTitle: {
    ko: "배송 조회",
    en: "Track Shipment",
  },
  dlvsCodeLabel: {
    ko: "배송 코드",
    en: "Delivery Code",
  },
  dlvsCodePlaceholder: {
    ko: "예: A1B2C3",
    en: "e.g., A1B2C3",
  },
  dlvsEmailLabel: {
    ko: "Email",
    en: "Email",
  },
  dlvsEmailPlaceholder: {
    ko: "name@email.com",
    en: "name@email.com",
  },
  dlvsTrackButton: {
    ko: "조회하기",
    en: "Track Now",
  },
  dlvsTestNote: {
    ko: "테스트: 배송 코드에 'none' 입력하면 “정보가 없습니다” 플로우 확인 가능",
    en: "<p>Test: Enter 'none' as the delivery code to check the 'No information available' flow</p>",
  },
  dlvsResultTitle: {
    ko: "조회 결과",
    en: "Tracking Result",
  },
  dlvsResultPlaceholder: {
    ko: "조회하면 상태/타임라인과 완료 시 사진 증빙을 보여줘.",
    en: "After tracking, status/timeline and photo proof upon completion will be displayed.",
  },
  dlvsResultCode: {
    ko: "배송 코드:",
    en: "Delivery Code:",
  },
  dlvsResultEmail: {
    ko: "Email:",
    en: "Email:",
  },
  dlvsResultCurrentStatus: {
    ko: "현재 상태:",
    en: "Current Status:",
  },
  dlvsTimelineTitle: {
    ko: "타임라인",
    en: "Timeline",
  },
  dlvsTimelineStep1: {
    ko: "접수 완료",
    en: "Registered",
  },
  dlvsTimelineStep1Desc: {
    ko: "지점에서 접수되었습니다.",
    en: "Your item has been registered at the branch.",
  },
  dlvsTimelineStep2: {
    ko: "기사 배정",
    en: "Courier Assigned",
  },
  dlvsTimelineStep2Desc: {
    ko: "기사 배정이 완료되었습니다.",
    en: "A courier has been assigned.",
  },
  dlvsTimelineStep3: {
    ko: "배송 중",
    en: "In Transit",
  },
  dlvsTimelineStep3Desc: {
    ko: "현재 목적지로 이동 중입니다.",
    en: "Currently en route to the destination.",
  },
  dlvsPhotoProofTitle: {
    ko: "사진 증빙(완료 시)",
    en: "Photo Proof (Upon Completion)",
  },

  dlvsStatusFlow: {
    ko: "READY → ASSIGNED → PICKED_UP → DELIVERING → DELIVERED",
    en: "READY → ASSIGNED → PICKED_UP → DELIVERING → DELIVERED",
  },
  dlvsProofPhotoPlaceholder: {
    ko: "사진 증빙 플레이스홀더",
    en: "Proof Photo Placeholder",
  },

  // --- src/components/main/sections/MainCS.jsx ---
  csFaq1Question: {
    ko: "배송은 얼마나 걸려요?",
    en: "How long does delivery take?",
  },
  csFaq1Answer: {
    ko: "지점/거리/기사 배정 상황에 따라 달라요. 배송 현황에서 상태를 확인해줘.",
    en: "It depends on the branch, distance, and courier assignment. Please check the status in the Delivery Status menu.",
  },
  csFaq2Question: {
    ko: "보관 불가 물품이 있나요?",
    en: "Are there any non-storable items?",
  },
  csFaq2Answer: {
    ko: "현금/귀중품, 위험물, 파손 위험 물품, 음식물(부패 가능)은 불가예요.",
    en: "Cash/valuables, hazardous materials, fragile items, and perishable food are not accepted.",
  },
  csFaq3Question: {
    ko: "분실/파손은 어떻게 처리돼요?",
    en: "How are lost or damaged items handled?",
  },
  csFaq3Answer: {
    ko: "정책 기준에 따라 접수 후 처리돼요. 필요 시 Email Callback으로 접수 가능.",
    en: "Claims are processed based on our policy. You can submit a claim via Email Callback if needed.",
  },
  csEmailCallbackAlert: {
    ko: "Email Callback 접수 완료(더미)",
    en: "Email Callback request received (dummy).",
  },
  csChatbotAlert: {
    ko: "챗봇 이동(더미)",
    en: "Redirecting to Chatbot (dummy).",
  },
  csTitle: {
    ko: "고객센터",
    en: "Customer Center",
  },
  csDesc: {
    ko: "FAQ → 챗봇 → Email 문의 순으로 안내해요.",
    en: "We provide support in the order of FAQ → Chatbot → Email Inquiry.",
  },
  csEmailInquiryButton: {
    ko: "Email 문의하기",
    en: "Email Inquiry",
  },
  csFaqTitle: {
    ko: "자주 묻는 질문 (FAQ)",
    en: "Frequently Asked Questions (FAQ)",
  },
  csOperatingHoursTitle: {
    ko: "운영 시간",
    en: "Operating Hours",
  },
  csOperatingHoursTime: {
    ko: "09:00 – 18:00 (KST)",
    en: "09:00 – 18:00 (KST)",
  },
  csOperatingHoursNote: {
    ko: "운영 시간 외에도 Email 문의를 남겨줘.",
    en: "You can leave an email inquiry outside of operating hours.",
  },
  csChatbotTitle: {
    ko: "챗봇 상담",
    en: "Chatbot Support",
  },
  csChatbotDesc: {
    ko: "FAQ 기반 자동응답 + 선택형 질문 제공. 해결 실패 시 Email Callback으로 전환.",
    en: "FAQ-based automated responses + multiple-choice questions. Converts to Email Callback if unresolved.",
  },
  csChatbotStartButton: {
    ko: "챗봇 시작하기",
    en: "Start Chatbot",
  },
  csSwitchToEmailButton: {
    ko: "Email 문의로 전환",
    en: "Switch to Email Inquiry",
  },
  csEmailCallbackTitle: {
    ko: "Email Callback",
    en: "Email Callback",
  },
  csEmailCallbackDesc: {
    ko: "상담 불가 상황에서 이메일을 남기면 다음 영업일 연락 안내를 제공해요.",
    en: "If you leave your email when support is unavailable, we will contact you the next business day.",
  },
  csEmailRequired: {
    ko: "이메일(필수)",
    en: "Email (Required)",
  },
  csInquirySummaryOptional: {
    ko: "문의 요약(선택)",
    en: "Inquiry Summary (Optional)",
  },
  csInquirySummaryPlaceholder: {
    ko: "예: 배송 완료 사진이 안 보여요",
    en: "e.g., I can't see the delivery confirmation photo",
  },
  csSubmitButton: {
    ko: "접수하기",
    en: "Submit",
  },
  csSubmitSuccessNote: {
    ko: "문의가 접수되었습니다. 곧 연락드리겠습니다.",
    en: "Your inquiry has been received. We will contact you shortly.",
  },

  csInquirySubject: {
    ko: "문의드립니다",
    en: "Inquiry",
  },
  csInquiryTitle: {
    ko: "문의",
    en: "Inquiry",
  },
  csInquiryDesc: {
    ko: "운영시간 외에도 문의를 남기면 확인 후 순차적으로 안내드려요.",
    en: "If you leave an inquiry outside of business hours, we will check and guide you sequentially.",
  },
  csInquirySubjectLabel: {
    ko: "제목",
    en: "Subject",
  },
  csInquirySubjectPlaceholder: {
    ko: "예: 배송 완료 사진이 안 보여요",
    en: "e.g., I can't see the delivery completion photo",
  },
  csInquiryContentLabel: {
    ko: "내용",
    en: "Content",
  },
  csInquiryContentPlaceholder: {
    ko: "상황을 간단히 적어주세요. (주문번호/지점/시간대 등)",
    en: "Please briefly describe the situation. (Order number/branch/time, etc.)",
  },
  csInquiryFileLabel: {
    ko: "첨부파일 (선택)",
    en: "Attachment (Optional)",
  },
  csInquirySubmitLoading: {
    ko: "접수 중...",
    en: "Submitting...",
  },
  csInquirySubmit: {
    ko: "접수하기",
    en: "Submit",
  },
  csInquirySuccessMsg: {
    ko: "문의가 접수되었습니다. 확인 후 연락드리겠습니다.",
    en: "Your inquiry has been received. We will contact you after checking.",
  },
  csInquiryFailMsg: {
    ko: "문의 접수 실패",
    en: "Failed to submit inquiry",
  },
  csFilePlaceholder: {
    ko: "파일",
    en: "FILE",
  },
  csFileChooseBtn: {
    ko: "파일 선택",
    en: "Choose File",
  },
  csFileNoFileSelected: {
    ko: "선택된 파일 없음",
    en: "No file selected",
  },

  // --- src/components/main/sections/MainPTNS.jsx ---
  // 제휴 신청(form)
  ptnsAgreeRequiredAlert: {
    ko: "개인정보 수집·이용 동의가 필요해.",
    en: "Agreement to the collection and use of personal information is required.",
  },
  ptnsSubmitSuccessAlert: {
    ko: "제휴 문의가 정상적으로 접수되었습니다. 검토 후 연락드리겠습니다.",
    en: "Your partnership inquiry has been successfully submitted. We will review it and contact you.",
  },
  ptnsTitle: {
    ko: "제휴 신청",
    en: "Apply for partnership",
  },
  ptnsDesc: {
    ko: "상호/주소/연락처 필수, 검증 후 접수 시간 기록.",
    en: "Company name/address/contact are required. Submission time will be recorded after verification.",
  },
  ptnsFormRiderTitle: {
    ko: "라이더 제휴 신청",
    en: "Rider Affiliate Application"
  },
  ptnsFormPartnerTitle: {
    ko: "파트너 제휴 신청",
    en: "Partner Affiliate Application"
  },
  ptnsTabRider: {
    ko: "라이더",
    en: "Rider",
  },
  ptnsTabPartner: {
    ko: "파트너",
    en: "Partner",
  },
  ptnsRiderSubmit: {
    ko: "라이더 등록하기",
    en: "Register as Rider",
  },
  ptnsPartnerSubmit: {
    ko: "파트너 등록하기",
    en: "Register as Partner",
  },
  /* 라이더 전용 필드 */
  ptnsPhoneLabel: {
    ko: "휴대폰 번호 (필수)",
    en: "Phone Number (Required)"
  },
  ptnsAddressLabel: {
    ko: "주소 (필수)",
    en: "Address (Required)"
  },
  ptnsAddressPlaceholder: {
    ko: "도로명 주소",
    en: "Road Name Address"
  },
  ptnsBankNameLabel: {
    ko: "은행 이름 (필수)",
    en: "Bank Name (Required)",
  },
  ptnsStoreNamePlaceholder: {
    ko: "예) 농협",
    en: "ex) Nonghyup"
  },
  ptnsAccountNumLabel: {
    ko: "계좌 번호 (필수)",
    en: "Account Number (Required)",
  },
  ptnsAccountNumber: {
    ko: "예) 792-XXXX-XXXX-XX",
    en: "ex) 792-XXXX-XXXX-XX"
  },
  ptnsLicenseLabel: {
    ko: "운전 면허 등록 (필수)",
    en: "Driver's License (Required)",
  },
  /* 파트너 전용 필드 */
  ptnsManagerNameLabel: {
    ko: "담당자 이름 (필수)",
    en: "Manager Name (Required)",
  },
  ptnsManagerNamePlaceholder: {
    ko: "예) 홍길동",
    en: "ex) Hong Gil-Dong"
  },
  ptnsStoreNameKrLabel: {
    ko: "가게 한글 이름 (필수)",
    en: "Store Name (Korean/Required)",
  },
  ptnsStoreNameEnLabel: {
    ko: "가게 영어 이름 (필수)",
    en: "Store Name (English/Required)",
  },
  ptnsStoreEnNamePlaceholder: {
    ko: "예) rainbow rice cake",
    en: "ex) rainbow rice cake"
  },
  ptnsBusinessNumLabel: {
    ko: "사업자 번호 (필수)",
    en: "Business Registration No. (Required)",
  },
  ptnsStoreLogoLabel: {
    ko: "가게 로고 사진 (필수)",
    en: "Store Logo Image (Required)",
  },
  ptnsUploadPlaceholder: {
    ko: "사진을 등록해주세요.",
    en: "Please upload a photo.",
  },
  ptnsTermsLabel: {
    ko: "이용약관에 동의합니다.",
    en: "I agree to the Terms of Service.",
  },
  ptnsAgreementLabel: {
    ko: "개인정보 수집 및 이용에 동의합니다.",
    en: "I agree to the collection and use of my personal information."
  },
  ptnsRequired: {
    ko: "(필수)",
    en: "(Required)"
  },
  ptnsModalCancel: {
    ko: "취소",
    en: "Cancel"
  },
  ptnsModalConfirm: {
    ko: "동의 및 확인",
    en: "Agree and Confirm"
  },

  // 제휴 안내
  ptnsGuideTitle: {
    ko: "제휴 안내",
    en: "Partnership Guide",
  },
  ptnsProcessTitle: {
    ko: "접수 후 프로세스",
    en: "Post-Submission Process",
  },
  ptnsProcessDesc: {
    ko: "접수됨 → 검토 중 → 연락 완료/보류(추후 Admin 확장)",
    en: "Submitted → Under Review → Contacted/Pending (Admin expansion later)",
  },
  ptnsInfoRequiredTitle: {
    ko: "준비 정보",
    en: "Required Information",
  },
  ptnsInfoRequiredDesc: {
    ko: "상호/주소/연락처는 필수로 제출되어야 해요.",
    en: "Company name, address, and contact information are mandatory.",
  },
  ptnsAgreementTitle: {
    ko: "개인정보 동의",
    en: "Personal Information Agreement",
  },
  ptnsAgreementDesc: {
    ko: "동의 체크가 없으면 제출이 불가해요.",
    en: "Submission is not possible without checking the agreement.",
  },
  ptnsReceiptMessageTitle: {
    ko: "문의 접수 메시지",
    en: "Inquiry Receipt Message",
  },
  ptnsReceiptMessageDesc: {
    ko: "“제휴 문의가 정상적으로 접수되었습니다. 검토 후 연락드리겠습니다.”",
    en: "'Your partnership inquiry has been successfully submitted. We will review it and contact you.'",
  },

  // --- src/components/main/auth/Login.jsx ---
  loginTitle: {
    ko: "로그인",
    en: "Login",
  },
  loginEmailPlaceholder: {
    ko: "이메일을 입력해주세요.",
    en: "Please enter your email.",
  },
  loginPasswordPlaceholder: {
    ko: "패스워드를 입력해주세요.",
    en: "Please enter your password.",
  },
  loginStayLoggedIn: {
    ko: "로그인 상태 유지",
    en: "Keep me logged in",
  },
  loginFindEmail: {
    ko: "이메일 찾기",
    en: "Find email",
  },
  loginFindPassword: {
    ko: "패스워드 찾기",
    en: "Find password",
  },
  loginGoBack: {
    ko: "뒤로가기",
    en: "Go back",
  },
  loginWithKakao: {
    ko: "카카오 소셜 로그인",
    en: "Login with Kakao"
  },

  // --- Additional keys for Header01.jsx ---
  headerLogin: {
    ko: "로그인",
    en: "LOGIN",
  },
  headerLogout: {
    ko: "로그아웃",
    en: "LOGOUT"
  },
  headerMyPage: {
    ko: "마이페이지",
    en: "MyPage",
  },

  headerLogoAlt: {
    ko: "무지개떡 로고",
    en: "Rainbow Rice Cake Logo",
  },

  headerMenuTitle: {
    ko: "메뉴",
    en: "Menu",
  },

  // --- src/components/main/auth/MyPage.jsx ---
  myPageLoginRequired: {
    ko: "로그인이 필요해요",
    en: "Login required",
  },
  myPageLogin: {
    ko: "로그인",
    en: "Login",
  },
  myPageStatusTitle: {
    ko: "배송/보관 중인 짐 현황",
    en: "Delivery/Storage Status",
  },
  myPageStatusStep1: {
    ko: "예약 확정",
    en: "Booking Confirmed",
  },
  myPageStatusStep2: {
    ko: "픽업 완료",
    en: "Pickup Complete",
  },
  myPageStatusStep3: {
    ko: "이동 중",
    en: "In Transit",
  },
  myPageStatusStep4: {
    ko: "보관 중",
    en: "In Storage",
  },

  // --- src/components/common/Footer01.jsx ---
  footerTerms: {
    ko: "이용약관",
    en: "Terms of Service",
  },
  footerPrivacy: {
    ko: "개인정보처리방침",
    en: "Privacy Policy",
  },
  footerLocation: {
    ko: "위치기반서비스 약관",
    en: "Location Terms",
  },
  footerDaeguBranch: {
    ko: "DGD | DGD 대구지점",
    en: "DGD | DGD Daegu Branch"
  },
  footerCompanyAddress: {
    ko: "41937 대구 중구 중앙대로 394 제일빌딩 5F",
    en: "5F, Jeil Building, 394 Jungang-daero, Jung-gu, Daegu, 41937"
  },
  footerCEO: {
    ko: "대표자: 정의욱",
    en: "CEO: Euiwook Jeong",
  },
  footerPhone: {
    ko: "대표 번호: 010-0000-0000",
    en: "Main Number: 010-0000-0000",
  },
  footerEmail: {
    ko: "대표 이메일: https://daegu.greenart.co.kr",
    en: "Main Email: https://daegu.greenart.co.kr",
  },
  footerBizNum: {
    ko: "사업자 등록번호: 000-00-00000",
    en: "Business Registration Number: 000-00-00000",
  },
  footerClose: {
    ko: "닫기",
    en: "Close",
  },

  // --- src/components/main/auth/Register.jsx ---
  registerTitle: {
    ko: "이메일로 회원 가입",
    en: "Register with email",
  },
  registerLoginLink: {
    ko: "이미 계정이 있으시다면 로그인하세요 →",
    en: "Already have an account? Login →",
  },
  registerFirstName: {
    ko: "이름",
    en: "First name",
  },
  registerLastName: {
    ko: "성",
    en: "Last name",
  },
  registerEmail: {
    ko: "이메일",
    en: "Email",
  },
  registerPassword: {
    ko: "패스워드",
    en: "Password",
  },
  registerConfirmPassword: {
    ko: "패스워드 확인",
    en: "Confirm password",
  },
  registerCountry: {
    ko: "KR 대한민국 +82",
    en: "KR South Korea +82",
  },
  registerPhoneNumber: {
    ko: "연락처 입력",
    en: "Enter phone number",
  },
  registerAgreement: {
    ko: "이용 약관에 모두 동의합니다.",
    en: "I agree to all terms and conditions.",
  },
  registerSubmit: {
    ko: "가입 하기",
    en: "Register",
  },
  registerSuccess: {
    ko: "회원가입 요청이 접수되었습니다.",
    en: "Your registration request has been received.",
  },
  // --- src/components/main/sections/MainCoverItems/MainCoverModal.jsx ---
  "coverModalClose": {
    "ko": "닫기",
    "en": "Close"
  },
  "coverModalDeliveryNumber": {
    "ko": "배송 번호",
    "en": "Delivery Number"
  },
  "coverModalRecipient": {
    "ko": "받는 사람",
    "en": "Recipient"
  },
  "coverModalDriverContact": {
    "ko": "기사 연락처",
    "en": "Driver Contact"
  },
  "coverModalPaymentAmount": {
    "ko": "결제 금액",
    "en": "Payment Amount"
  },
  "coverModalCurrency": {
    "ko": "원",
    "en": "KRW"
  },
  "coverModalTitle": {
    "ko": "배송 상세 내역",
    "en": "Delivery Details"
  },
  "coverModalSub": {
    "ko": "백과 조회 기반으로 최신 배송 상태를 표시합니다.",
    "en": "Displays the latest delivery status based on encyclopedia lookup."
  },
  "confirm": {
    "ko": "확인",
    "en": "Confirm"
  },
  // --- src/components/main/sections/MainCoverItems/DeliveryStatusCards.jsx ---
  "deliveryStepRegister": {
    "ko": "등록",
    "en": "Register"
  },
  "deliveryStepMatching": {
    "ko": "기사매칭",
    "en": "Driver Matching"
  },
  "deliveryStepInProgress": {
    "ko": "배송중",
    "en": "In Progress"
  },
  "deliveryStepCompleted": {
    "ko": "배송완료",
    "en": "Completed"
  },
  "deliveryStatusAriaLabel": {
    "ko": "배송 상태 단계",
    "en": "Delivery Status Steps"
  },
  // --- src/components/main/auth/MyPage.jsx ---
  "myPageUserName": {
    "ko": "홍*동",
    "en": "H*ng"
  },
  "myPageUserEmail": {
    "ko": "hong@ricecake.com",
    "en": "hong@ricecake.com"
  },
  // --- src/components/main/auth/Social.jsx ---
  "socialLoginFailed": {
    "ko": "로그인에 실패하였습니다.",
    "en": "Login failed."
  },
  // --- src/components/main/sections/MainCover.jsx ---
  "coverLoginRequired": {
    "ko": "로그인이 필요한 서비스입니다.",
    "en": "This service requires login."
  },
  "coverOrderNotFound": {
    "ko": "주문 번호를 찾을 수 없습니다: 다시 시도해주세요.",
    "en": "Order number not found: Please try again."
  },
  "coverLoading": {
    "ko": "조회중...",
    "en": "Loading..."
  },
  // --- src/components/admin/PartnerRegistration.jsx ---
  "adminRegisterBranch": {
    "ko": "지점 등록 (Kakao Places API)",
    "en": "Branch Registration (Kakao Places API)"
  },
  "adminStoreNamePlaceholder": {
    "ko": "매장명 입력 (예: 올리브영 대구중앙로점)",
    "en": "Enter store name (e.g., Olive Young Daegu Jungang-ro)"
  },
  "adminDataSaving": {
    "ko": "데이터 저장 중...",
    "en": "Saving data..."
  },
  "adminRegisterSuccess": {
    "ko": "등록 성공!",
    "en": "Registration successful!"
  },
  "adminError": {
    "ko": "에러:",
    "en": "Error:"
  },
  "adminServerError": {
    "ko": "서버 연결 확인 필요",
    "en": "Check server connection"
  },
  "adminRegisteredStores": {
    "ko": "현재 등록된 매장 현황",
    "en": "Current Registered Stores"
  },
  // --- src/components/main/sections/MainPTNSSearch.jsx ---
  "ptnsSearchViewMap": {
    "ko": "지도 보기",
    "en": "View Map"
  },
  "ptnsSearchViewList": {
    "ko": "매장 리스트 보기",
    "en": "View Store List"
  },
  // --- src/components/main/sections/MainCS.jsx ---
  "csFileUploadError": {
    "ko": "파일 업로드 또는 전송 중 오류가 발생했습니다.",
    "en": "An error occurred during file upload or transmission."
  },
  // --- src/utils/location.js ---
  "locationNotSupported": {
    "ko": "이 브라우저에서는 위치 정보 기능을 지원하지 않습니다.",
    "en": "This browser does not support location information features."
  },
  "locationFailedToRetrieve": {
    "ko": "현재 위치를 가져오는 데 실패했습니다.",
    "en": "Failed to retrieve current location."
  },
  // --- src/utils/address.js ---
  "kakaoMapServiceNotLoaded": {
    "ko": "카카오 지도 서비스 라이브러리가 로드되지 않았습니다.",
    "en": "Kakao Map Service library has not been loaded."
  },
  "addressConversionFailed": {
    "ko": "주소 변환에 실패했거나 결과가 없습니다.",
    "en": "Address conversion failed or no results."
  },
  // --- src/store/thunks/questionStoreThunk.js ---
  "questionRequestFailed": {
    "ko": "질문 요청 실패",
    "en": "Question request failed"
  },
  // --- src/store/thunks/partnerStoreThunk.js ---
  "coordinateCheckDataToServer": {
    "ko": "📍 [좌표 확인] 서버로 전송할 데이터:",
    "en": "📍 [Coordinate Check] Data to send to server:"
  },
  "networkErrorBackendCheckRequired": {
    "ko": "❌ 네트워크 에러 발생 (백엔드 확인 필요):",
    "en": "❌ Network error occurred (backend check required):"
  },
  // --- src/store/thunks/authThunk.js ---
  "refreshTokenMissingOrExpired": {
    "ko": "리프레시 토큰이 없거나 만료되었습니다.",
    "en": "Refresh token is missing or expired."
  },
  // --- src/routes/Router.jsx ---
  "notFound": {
    "ko": "404 Not Found",
    "en": "404 Not Found"
  },
  // --- src/routes/ProtectedRouter.jsx ---
  "sessionChecking": {
    "ko": "세션 확인 중...",
    "en": "Checking session..."
  },
  "insufficientPermissions": {
    "ko": "권한이 부족하여 사용할 수 없습니다.",
    "en": "You do not have sufficient permissions to use this."
  }
};