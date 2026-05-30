import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage.jsx'; 
import PreRegisterPage from './pages/PreRegisterPage.jsx'; 
import Home from './pages/Home.jsx'; 
import PendingUsers from './pages/PendingUsers.jsx'; 
import Reservas from './pages/Reservas.jsx'; 

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