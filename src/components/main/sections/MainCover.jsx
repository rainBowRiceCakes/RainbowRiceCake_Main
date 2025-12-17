/**
 * @file src/components/main/sections/MainCover.jsx
 * @description 메인 첫화면 섹션
 * 251216 v1.0.0 sara init 
 */

import './MainCover.css';
import MaincoverImg from "../../../assets/main-cover.png";

export default function MainCover() {
  return (
    <div className="maincover-frame">
      
{/* 1. 상단 히어로 이미지 영역 - 이미지 태그로 변경 */}
      <div className="maincover-image-area">
        <div className="maincover-image-wrapper">
          {/* ✅ 텍스트 오버레이 제거 및 img 태그로 대체 */}
          <img 
            src={MaincoverImg} 
            alt="우리 서비스 이미지 (1020*500)" 
            className="maincover-cover-image"
          /> 
        </div>
      </div>
      
{/* 2. 하단 배송 조회 컨테이너 박스 영역 (FORM 태그 사용) */}
      <div className="maincover-delivery-area">
        <form className="maincover-delivery-form">
            <div className="maincover-delivery-title-text">배송 조회</div>
            <div className="maincover-input-group">
                <input 
                    type="text" 
                    placeholder="주문 번호를 입력해주세요" 
                    className="maincover-input-field" 
                />
                <button type="submit" className="maincover-submit-button">
                    조회
                </button>
            </div>
            <div className="maincover-link-group">
                <a href="#more-delivery" className="maincover-more-link" >
                    내 배송 현황 보러가기
                </a>
            </div>
        </form>
      </div>
    </div>
  );
}