import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { t } = useTranslation();
  const navigate  = useNavigate();
  const [recentSessions, setRecentSessions] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsResponse = await axios.get('http://localhost/react_php_app/api.php?table=sesión');
        const routinesResponse = await axios.get('http://localhost/react_php_app/api.php?table=rutina');
        const programsResponse = await axios.get('http://localhost/react_php_app/api.php?table=programa');
        
        setRecentSessions(sessionsResponse.data);
        setRoutines(routinesResponse.data);
        setPrograms(programsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const navigateToSessions = () => {
    navigate('/sessions');
  };

  const navigateToRoutines = () => {
    navigate('/routines');
  };
  
  const navigateToPrograms = () => {
    navigate('/programs');
  };

  return (
    <div className="dashboard">
      <h1>{t('dashboardP.welcome')}</h1>
      <p>{t('dashboardP.snapshot')}</p>
      <div className="dashboard-actions">
        <button onClick={navigateToSessions}>{t('dashboardP.add_session')}</button>
        <button onClick={navigateToRoutines}>{t('dashboardP.create_routine')}</button>
        <button onClick={navigateToPrograms}>{t('dashboardP.create_program')}</button>
      </div>
      <div className="recent-sessions">
        <h2>{t('dashboardP.r_sessions')}</h2>
        {recentSessions.map((session, index) => (
          <div key={session.SesiónID || index} className="session-card">
            <p><strong>{t('glob.date')}:</strong> {session.Fecha}</p>
            <p><strong>{t('glob.duration')}:</strong> {session.Duración}</p>
          </div>
        ))}
      </div>
      <div className="routines">
        <h2>{t('dashboardP.y_routines')}</h2>
        {routines.map((routine, index) => (
          <div key={routine.RutinaID || index} className="routine-card">
            <h3>{routine.Nombre}</h3>
            <p>{routine.Descripción}</p>
          </div>
        ))}
      </div>
      <div className="programs">
        <h2>{t('dashboardP.y_programs')}</h2>
        {programs.map((program, index) => (
          <div key={program.ProgramaID || index} className="program-card">
            <h3>{program.Nombre}</h3>
            <p>{program.Descripción}</p>
            <p><strong>{t('glob.start_date')}:</strong> {program.FechaInicio}</p>
            <p><strong>{t('glob.end_date')}:</strong> {program.FechaFin || t('programsP.no_end_date')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
