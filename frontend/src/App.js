import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/LoginPage';
import PasswordRecovery from './pages/Login/PasswordRecovery/PasswordRecovery';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Sessions from './pages/Sessions/SessionsPage';
import Routines from './pages/Routines/RoutinesPage';
import Exercises from './pages/Exercises/ExercisesPage';
import Programs from './pages/Programs/ProgramsPage';
import Goals from './pages/Goals/GoalsPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
    </Router>
  );
}

export default App;
