import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { t } = useTranslation();
  const navigate  = useNavigate();
  const [recentSessions] = useState([
    { date: "2023-10-01", duration: "45 minutes", type: "Cardio" },
    { date: "2023-09-29", duration: "30 minutes", type: "Strength" },
  ]);

  const [routines] = useState([
    { name: "Morning Cardio", description: "A quick morning workout to get the heart pumping" },
    { name: "Strength Training", description: "Evening lifting session to build muscle" },
  ]);

  const [programs] = useState([
    { name: "Morning Cardio", description: "A quick morning workout to get the heart pumping" },
    { name: "Strength Training", description: "Evening lifting session to build muscle" },
  ]);

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
          <div key={index} className="session-card">
            <p><strong>Date:</strong> {session.date}</p>
            <p><strong>Duration:</strong> {session.duration}</p>
            <p><strong>Type:</strong> {session.type}</p>
          </div>
        ))}
      </div>
      <div className="routines">
        <h2>{t('dashboardP.y_routines')}</h2>
        {routines.map((routine, index) => (
          <div key={index} className="routine-card">
            <h3>{routine.name}</h3>
            <p>{routine.description}</p>
          </div>
        ))}
      </div>
      <div className="programs">
        <h2>{t('dashboardP.y_programs')}</h2>
        {programs.map((program, index) => (
          <div key={index} className="routine-card">
            <h3>{program.name}</h3>
            <p>{program.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;