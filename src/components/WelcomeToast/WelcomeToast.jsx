import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './WelcomeToast.css';

export default function WelcomeToast() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Проверяем, передал ли какой-то роут нам email в состоянии
    if (location.state?.welcomeEmail) {
      setEmail(location.state.welcomeEmail);
      setShow(true);

      // Скрываем плашку через 4 секунды
      const timer = setTimeout(() => {
        setShow(false);
        // Стираем state из истории браузера, чтобы уведомление не всплывало повторно при F5
        window.history.replaceState({}, document.title);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  if (!show) return null;

  return (
    <div className="welcome-toast">
      👋 Добро пожаловать, <span className="toast-email">{email}</span>!
    </div>
  );
}