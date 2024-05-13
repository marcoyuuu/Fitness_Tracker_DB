import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Navbar.css';

function BootstrapNavbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom">
      <Container>
        <Navbar.Brand href="#home">Fitness Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navbar-nav">
            <LinkContainer to="/" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.home')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/dashboard" activeClassName="active-nav-link">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/sessions" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.sessions')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/routines" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.routines')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/exercises" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.exercises')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/programs" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.programs')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/goals" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.goals')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/progress" activeClassName="active-nav-link">
              <Nav.Link>{t('nav.progress')}</Nav.Link>
            </LinkContainer>
            <NavDropdown title={t('glob.language')} id="language-nav-dropdown" className="language-dropdown">
              <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BootstrapNavbar;
