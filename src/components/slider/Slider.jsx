import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgChevronRightO, CgChevronLeftO } from "react-icons/cg";
import './Slider.css';

export default function Slider({ images, autoPlay = true, interval = 5000, height = 700 }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className='fullSlider' style={{ height }}>
      <div className='slider'>
        <div className={`slide-track ${isTransitioning ? 'transition' : ''}`}>
          {images.map((image, index) => (
            <img
              key={index}
              className={`imgSlider ${index === currentIndex ? 'active' : ''}`}
              src={image}
              alt={`slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="slider-overlay">
          <h1 className="slider-title">Добро пожаловать в Ichiraku Ramen!</h1>
          <p className="slider-subtitle">Доставка за 30 минут или сет роллов бесплатно*</p>
          <button className="slider-cta" onClick={() => navigate('/menu')}>Сделать заказ</button>
        </div>

        <button
          className='btnSlidePrev'
          onClick={prevSlide}
          disabled={isTransitioning}
        >
          <CgChevronLeftO className='btnIcon' />
        </button>

        <button
          className='btnSlideNext'
          onClick={nextSlide}
          disabled={isTransitioning}
        >
          <CgChevronRightO className='btnIcon' />
        </button>

        <div className='dots'>
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}