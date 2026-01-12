/**
 * @file src/components/main/common/Carousel.jsx
 * @description 파트너 로고 캐러샐
 * 251219 v1.0.0 jun init
 */

import './Carousel.css';

/**
 * @param {Object} props
 * @param {Array<{url: string}>} props.images - 로고 이미지 URL 객체 배열
 */
export default function Carousel({ images = [] }) {
  // 방어 코드: 데이터가 없으면 렌더링하지 않음 (빈 공간 방지)
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container" style={{ '--quantity': images.length }}>
      <div className="carousel-track">
        {/* 로고 렌더링 처리 */}
        {images.map((img, index) => (
          <div className="carousel-slide" key={index}>
            <img 
              src={img.url} 
              alt={`Partner Logo ${index}`} 
              className="partner-logo"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        ))}
        
      </div>
    </div>
  );
}