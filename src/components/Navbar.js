// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/sessions">Sesiones</Link></li>
          <li><Link to="/routines">Rutinas</Link></li>
          <li><Link to="/exercises">Ejercicios</Link></li>
          <li><Link to="/goals">Metas</Link></li>
          <li><Link to="/achievements">Logros</Link></li>
          <li><Link to="/progress">Progreso</Link></li>
        </ul>
      </nav>
    );
  }

export default Navbar;
