/**
 * @file src/components/main/MainShow.jsx
 * @description 메인 페이지(app) 
 * 251216 v1.0.0 sara init 
 */

import MainCover from './sections/MainCover';
import MainInfo from './sections/MainInfo';
import MainFee from './sections/MainFee'; 
import MainDLVS from './sections/MainDLVS'; 
import MainCS from './sections/MainCS'; 
import MainPTNS from './sections/MainPTNS'; 
import './MainShow.css';

export default function MainShow() {
  return (
    <div className="mainshow-page-container">
      {/* 1. 커버이미지 + 배송조회 섹션 */}
      <MainCover />
      
      {/* 2. 서비스 소개 섹션 */}
      <MainInfo />

      {/* 3. 가격 / 지점 안내 섹션 */}
      <MainFee />

      {/* 4. 배송 조회 섹션 */}
      <MainDLVS />

      {/* 5. 고객센터 섹션 */}
      <MainCS />

      {/* 6. 파트너십 섹션 */}
      <MainPTNS />
    </div>
  );
};