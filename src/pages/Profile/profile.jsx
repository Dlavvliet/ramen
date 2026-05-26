import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const API = 'http://localhost:3001';

const getToken = () => localStorage.getItem('token');
const parseToken = (token) => JSON.parse(atob(token.split('.')[1]));
const saveToken = (token) => {
  localStorage.setItem('token', token);
  return parseToken(token);
};

const UploadIcon = ({ size = 36, color = 'currentColor', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [status, setStatus] = useState({ type: '', section: '', message: '' });
  const [loading, setLoading] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate('/login'); return; }
    const payload = parseToken(token);
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    setUser(payload);
    setEmail(payload.email || '');
    if (payload.avatar) setAvatarPreview(`${API}${payload.avatar}`);
  }, [navigate]);

  const setMsg = (section, type, message) => {
    setStatus({ section, type, message });
    if (type === 'success') setTimeout(() => setStatus({ type: '', section: '', message: '' }), 3000);
  };

  const apiRequest = async (url, options) => {
    const res = await fetch(`${API}${url}`, {
      ...options,
      headers: { 'Authorization': `Bearer ${getToken()}`, ...options.headers }
    });
    const data = await res.json();
    return { ok: res.ok, data };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    setLoading('avatar');
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const { ok, data } = await apiRequest('/user/avatar', { method: 'POST', body: formData });
    if (!ok) return setMsg('avatar', 'error', data.error || 'Ошибка загрузки');
    setUser(saveToken(data.token));
    setAvatarPreview(`${API}${data.avatar}`);
    setAvatarFile(null);
    setMsg('avatar', 'success', 'Аватар успешно обновлён');
    setLoading('');
  };

  const handleDeleteAvatar = async () => {
    setLoading('avatar');
    const { ok, data } = await apiRequest('/user/avatar', { method: 'DELETE' });
    if (!ok) return setMsg('avatar', 'error', data.error || 'Ошибка удаления');
    setUser(saveToken(data.token));
    setAvatarPreview(null);
    setAvatarFile(null);
    setMsg('avatar', 'success', 'Аватар удалён');
    setLoading('');
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setLoading('email');
    const { ok, data } = await apiRequest('/user/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!ok) return setMsg('email', 'error', data.error || 'Ошибка обновления');
    setUser(saveToken(data.token));
    setMsg('email', 'success', 'Email успешно обновлён');
    setLoading('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return setMsg('password', 'error', 'Пароли не совпадают');
    if (passwords.next.length < 6) return setMsg('password', 'error', 'Минимум 6 символов');
    setLoading('password');
    const { ok, data } = await apiRequest('/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next })
    });
    if (!ok) return setMsg('password', 'error', data.error || 'Ошибка обновления');
    setPasswords({ current: '', next: '', confirm: '' });
    setMsg('password', 'success', 'Пароль успешно изменён');
    setLoading('');
  };

  const StatusMsg = ({ section }) => {
    if (status.section !== section || !status.message) return null;
    return <div className={status.type === 'success' ? 'profile-success' : 'profile-error'}>
      {status.type === 'success' ? '✓ ' : ''}{status.message}
    </div>;
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div className="profile-header-info">
            <h1>{user.email}</h1>
            <p>Аккаунт активен</p>
          </div>
        </div>

        {/* Аватар */}
        <div className="profile-card">
          <h2 className="profile-card-title">Фото профиля</h2>
          <StatusMsg section="avatar" />
          <div className="avatar-upload-area">
            <div className="avatar-upload-preview-wrap">
              <div className="avatar-upload-preview" onClick={() => fileInputRef.current.click()}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="Предпросмотр" />
                  : <div className="avatar-upload-placeholder">
                      <UploadIcon size={36} />
                      <span>Выбрать фото</span>
                    </div>
                }
                <div className="avatar-upload-overlay">
                  <UploadIcon size={26} color="white" strokeWidth={2} />
                </div>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
            <div className="avatar-upload-actions">
              <p className="avatar-hint">JPG, PNG или WebP · до 5 МБ</p>
              <div className="avatar-btns">
                {avatarFile && <button className="profile-btn" onClick={handleUploadAvatar} disabled={loading === 'avatar'}>{loading === 'avatar' ? 'Загружаем...' : 'Сохранить фото'}</button>}
                {user.avatar && !avatarFile && <button className="profile-btn profile-btn--danger" onClick={handleDeleteAvatar} disabled={loading === 'avatar'}>Удалить фото</button>}
                <button className="profile-btn profile-btn--outline" onClick={() => fileInputRef.current.click()}>{avatarPreview ? 'Сменить фото' : 'Выбрать фото'}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2 className="profile-card-title">Изменить Email</h2>
          <StatusMsg section="email" />
          <form onSubmit={handleSaveEmail} className="profile-form">
            <div className="form-group">
              <label>Новый Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <button type="submit" className="profile-btn" disabled={loading === 'email'}>{loading === 'email' ? 'Сохраняем...' : 'Сохранить Email'}</button>
          </form>
        </div>

        <div className="profile-card">
          <h2 className="profile-card-title">Изменить пароль</h2>
          <StatusMsg section="password" />
          <form onSubmit={handleChangePassword} className="profile-form">
            {[['current', 'Текущий пароль'], ['next', 'Новый пароль'], ['confirm', 'Повторите новый пароль']].map(([key, label]) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input type="password" value={passwords[key]} onChange={(e) => setPasswords(p => ({ ...p, [key]: e.target.value }))} placeholder="••••••••" required />
              </div>
            ))}
            <button type="submit" className="profile-btn" disabled={loading === 'password'}>{loading === 'password' ? 'Сохраняем...' : 'Изменить пароль'}</button>
          </form>
        </div>

      </div>
    </div>
  );
}