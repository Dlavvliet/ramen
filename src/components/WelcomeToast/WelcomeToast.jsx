import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './WelcomeToast.css';

export default function WelcomeToast() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState({ email: '', type: '' });

  useEffect(() => {
    // Проверяем, пришел ли welcomeEmail из роутера
    if (location.state?.welcomeEmail) {
      setToastData({
        email: location.state.welcomeEmail,
        type: location.state.type || 'login' // по умолчанию 'login'
      });
      setShow(true);

      // Скрываем плашку через 4 секунды
      const timer = setTimeout(() => {
        setShow(false);
        // Очищаем state истории, чтобы уведомление не дублировалось при обычном F5
        window.history.replaceState({}, document.title);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  if (!show) return null;

  return (
    <div className="welcome-toast">
      {toastData.type === 'register' ? (
        <span>🎉 Вы успешно зарегистрировались!</span>
      ) : (
        <span>👋 Добро пожаловать, <span className="toast-email">{toastData.email}</span>!</span>
      )}
    </div>
  );
}