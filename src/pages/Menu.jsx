import React, { useRef, useEffect, useState, useMemo } from 'react';
import './Menu.css';
import Cart from './Cart';

const API_URL = 'http://localhost:3001';

export default function Menu() {
  const contentRefs = useRef([]);
  const [products, setProducts] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Загружаем корзину из localStorage при первом рендере
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const menuItems = useMemo(() => [
    'Суши',
    'Роллы',
    'Закуски',
    'Основные блюда',
    'Супы',
    'Десерты'
  ], []);

  const scrollToContent = (index) => {
    contentRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  };

  // Загрузка товаров
  useEffect(() => {
    menuItems.forEach((cat) => {
      fetch(`${API_URL}/products?category=${encodeURIComponent(cat)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(prev => ({ ...prev, [cat]: data }));
        })
        .catch(err => console.error('Ошибка загрузки категории:', cat, err));
    });
  }, [menuItems]);

  // Сохраняем корзину в localStorage каждый раз, когда она меняется
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Добавление в корзину
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart(prev => [...prev, { ...product, quantity: 1 }]);
    }
    setExpandedProduct(null);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleCheckout = () => {
    console.log('Оформление заказа:', cart);
    setIsCartOpen(false);
    // Если хочешь очищать корзину после оформления заказа — раскомментируй:
    // setCart([]);
  };

  const closeModal = () => setExpandedProduct(null);

  const handleCardClick = (product) => {
    setExpandedProduct(product);
  };

  return (
    <div className="menu-container">
      <div className='menuTitle'>Меню</div>

      <div className="menu-nav">
        {menuItems.map((item, index) => (
          <button
            key={item}
            className="nav-button"
            onClick={() => scrollToContent(index)}
          >
            {item}
          </button>
        ))}
        
        <button className="mainCorzBtn" onClick={toggleCart}>
          🛒 Корзина ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>

      {menuItems.map((item, index) => (
        <section
          key={item}
          ref={el => contentRefs.current[index] = el}
          className="content-section"
        >
          <h2>{item}</h2>
          <div className="menu-grid">
            {(products[item] || []).map(product => (
              <div 
                key={product.id} 
                className="menu-card"
                onClick={() => handleCardClick(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(product);
                  }
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="menu-card__photo"
                />
                <h3 className="menu-card__name">{product.name}</h3>
                <p className="menu-card__description">
                  {product.description}
                </p>
                <div className="menu-card__footer">
                  <span className="menu-card__price">
                    {product.price} ₽
                  </span>
                  <button className="menu-card__btn">
                    Выбрать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Модальное окно */}
      {expandedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-card">
              <img
                src={expandedProduct.image}
                alt={expandedProduct.name}
                className="modal-cardPht"
              />
              
              <div className="modal-card__content">
                <h2 className="modal-card__name">{expandedProduct.name}</h2>
                <p className="modal-card__description">
                  {expandedProduct.description}
                </p>
                
                <div className="modal-card__footer">
                  <span className="modal-card__price">
                    {expandedProduct.price} ₽
                  </span>
                  <button 
                    className="modal-cardBtnCorz"
                    onClick={() => addToCart(expandedProduct)}
                  >
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Cart
        cart={cart}
        isOpen={isCartOpen}
        onClose={toggleCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}