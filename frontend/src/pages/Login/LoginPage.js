import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      // fallback: try register then login for first-time users
      try {
        await register(email, password);
        navigate('/dashboard');
      } catch (e2) {
        setError('Login failed');
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>{t('loginP.login')}</h2>
          <Form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{t('loginP.email')}</Form.Label>
              <Form.Control type="email" placeholder={t('loginP.enter_email')} onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>{t('loginP.password')}</Form.Label>
              <Form.Control type="password" placeholder={t('loginP.password')} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">
            {t('loginP.login')}
            </Button>
            <div className="mt-3">
              <Link to="/password-recovery">{t('loginP.f_password')}</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
