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

  // [수정] 무한 롤링을 위해 원본 배열을 2배로 복제하여 연결
  const loopedImages = [...images, ...images];

  return (
    // --quantity 값도 복제된 개수에 맞춰 업데이트 (CSS에서 필요할 경우를 대비)
    <div className="carousel-container" style={{ '--quantity': loopedImages.length }}>
      <div className="carousel-track">
        
        {/* [수정] 원본(images) 대신 복제된 배열(loopedImages)을 순회 */}
        {loopedImages.map((img, index) => (
          <div 
            className="carousel-slide" 
            /* 배열을 합쳤기 때문에 map의 index는 0부터 (2 * N - 1)까지 생성됩니다.
               따라서 단순히 index를 key로 사용해도 중복되지 않아 안전합니다.
            */
            key={index}
          >
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