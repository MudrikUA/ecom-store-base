// ProductCarousel.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// CSS стилі (додайте їх у ваш CSS файл)
const styles = `
.product-carousel {
  display: flex;
  align-items: center;
  padding-left:50px
}

.thumbnail-slider {
  width: 100px;
}

.thumbnail-slider .slick-slide {
  // padding: 5px;
  cursor: pointer;
}

.thumbnail-slider img {
  box-sizing: border-box;
  height: 80px;
  object-fit: cover;
  border: 2px solid transparent;
}

.thumbnail-slider .slick-current img {
  border-color: black;
}

.main-slider {
  flex: 1;
}

.main-slider img {
  width: 421px;
  height: 450px;
  object-fit: cover;
}

.slick-prev, .slick-next {
  // width: 100%;
  // height: 20px;
  // background: #f0f0f0;
  z-index: 1;
}

.slick-prev {
  // top: -20px;
  left: auto;
  margin-left: auto;
  margin-right: auto;
  transform:  rotate(90deg);
  margin-bottom: 20px;
}

.slick-next {
  // bottom: -20px;
   right:auto;
   margin-left: auto;
  margin-right: auto;
  transform:  rotate(90deg);
  margin-top: 20px;
}

.slick-prev:before, .slick-next:before {
  color: black;
}

.main-slider .slick-list {
  height: 450px;
  width: 421px;
}

.thumbnail-slider .slick-slide * {
  height: 80px;
  width: 80px;
}

.thumbnail-slider .slick-slider.slick-vertical.slick-initialized{
  display: flex;
  flex-direction: column;
  // align-items: center;
}

.thumbnail-slider .slick-slider.slick-vertical.slick-initialized *{
  position: inherit;
}

.thumbnail-slider .slick-track div{
    height: 87px;
  }
`;

const ProductCarousel = ({images}) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const staticImgPath = `${process.env.REACT_APP_API_URL}/static/`;

  // Налаштування для основного слайдера
  const mainSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    asNavFor: nav2
  };

  // Налаштування для слайдера мініатюр
  const thumbnailSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    focusOnSelect: true,
    asNavFor: nav1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          vertical: false,
          slidesToShow: 4
        }
      }
    ]
  };

  return (
    <>
      <style>{styles}</style>
      <div className="product-carousel">
        <div className="thumbnail-slider">
          <Slider
            {...thumbnailSettings}
            ref={(slider) => setNav2(slider)}
          >
            {images?.map((img, idx) => (
              <div key={idx}>
                <img src={staticImgPath + img} alt={`Thumbnail ${idx + 1}`} width={80} height={80} />
              </div>
            ))}
          </Slider>
        </div>
        <div className="main-slider">
          <Slider
            {...mainSettings}
            ref={(slider) => setNav1(slider)}
          >
            {images?.map((img, idx) => (
              <div key={idx}>
                <img src={staticImgPath + img} alt={`Product ${idx + 1}`} width={421} height={450} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default ProductCarousel;