import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Верхняя часть */}
        <div className="footer-top">
          <div className="footer-brand">
            <h3>🍣 Ichiraku Ramen</h3>
            <p>Лучшая пицца в твоем городе!</p>
          </div>
          
          <div className="footer-menu">
            <div className="footer-column">
              <h4>Меню</h4>
              <ul>
                <li><a href="/menu">Меню</a></li>
                <li><a href="/menu#wok">Вок</a></li>
                <li><a href="/menu#combo">Комбо</a></li>
                <li><a href="/menu#drinks">Напитки</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Компания</h4>
              <ul>
                <li><a href="/about">О нас</a></li>
                <li><a href="/delivery">Доставка</a></li>
                <li><a href="/payment">Оплата</a></li>
                <li><a href="/contacts">Контакты</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-contacts">
            <h4>Связаться с нами</h4>
            <div className="contact-item">
              <span>📞</span>
              <a href="tel:+78001234567">8 (951) 123-45-67</a>
            </div>
            <div className="contact-item">
              <span>💬</span>
              <a href="https://max.ru">Max</a>
            </div>
            <div className="social-links">
              <a href="#" aria-label="VK">VK</a>
              <a href="#" aria-label="Telegram">Telegram</a>
              <a href="#" aria-label="Max">Max</a>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="footer-bottom">
          <div className="footer-info">
            <p>&copy; 2025 PizzaMaster. Все права защищены.</p>
            <div className="footer-links">
              <a href="/privacy">Политика конфиденциальности</a>
              <a href="/terms">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;