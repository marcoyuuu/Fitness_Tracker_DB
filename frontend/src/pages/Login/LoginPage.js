import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validEmail = (v) => /.+@.+\..+/.test(v);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!validEmail(email)) {
      setError(t('loginP.invalid_email') || 'Enter a valid email');
      return;
    }
    if (!password) {
      setError(t('loginP.required_password') || 'Password is required');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setError(t('loginP.error_invalid') || 'Login failed');
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
          <h2 className="login-title">{t('loginP.login')}</h2>
          <div className="login-subtitle">{t('loginP.subtitle') || 'Welcome back. Please sign in to continue.'}</div>
        </div>
        <Form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t('loginP.email')}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t('loginP.enter_email')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              isInvalid={email !== '' && !validEmail(email)}
            />
            <Form.Control.Feedback type="invalid">
              {t('loginP.invalid_email') || 'Enter a valid email'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{t('loginP.password')}</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPw ? 'text' : 'password'}
                placeholder={t('loginP.password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Button variant="outline-secondary" onClick={() => setShowPw(s => !s)} type="button">
                {showPw ? (t('loginP.hide') || 'Hide') : (t('loginP.show') || 'Show')}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? t('loginP.loading') || 'Signing in…' : t('loginP.login')}
          </Button>
          <div className="login-footer">
            <Link to="/password-recovery">{t('loginP.f_password')}</Link>
            <span> · </span>
            <Link to="/register">{t('loginP.create_account')}</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
