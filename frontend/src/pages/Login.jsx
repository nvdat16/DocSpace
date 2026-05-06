import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { login as loginApi } from '../services/auth.api';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginApi(form);
      const { token, user } = response.data || {};
      auth.login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
      <h1 style={{ marginTop: 0 }}>Đăng nhập</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
        {error ? <p style={{ color: '#dc2626', margin: 0 }}>{error}</p> : null}
        <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</button>
      </form>
      <p style={{ marginBottom: 0 }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}
