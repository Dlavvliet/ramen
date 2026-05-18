import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CgMail, CgLock } from 'react-icons/cg';
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        alert('Регистрация успешна! Теперь войдите.');
        navigate('/login');
      }
    } catch (err) {
      setError('Ошибка сервера. Проверьте backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">🍣 Регистрация</h2>
      <p className="register-subtitle">Создайте аккаунт для заказа любимой пиццы</p>
      
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <CgMail className="input-icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
            className="register-input"
          />
        </div>
        
        <div className="input-group">
          <CgLock className="input-icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль (минимум 6 символов)"
            required
            minLength="6"
            className="register-input"
          />
        </div>
        
        <button 
          type="submit" 
          className="register-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Создаем аккаунт...' : '🎉 Зарегистрироваться'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
      
      <p className="login-link">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
