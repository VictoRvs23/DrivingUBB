import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage.jsx'; 
import PreRegisterPage from './pages/PreRegisterPage.jsx'; 
import Home from './pages/Home.jsx'; 
import PendingUsers from './pages/PendingUsers.jsx'; 
import Reservas from './pages/Reservas.jsx'; 
import Vehiculos from './pages/Vehiculos.jsx';
import Users from './pages/User.jsx';

function App() {
  const { user, loading } = useAuth(); 

  if (loading) return <div className="loading-screen">Verificando credenciales...</div>;

  return (
    <Router>
      <Routes>
        {/* Pagina de pre-inscripcion */}
        <Route path="/" element={<PreRegisterPage />} />

        {/* Login */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/home" replace />} 
        />

        {/* Home */}
        <Route 
          path="/home" 
          element={user ? <Home /> : <Navigate to="/login" replace />} 
        />

        {/* Reservas */}
        <Route 
          path="/reservas" 
          element={user ? <Reservas /> : <Navigate to="/login" replace />} 
        />

        {/* Vehiculos: Solo Admin y Secretaria */}
        <Route 
          path="/vehiculos" 
          element={
            user && (user.role === 'admin' || user.role === 'secretaria') 
              ? <Vehiculos /> 
              : <Navigate to="/home" replace />
          } 
        />

        {/* Usuarios: Solo Admin y Secretaria */}
        <Route 
          path="/users" 
          element={
            user && (user.role === 'admin' || user.role === 'secretaria') 
              ? <Users /> 
              : <Navigate to="/home" replace />
          } 
        />

        <Route 
          path="/admin/pending" 
          element={user?.role === 'secretaria' ? <PendingUsers /> : <Navigate to="/login" replace />} 
        />

        {/* Esto es por si la ruta no existe, te manda al pre-inscripción */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;