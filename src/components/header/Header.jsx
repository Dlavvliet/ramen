import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };
  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  // Получаем инициалы из email
  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className={visible ? 'nav-visible' : 'nav-hidden'}>
      <div className="noHover">
        <Link to="/">
          <img className="logo" src="logo.png" alt="Логотип" />
        </Link>
      </div>

      <div><Link to="/">Главная</Link></div>
      <div><Link to="/menu">Меню</Link></div>
      <div><Link to="/about">О нас</Link></div>
      <div><Link to="/contact">Контакты</Link></div>

      {user ? (
        <div className="btnHeader">
          <div className="avatar-wrapper" ref={menuRef}>
            <button
              className="avatar-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню профиля"
            >
              {user.avatar
                ? <img src={`http://localhost:3001${user.avatar}`} alt="Аватар" className="avatar-photo" />
                : <span className="avatar-initials">{getInitials(user.email)}</span>
              }
            </button>

            {menuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-email">{user.email}</div>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleProfile}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Профиль
                </button>

                <hr className="dropdown-divider" />
                <button className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="btnHeader">
          <button onClick={handleRegister}>Регистрация</button>
          <button onClick={handleLogin}>Войти</button>
        </div>
      )}
    </nav>
  );
}