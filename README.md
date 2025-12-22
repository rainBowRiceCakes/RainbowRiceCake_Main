# RBRC
| 항목             | 내용                                                          |
| --------------- | ------------------------------------------------------------- |
| **프로젝트명**    | RainbowRiceCake                                              |
| **설명**         | RainbowRiceCake의 main화면을 담당하는 레파지토리                 |
| **핵심 기능**     | 배송조회 및 manager들의 관리및 사용                              |
| **사용 기술**     | Vite + React 19 (프론트)                                      |

RainbowRiceCake_Main/
│ 
├── .editorconfig
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/                  # 이미지 및 리소스 폴더
    │   ├── main-cover.png
    │   ├── main-logo.png
    │   ├── resource/
    │   │   ├── google-logo.png
    │   │   ├── main-loginIcon.png
    │   │   └── nav-icons/
    │   │       └── info.svg
    │   └── sliders/
    │       └── sliders-logo1.png
    ├── components/              # 컴포넌트 단위 구조
    │   ├── common/              # 공통 UI (헤더, 푸터 등)
    │   │   ├── CardNav.css / .jsx
    │   │   ├── Footer01.css / .jsx
    │   │   ├── Header01.css / .jsx
    │   │   └── TopButton01.css / .jsx
    │   └── main/                # 메인 페이지 관련
    │       ├── MainShow.css / .jsx
    │       ├── auth/            # 인증 관련 (로그인, 회원가입, 마이페이지)
    │       │   ├── Login.css / .jsx
    │       │   ├── MyPage.css / .jsx
    │       │   └── RegisterForm.css / .jsx
    │       └── sections/        # 메인 화면 구성 섹션들
    │           ├── MainCS.css / .jsx
    │           ├── MainCover.css / .jsx
    │           ├── MainDLVS.css / .jsx
    │           ├── MainFee.css / .jsx
    │           ├── MainInfo.css / .jsx
    │           ├── MainPTNS.css / .jsx
    │           └── MainPTNSSearch.css / .jsx (카카오맵 사용 부분)
    ├── context/                 # 전역 상태 관리 (다국어 등)
    │   └── LanguageContext.jsx
    ├── data/                    # JSON 데이터 및 정적 데이터
    │   ├── PTNSData.json
    │   └── footerData.js
    ├── lang/                    # 다국어 설정 파일
    │   └── langCng.js
    ├── routes/                  # 라우팅 관련
    │   ├── ProtectedRouter.jsx
    │   └── Router.jsx
    └── store/                   # Redux 또는 기타 상태 저장소
        └── store.js