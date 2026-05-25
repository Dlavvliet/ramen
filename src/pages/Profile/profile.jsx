import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const API = 'http://localhost:3001';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [successEmail, setSuccessEmail] = useState('');
  const [successPassword, setSuccessPassword] = useState('');
  const [successAvatar, setSuccessAvatar] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorAvatar, setErrorAvatar] = useState('');

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
    setEmail(payload.email || '');
    if (payload.avatar) setAvatarPreview(`${API}${payload.avatar}`);
  }, [navigate]);

  const getInitials = (emailStr) => emailStr ? emailStr.charAt(0).toUpperCase() : '?';

  // Предпросмотр выбранного файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setErrorAvatar('');
    setSuccessAvatar('');
    setLoadingAvatar(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const res = await fetch(`${API}/user/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorAvatar(data.error || 'Ошибка загрузки');
      } else {
        localStorage.setItem('token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser(payload);
        setAvatarPreview(`${API}${data.avatar}`);
        setAvatarFile(null);
        setSuccessAvatar('Аватар успешно обновлён');
        setTimeout(() => setSuccessAvatar(''), 3000);
      }
    } catch {
      setErrorAvatar('Ошибка соединения с сервером');
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setErrorAvatar('');
    setSuccessAvatar('');
    setLoadingAvatar(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/user/avatar`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorAvatar(data.error || 'Ошибка удаления');
      } else {
        localStorage.setItem('token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser(payload);
        setAvatarPreview(null);
        setAvatarFile(null);
        setSuccessAvatar('Аватар удалён');
        setTimeout(() => setSuccessAvatar(''), 3000);
      }
    } catch {
      setErrorAvatar('Ошибка соединения с сервером');
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setErrorEmail('');
    setSuccessEmail('');
    setLoadingEmail(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/user/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorEmail(data.error || 'Ошибка обновления');
      } else {
        localStorage.setItem('token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser(payload);
        setSuccessEmail('Email успешно обновлён');
        setTimeout(() => setSuccessEmail(''), 3000);
      }
    } catch {
      setErrorEmail('Ошибка соединения с сервером');
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorPassword('');
    setSuccessPassword('');

    if (newPassword !== confirmPassword) { setErrorPassword('Пароли не совпадают'); return; }
    if (newPassword.length < 6) { setErrorPassword('Пароль должен содержать минимум 6 символов'); return; }

    setLoadingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorPassword(data.error || 'Ошибка обновления');
      } else {
        setSuccessPassword('Пароль успешно изменён');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setTimeout(() => setSuccessPassword(''), 3000);
      }
    } catch {
      setErrorPassword('Ошибка соединения с сервером');
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Шапка */}
        <div className="profile-header">
          <div className="profile-header-info">
            <h1>{user.email}</h1>
            <p>Аккаунт активен</p>
          </div>
        </div>

        {/* Аватар */}
        <div className="profile-card">
          <h2 className="profile-card-title">Фото профиля</h2>
          {successAvatar && <div className="profile-success">✓ {successAvatar}</div>}
          {errorAvatar && <div className="profile-error">{errorAvatar}</div>}

          <div className="avatar-upload-area">
            <div className="avatar-upload-preview-wrap">
              <div
                className="avatar-upload-preview"
                onClick={() => fileInputRef.current.click()}
              >
                {avatarPreview
                  ? <img src={avatarPreview} alt="Предпросмотр" />
                  : <div className="avatar-upload-placeholder">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Выбрать фото</span>
                    </div>
                }
                <div className="avatar-upload-overlay">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div className="avatar-upload-actions">
              <p className="avatar-hint">JPG, PNG или WebP · до 5 МБ</p>
              <div className="avatar-btns">
                {avatarFile && (
                  <button
                    className="profile-btn"
                    onClick={handleUploadAvatar}
                    disabled={loadingAvatar}
                  >
                    {loadingAvatar ? 'Загружаем...' : 'Сохранить фото'}
                  </button>
                )}
                {user.avatar && !avatarFile && (
                  <button
                    className="profile-btn profile-btn--danger"
                    onClick={handleDeleteAvatar}
                    disabled={loadingAvatar}
                  >
                    Удалить фото
                  </button>
                )}
                <button
                  className="profile-btn profile-btn--outline"
                  onClick={() => fileInputRef.current.click()}
                >
                  {avatarPreview ? 'Сменить фото' : 'Выбрать фото'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="profile-card">
          <h2 className="profile-card-title">Изменить Email</h2>
          {successEmail && <div className="profile-success">✓ {successEmail}</div>}
          {errorEmail && <div className="profile-error">{errorEmail}</div>}
          <form onSubmit={handleSaveEmail} className="profile-form">
            <div className="form-group">
              <label>Новый Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <button type="submit" className="profile-btn" disabled={loadingEmail}>
              {loadingEmail ? 'Сохраняем...' : 'Сохранить Email'}
            </button>
          </form>
        </div>

        {/* Пароль */}
        <div className="profile-card">
          <h2 className="profile-card-title">Изменить пароль</h2>
          {successPassword && <div className="profile-success">✓ {successPassword}</div>}
          {errorPassword && <div className="profile-error">{errorPassword}</div>}
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label>Текущий пароль</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Новый пароль</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Повторите новый пароль</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="profile-btn" disabled={loadingPassword}>
              {loadingPassword ? 'Сохраняем...' : 'Изменить пароль'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}