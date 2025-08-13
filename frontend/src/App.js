import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getBasePath } from './utils/basePath';
import Login from './pages/Login/LoginPage';
import PasswordRecovery from './pages/Login/PasswordRecovery/PasswordRecovery';
import Register from './pages/Login/RegisterPage';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Sessions from './pages/Sessions/SessionsPage';
import Routines from './pages/Routines/RoutinesPage';
import Exercises from './pages/Exercises/ExercisesPage';
import Programs from './pages/Programs/ProgramsPage';
import Goals from './pages/Goals/GoalsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function Layout({ children }) {
  const { access } = useAuth();
  const location = useLocation();
  const authPathsNoNav = ['/', '/register', '/password-recovery'];
  const hideNav = !access && authPathsNoNav.includes(location.pathname);
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
        <Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename={getBasePath() || '/'}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
