import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Container, NavDropdown, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function BootstrapNavbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const setActiveLinkClass = ({ isActive }) => isActive ? "nav-link active-nav-link" : "nav-link";

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom">
      <Container>
        <Navbar.Brand>
          <NavLink to="/dashboard" className="navbar-brand">
            Fitness Tracker
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navbar-nav">
            <NavItem>
              <NavLink to="/" className={setActiveLinkClass}>
                {t('nav.home')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/dashboard" className={setActiveLinkClass}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/sessions" className={setActiveLinkClass}>
                {t('nav.sessions')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/routines" className={setActiveLinkClass}>
                {t('nav.routines')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/exercises" className={setActiveLinkClass}>
                {t('nav.exercises')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/programs" className={setActiveLinkClass}>
                {t('nav.programs')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/goals" className={setActiveLinkClass}>
                {t('nav.goals')}
              </NavLink>
            </NavItem>
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
