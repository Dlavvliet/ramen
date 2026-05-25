import React, { useState } from 'react';
import OrderPage from '../OrderPage/OrderPage';
import './Cart.css';


export default function Cart({ 
  cart, 
  isOpen, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setIsOrderOpen(true);
  };

  const handleOrderSuccess = () => {
    setIsOrderOpen(false);
    onCheckout();
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'cart-overlay--open' : ''}`} onClick={onClose}>
        <div className={`cart-content ${isOpen ? 'cart-content--open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3>Корзина ({cart.length})</h3>
            <button className="cart-close" onClick={onClose}>×</button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">Корзина пуста</div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item__image" />
                    <div className="cart-item__info">
                      <div className="cart-item__name">{item.name}</div>
                      <div className="cart-item__quantity">
                        <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                        <span className="cart-item__price">{item.price * item.quantity} ₽</span>
                      </div>
                    </div>
                    <button className="cart-item__remove" onClick={() => onRemoveItem(item.id)}>×</button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">Итого: {totalAmount.toLocaleString()} ₽</div>
                <button className="cart-checkout-btn" onClick={handleCheckoutClick} disabled={cart.length === 0}>
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isOrderOpen && (
        <OrderPage
          cart={cart}
          onClose={() => setIsOrderOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
}