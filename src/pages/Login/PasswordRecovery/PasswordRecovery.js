import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PasswordRecovery() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Recover password for:', email);
        // Implement password recovery logic here
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2>{t('loginP.r_password')}</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>{t('loginP.email')}</Form.Label>
                            <Form.Control type="email" placeholder={t('loginP.enter_email')} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {t('loginP.re_password')}
                        </Button>
                        <div className="mt-3">
                            <Link to="/">{t('loginP.b_login')}</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default PasswordRecovery;
