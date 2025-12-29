# RBRC
| 항목             | 내용                                                          |
| --------------- | ------------------------------------------------------------- |
| **프로젝트명**    | RainbowRiceCake                                              |
| **설명**         | RainbowRiceCake의 main화면을 담당하는 레파지토리                 |
| **핵심 기능**     | 배송조회 및 manager들의 관리및 사용                              |
| **사용 기술**     | Vite + React 19 (프론트)                                      |

RainbowRiceCake_Main/

RainbowRiceCake_Main/
│
├── src/
│   ├── assets/                # 이미지 및 리소스 리소스
│   │   ├── main-cover.png
│   │   ├── main-logo.png
│   │   ├── resource/          # 소셜 로고 및 아이콘
│   │   └── sliders/           # 캐러샐 로고 데이터
│   ├── components/            # 컴포넌트 단위 구조
│   │   ├── common/            # 공통 UI (Header, Footer, TopButton 등)
│   │   └── main/              # 메인 페이지 관련 컴포넌트
│   │       ├── auth/          # 인증 관련 (Login, Register, MyPage)
│   │       └── sections/      # 메인 화면 구성 섹션들
│   │           ├── MainCS.jsx         # 고객지원
│   │           ├── MainFee.jsx        # 요금 안내
│   │           ├── MainInfo.jsx       # 서비스 소개
│   │           ├── MainPTNS.jsx       # 제휴문의
│   │           └── MainPTNSSearch.jsx # 지점 검색 (카카오맵)
│   ├── context/               # 전역 상태 (LanguageContext)
│   ├── data/                  # JSON 정적 데이터 (PTNSData.json)
│   ├── routes/                # 라우팅 (Router, ProtectedRouter)
│   └── store/                 # Redux 스토어 및 Slice/Thunk
└── index.html