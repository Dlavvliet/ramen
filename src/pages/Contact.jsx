import React, { useEffect, useRef, useState } from 'react';
import { FaPhone, FaClock, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

export default function Contact() {
  const mapRef = useRef(null);
  const isMapInited = useRef(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (isMapInited.current) return;
    isMapInited.current = true;

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.REACT_APP_YMAPS_API_KEY}&lang=ru_RU`;
    document.head.appendChild(script);

    script.onload = () => {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [51.6720, 39.1843],
          zoom: 12
        });

        const pizzerias = [
          [51.6720, 39.1843],
          [51.6605, 39.2008],
          [51.6832, 39.2087],
          [51.6451, 39.1654],
          [51.6789, 39.1745],
          [51.6800, 39.1900],
          [51.6650, 39.2100],
          [51.6900, 39.1700]
        ];

        pizzerias.forEach(coords => {
          map.geoObjects.add(
            new window.ymaps.Placemark(coords, {
              hintContent: '🍕 Пиццерия',
              balloonContent: 'Наш филиал пиццерии в Воронеже'
            }, {
              preset: 'islands#orangeCircleDotIcon'
            })
          );
        });
      });
    };
  }, []);

  const copyPhone = () => {
    navigator.clipboard.writeText('+7 (473) 202-30-60');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="main-title">Контакты</h1>
          <p className="mainTxt">8 филиалов по всему Воронежу • Доставка 30 минут • ☎️ +7 (473) 202-30-60</p>
        </div>

        <section className="contactsFlex">
          <div className="contactCard phone-card">
            <FaPhone className="contactIcon" />
            <h3>Заказ по телефону</h3>
            <p className="phoneNum">+7 (473) 202-30-60</p>
            <button className={`copy-button ${copiedPhone ? 'copied' : ''}`} onClick={copyPhone}>
              {copiedPhone ? '✅ Скопировано!' : '📋 Копировать номер'}
            </button>
          </div>

          <div className="contactCard address-card">
            <FaMapMarkerAlt className="contactIcon" />
            <h3>Главный офис</h3>
            <p>ул. Комиссаржевской, 6А<br/>г. Воронеж</p>
          </div>

          <div className="contactCard hours-card">
            <FaClock className="contactIcon" />
            <h3>Режим работы</h3>
            <div className="hoursList">
              <div>Пн-Пт: <span>10:00 - 23:00</span></div>
              <div>Сб-Вс: <span>11:00 - 00:00</span></div>
            </div>
          </div>

          <div className="contactCard email-card">
            <FaEnvelope className="contactIcon" />
            <h3>Написать нам</h3>
            <p>info@pizzavrn.ru</p>
          </div>
        </section>

        <section className="map-section">
          <h2 className="section-title">🗺️ Наши филиалы (8 точек)</h2>
          <p className="map-subtitle">Оранжевые метки - наши пиццерии по всему Воронежу</p>
          <div ref={mapRef} className="map-container" />
        </section>

        <section className="form-section">
          <h2 className="section-title">📝 Оставить заявку</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" placeholder="Ваше имя" required />
              <input type="tel" placeholder="+7 (___) ___-__-__" required />
            </div>
            <input type="email" placeholder="Email (необязательно)" />
            <textarea placeholder="Комментарий к заказу" rows="4"></textarea>
            <button type="submit" className="submit-button">
              {formSubmitted ? '✅ Отправлено!' : 'Отправить заявку'}
            </button>
          </form>
        </section>

        <section className="info-section">
          <h3>💡 Полезная информация</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Доставка:</strong> Бесплатно от 500₽ в радиусе 5 км
            </div>
            <div className="info-item">
              <strong>Самовывоз:</strong> Скидка 15% на все пиццы
            </div>
            <div className="info-item">
              <strong>Акции:</strong> Ежедневно 2+1 по меню
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
