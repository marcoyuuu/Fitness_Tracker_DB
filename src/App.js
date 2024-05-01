// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/SessionsPage';
import Routines from './pages/RoutinesPage';
import Exercises from './pages/ExercisesPage';
import Programs from './pages/ProgramsPage';
import Goals from './pages/GoalsPage';
import Achievements from './pages/AchievementsPage';
import Progress from './pages/Progress';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Router>
  );
}

export default App;
