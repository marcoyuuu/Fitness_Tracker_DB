import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getBasePath } from './utils/basePath';
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
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
  <Router basename={getBasePath() || '/'}>
        <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
            <Route path="/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
            <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
