import { Link } from 'react-router-dom';
import './About.css';
import Accordion from '../../components/accordion/Accordion';

const faqData = [
  {
    question: 'Как долго варится бульон?',
    answer: 'Наш бульон варится на медленном огне 24 часа. Это позволяет извлечь максимум вкуса и питательных веществ из костей и овощей, создавая насыщенную основу для рамена.'
  },
  {
    question: 'Есть ли вегетарианские блюда?',
    answer: 'Да! У нас есть вегетарианские и веганские варианты рамена на основе мисо и овощного бульона. Также доступны вегетарианские роллы, гёдза с овощной начинкой и салаты.'
  },
  {
    question: 'Как быстро осуществляется доставка?',
    answer: 'Мы доставляем заказы в течение 30 минут. Если доставка задержится — вы получаете сет роллов бесплатно. Работаем ежедневно с 10:00 до 23:00.'
  },
  {
    question: 'Используете ли вы свежие ингредиенты?',
    answer: 'Рыба и морепродукты поступают с утреннего рынка каждый день. Овощи — сезонные, от проверенных поставщиков. Лапша делается вручную прямо на кухне каждое утро.'
  }
];

export default function About() {
  return (
    <div className="about-wrapper">
      <div className='containerAbout'>
        <h2 className='titleAbout'>О нас</h2>
        <div className='posterAbout'>
          <img src='images/AboutPoster.png' alt='Ichiraku Ramen - вкус Японии' />
        </div>
        
        <div className='textBlock'>
          <h3>Добро пожаловать в Ichiraku Ramen!</h3>
          <p>
            Мы создаём настоящую японскую кухню с 2018 года. 
            Наши повара из Токио и Осаки используют традиционные рецепты и 
            свежайшие ингредиенты каждый день.
          </p>
          <p>
            Бульон на медленном огне 24 часа, домашняя лапша ручной работы, 
            рыба с утреннего рынка — только лучшее для вас!
          </p>
          
          <div className='stats'>
            <div className='stat'>
              <span className='number'>50 000+</span>
              <span>блюд приготовлено</span>
            </div>
            <div className='stat'>
              <span className='number'>98%</span>
              <span>довольных клиентов</span>
            </div>
          </div>
          
          <div className='principleSection'>
            <h4 className='principlesTitle'>Наши принципы</h4>
            <div className='cardsPrinciples'>
              <div className='principlesCard'>
                <div className='principlesIcon'>🍜</div>
                <h5>Традиции Японии</h5>
                <p>Аутентичные рецепты из сердца Азии</p>
              </div>
              <div className='principlesCard'>
                <div className='principlesIcon'>🐟</div>
                <h5>Свежие ингредиенты</h5>
                <p>Только сезонные продукты и рыба с рынка</p>
              </div>
              <div className='principlesCard'>
                <div className='principlesIcon'>🫙</div>
                <h5>Ферментация</h5>
                <p>Мисо и соусы собственного приготовления</p>
              </div>
              <div className='principlesCard'>
                <div className='principlesIcon'>❤️</div>
                <h5>С душой</h5>
                <p>Каждое блюдо — произведение искусства</p>
              </div>
            </div>
          </div>

          <div className='gallerySection'>
            <h4 className='galleryTitle'>Наш ресторан</h4>
            <div className='galleryGrid'>
              <div className='galleryItem'>
                <img src='images/restaurant1.png' alt='Интерьер ресторана' />
              </div>
              <div className='galleryItem'>
                <img src='images/restaurant2.png' alt='Зал ресторана' />
              </div>
              <div className='galleryItem'>
                <img src='images/restaurant3.png' alt='Кухня ресторана' />
              </div>
              <div className='galleryItem'>
                <img src='images/restaurant4.png' alt='Атмосфера ресторана' />
              </div>
            </div>
          </div>

          <div className='partnersSection'>
            <h4 className='partnersTitle'>Наши партнеры</h4>
            <div className='partnersGrid'>
              <div className='partnerLogo'>
                <img src='images/inarctica.png'/>
                <span>INARCTICA</span>
              </div>
              <div className='partnerLogo'>
                <img src='images/umami.png'/>
                <span>Умами Трейд</span>
              </div>
              <div className='partnerLogo'>
                <img src='images/rispole.png'/>
                <span>"Рисовые поля"</span>
              </div>
              <div className='partnerLogo'>
                <img src='images/soevikrai.png'/>
                <span>Соевый край</span>
              </div>
            </div>
          </div>

          <Accordion title="Частые вопросы" items={faqData} />

          <Link to="/menu" className='orderBtn'>Заказать сейчас</Link>
        </div>
      </div>
    </div>
  );
}