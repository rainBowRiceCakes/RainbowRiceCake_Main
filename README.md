# 🌈 DGD - RainbowRiceCake

## 🔗 배포 링크 (Live Demo)
현재 프로젝트는 다음 URL에서 직접 확인하실 수 있습니다:
**[https://app2.green-meerkat.kro.kr/](https://app2.green-meerkat.kro.kr/)**

*(참고: 서버는 별도로 구성되어 운영 중이며, 위 링크를 통해 전체 서비스를 실시간으로 확인하실 수 있습니다.)*

---

## 📋 프로젝트 소개 (Project Introduction)
**DGD**은 사용자와 파트너(가맹점), 그리고 라이더를 연결하는 **통합 배달/서비스 플랫폼**입니다.
이 프로젝트는 **RainbowRiceCake**라는 팀명으로 협업 프로젝트로 개발되었으며, React 생태계를 기반으로 한 최신 웹 기술을 활용하여 빠르고 직관적인 사용자 경험을 제공합니다.

사용자는 서비스를 이용하고 조회할 수 있으며, 파트너는 매장 및 주문을 관리하고, 라이더는 배달 업무를 효율적으로 수행할 수 있도록 역할별로 최적화된 인터페이스를 제공합니다.

---

## 🚀 주요 기능 (Key Features)

### 👤 일반 사용자 (User)
*   **랜딩 페이지**: 서비스 소개, 요금제 안내, 제휴 문의 등 다양한 정보 제공.
*   **지점 찾기**: Kakao Maps API를 연동하여 가까운 지점 검색 및 위치 확인.
*   **고객 지원**: FAQ, 공지사항 및 문의 접수 기능.
*   **로그인/회원가입**: 소셜 로그인 지원 및 JWT 기반 인증.
*   **마이페이지**: 개인 정보 관리 및 이용 내역 조회.

### 🏪 파트너 (Partner)
*   **전용 대시보드**: 매장 관리 및 주문 현황을 한눈에 파악.
*   **메뉴 및 매장 관리**: 메뉴 등록, 수정 및 매장 정보 설정.
*   **정산 관리**: 매출 및 정산 내역 조회.
*   **프로모션**: 프로모션 등록 및 관리 기능.

### 🛵 라이더 (Rider)
*   **배달 업무 지원**: 배차 관리 및 배달 상태 업데이트.
*   **마이페이지**: 배달 이력 및 정산 내역 확인.
*   **실시간 위치**: (예정) 배달 경로 및 위치 기반 서비스.

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
*   **Core**: `React 19`, `Vite` (Build Tool)
*   **State Management**: `Redux Toolkit`, `Redux Thunk`
*   **Routing**: `React Router DOM v7`
*   **Styling**: `CSS Modules`, `Framer Motion` (Animation)
*   **PWA**: `vite-plugin-pwa` (Progressive Web App support)

### Network & Data
*   **HTTP Client**: `Axios`
*   **Data Handling**: `ExcelJS`, `File Saver` (엑셀 다운로드 기능)
*   **Date Utility**: `Dayjs`

### External APIs
*   **Maps**: `React Kakao Maps SDK` (카카오맵 연동)
*   **Postcode**: `React Daum Postcode` (주소 검색)
*   **Charts**: `React Chartjs 2` (데이터 시각화)

---

## 📂 폴더 구조 (Folder Structure)

```
src/
├── api/             # Axios 인스턴스 및 API 유틸리티
├── components/      # UI 컴포넌트
│   ├── admin/       # 관리자 전용 컴포넌트
│   ├── common/      # 공통 컴포넌트 (헤더, 푸터, 모달 등)
│   ├── main/        # 메인 페이지 및 일반 사용자용 컴포넌트
│   ├── partner/     # 파트너(가맹점) 전용 컴포넌트
│   └── rider/       # 라이더 전용 컴포넌트
├── constants/       # 상수 데이터 (주문 상태 등)
├── context/         # React Context (다국어 지원 등)
├── data/            # 더미 데이터 및 정적 데이터 파일
├── lang/            # 다국어 설정 파일
├── routes/          # 라우팅 설정 및 레이아웃
├── store/           # Redux 스토어 및 Slice, Thunk
└── utils/           # 공통 유틸리티 함수 (주소 변환, 랜덤 생성 등)
```

---

## 💿 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 1. 레포지토리 클론 (Clone Repository)
```bash
git clone <repository-url>
cd RainbowRiceCake_Main
```

### 2. 패키지 설치 (Install Dependencies)
```bash
npm install
```

### 3. 개발 서버 실행 (Run Development Server)
```bash
npm run dev
```

### 4. 빌드 (Build)
```bash
npm run build
```

---

## 📝 라이선스 (License)
This project is licensed under the MIT License.
