/**
 * @file src/components/main/sections/Carousel.jsx
 * @description 파트너 로고 캐러샐
 * 251219 v1.0.0 jun init
 */

import './Carousel.css';

// 이미지 import
const logo1 = "/sliders/sliders-logo1.png";
const logo2 = "/sliders/sliders-logo2.png";
const logo3 = "/sliders/sliders-logo3.png";
const logo4 = "/sliders/sliders-logo4.png";
const logo5 = "/sliders/sliders-logo5.png";
const logo6 = "/sliders/sliders-logo6.png";
const logo7 = "/sliders/sliders-logo7.png";
const logo8 = "/sliders/sliders-logo8.png";
const logo9 = "/sliders/sliders-logo9.png";

// import한 변수를 src에 할당
const logos = [
  { id: 1, src: logo1, alt: 'Partner 1' },
  { id: 2, src: logo2, alt: 'Partner 2' },
  { id: 3, src: logo3, alt: 'Partner 3' },
  { id: 4, src: logo4, alt: 'Partner 4' },
  { id: 5, src: logo5, alt: 'Partner 5' },
  { id: 6, src: logo6, alt: 'Partner 6' },
  { id: 7, src: logo7, alt: 'Partner 7' },
  { id: 8, src: logo8, alt: 'Partner 8' },
  { id: 9, src: logo9, alt: 'Partner 9' },
];

const Carousel = () => {
  // 배열을 2배로 늘려서 [1,2,3,4,5, 1,2,3,4,5] 형태로 만듦
  // 이렇게 해야 애니메이션이 끝까지 갔을 때 뚝 끊기지 않고 자연스럽게 이어짐
  const loopedLogos = [...logos, ...logos];

  return (
    <section className="carousel-container">
      <div className="mainshow-section-wrapper">
        <div className="carousel-track">
          {loopedLogos.map((logo, index) => (
            <div className="carousel-item" key={index}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;