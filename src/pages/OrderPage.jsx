import React, { useState } from 'react';
import './OrderPage.css';

export default function OrderPage({ cart, onClose, onOrderSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
    paymentMethod: 'cash'
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const orderData = {
        items: cart,
        totalAmount,
        customer: formData,
        orderDate: new Date().toISOString(),
        status: 'new'
      };

      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Заказ создан:', data);
        onOrderSuccess();
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCart = () => {
    onClose();
  };

  return (
    <div className="order-overlay" onClick={onClose}>
      <div className="order-container" onClick={(e) => e.stopPropagation()}>
        <div className="order-header">
          <h2>Оформление заказа</h2>
          <button className="order-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-body">
          {/* Итоги корзины */}
          <div className="order-summary">
            <h3>Ваш заказ:</h3>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">×{item.quantity}</span>
                  </div>
                  <span className="order-item-price">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Итого: {totalAmount.toLocaleString()} ₽</strong>
            </div>
          </div>

          {/* Форма заказа */}
          <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя и фамилия *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Иван Иванов"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Телефон *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+7 (900) 123-45-67"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Адрес доставки *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="г. Воронеж, ул. Ленина, д. 10, кв. 5"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Комментарий к заказу</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Особые пожелания, этаж, домофон..."
                rows="3"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Способ оплаты</label>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span>Наличными курьеру</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span>Картой курьеру</span>
                </label>
              </div>
            </div>

            <div className="order-actions">
              <button 
                type="button" 
                className="back-btn"
                onClick={handleBackToCart}
                disabled={isLoading}
              >
                ← Назад к корзине
              </button>
              <button 
                type="submit" 
                className="submit-order-btn"
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? 'Отправка...' : 'Оформить заказ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
