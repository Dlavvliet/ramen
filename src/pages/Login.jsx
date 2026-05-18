import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CgMail, CgLock } from 'react-icons/cg';
import './Login.css';

export default function Login() {
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
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('token', data.token);
        navigate('/');
        window.location.reload(); // Обновляем Header
      }
    } catch (err) {
      setError('Ошибка сервера. Проверьте backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">🍣 Вход</h2>
      <p className="login-subtitle">Добро пожаловать обратно в Ichiraku Ramen!</p>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <CgMail className="input-icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
            className="login-input"
          />
        </div>
        
        <div className="input-group">
          <CgLock className="input-icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
            className="login-input"
          />
        </div>
        
        <button 
          type="submit" 
          className="login-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Входим...' : '🚀 Войти'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
      
      <p className="register-link">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
