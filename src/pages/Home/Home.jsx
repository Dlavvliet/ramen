import { useNavigate } from 'react-router-dom';
import Slider from '../../components/slider/Slider';
import './pages.css';

export default function Home() {
  const navigate = useNavigate();

  const images = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png'
  ];

  return (
    <div>
      <Slider images={images} autoPlay={true} interval={5000} height={700} />

      <section className="features-block">
        <div className="features-container">
          <div className="features-image">
            <img src="/images/home1.png" alt="Рамен" />
          </div>
          <div className="features-content">
            <h2 className="features-title">Настоящий японский рамен</h2>
            <p className="features-text">Бульон на медленном огне 24 часа — почувствуй вкус Японии</p>
            <ul className="features-list">
              <li>🍜 Домашняя лапша ручной работы</li>
              <li>🐟 Рыба с утреннего рынка</li>
              <li>🫙 Мисо собственного приготовления</li>
            </ul>
            <button className="features-cta" onClick={() => navigate('/menu')}>
              Перейти в меню
            </button>
          </div>
        </div>
      </section>

      <div className="twoContainer">
        <div className="left">
          <div className="features-content">
            <h2 className="features-title">Мы открыты по всей России!</h2>
            <p className="features-text">Рестораны рядом с домом и быстрая доставка</p>
            <button className="features-cta" onClick={() => navigate('/menu')}>
              Сделать заказ
            </button>
          </div>
        </div>
        <div className="right">
          <div className="features-image">
            <img src="/images/home2.png" alt="Интерьер ресторана" />
          </div>
        </div>
      </div>

      <div className='threeContainer'>
        <div className="features-image">
          <img src="/images/home3.png" alt="Суши и роллы" />
        </div>
        <div className='threeCont'>
          <h2 className="features-title">И не только рамен!</h2>
          <p className="features-text">Суши, роллы, гёдза и японские напитки</p>
          <button className="features-cta" onClick={() => navigate('/menu')}>
            Сделать заказ
          </button>
        </div>
        <div className="features-image">
          <img src="/images/home4.png" alt="Японские десерты" />
        </div>
      </div>

    </div>
  );
}