import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function RegisterPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t('loginP.password_mismatch') || 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(t('loginP.register_failed') || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-badge">
            <span>🏋️‍♂️</span>
            <span>Fitness Tracker</span>
          </div>
          <h2 className="login-title">{t('loginP.create_account')}</h2>
          <div className="login-subtitle">{t('loginP.register_subtitle') || 'Create your account to get started.'}</div>
        </div>
        <Form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>{t('loginP.name') || 'Name'}</Form.Label>
            <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('loginP.name_placeholder') || 'Your name'} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>{t('loginP.email')}</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('loginP.enter_email')} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>{t('loginP.password')}</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirm">
            <Form.Label>{t('loginP.confirm_password')}</Form.Label>
            <Form.Control type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? t('loginP.loading') || 'Creating…' : t('loginP.register')}
          </Button>
          <div className="login-footer">
            <Link to="/">{t('loginP.b_login')}</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
