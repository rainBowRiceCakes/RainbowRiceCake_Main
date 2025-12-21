/**
 * @file src/components/main/sections/Carousel.jsx
 * @description 파트너 로고 캐러샐
 * 251219 v1.0.0 jun init
 */

import './Carousel.css';

// 이미지 import
import logo1 from '../../assets/sliders/sliders-logo1.png';
import logo2 from '../../assets/sliders/sliders-logo2.png';
import logo3 from '../../assets/sliders/sliders-logo3.png';
import logo4 from '../../assets/sliders/sliders-logo4.png';
import logo5 from '../../assets/sliders/sliders-logo5.png';
import logo6 from '../../assets/sliders/sliders-logo6.png';
import logo7 from '../../assets/sliders/sliders-logo7.png';
import logo8 from '../../assets/sliders/sliders-logo8.png';
import logo9 from '../../assets/sliders/sliders-logo9.png';

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
      <div className="carousel-track">
        {loopedLogos.map((logo, index) => (
          <div className="carousel-item" key={index}>
            <img src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;