import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage.jsx';
import PreRegisterPage from './pages/PreRegisterPage.jsx';
import Home from './pages/Home.jsx';
import PendingUsers from './pages/PendingUsers.jsx';
import Profile from './components/Profile';
import Reservas from './pages/Reservas.jsx';
import Vehiculos from './pages/Vehiculos.jsx';
import Users from './pages/User.jsx';
import ClasesPracticas from './pages/ClasesPracticas.jsx';
import ClasesTeoricas from './pages/ClasesTeoricas.jsx';
import Soporte from './pages/Soporte.jsx';
import AdminSoportes from './pages/AdminSoportes.jsx';
import AdminFAQ from './pages/AdminFAQ.jsx';
import EvaluacionPractica from './pages/EvaluacionPractica.jsx';
import ExamenTeorico from './pages/ExamenTeorico.jsx';
import MisResultados from './pages/MisResultados.jsx';
import Ajustes from './pages/Ajustes.jsx';
import GestionPreguntas from './pages/GestionPreguntas.jsx';
import AsignacionPage from './pages/AsignacionPage.jsx';

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

        {/* Perfil de usuario */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />

        {/* Reservas */}
        <Route 
          path="/reservas" 
          element={user ? <Reservas /> : <Navigate to="/login" replace />} 
        />
        
        {/* Ajustes */}
        <Route path="/ajustes"
        element={user ? <Ajustes /> : <Navigate to="/login" replace />} 
        />

        {/* Soporte: Alumno e Instructor */}
        <Route
          path="/soporte"
          element={
            user && (user.role === 'alumno' || user.role === 'instructor')
              ? <Soporte />
              : <Navigate to="/home" replace />
          }
        />

        {/* Gestión de soportes — solo admin y secretaria */}
        <Route
          path="/admin/soportes"
          element={
            user && (user.role === 'admin' || user.role === 'secretaria')
              ? <AdminSoportes />
              : <Navigate to="/home" replace />
          }
        />

        {/* Gestión de FAQs — solo admin */}
        <Route
          path="/admin/faq"
          element={
            user && user.role === 'admin'
              ? <AdminFAQ />
              : <Navigate to="/home" replace />
          }
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

        {/* Clases Practicas: Solo Alumno y Instructor */}
        <Route
          path="/clases-practicas"
          element={
            user && (user.role === 'alumno' || user.role === 'instructor')
              ? <ClasesPracticas />
              : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/clases-teoricas"
          element={
            user && (user.role === 'alumno' || user.role === 'instructor')
              ? <ClasesTeoricas />
              : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/asignaciones"
          element={
            user && (user.role === 'admin' || user.role === 'secretaria')
              ? <AsignacionPage />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/pending"
          element={
            user && (user.role === 'secretaria' || user.role === 'admin')
              ? <PendingUsers /> 
              : <Navigate to="/login" replace />
          }
        />

        {/* Evaluacion Practica: Instructor y Admin la administran */}
        <Route
          path="/evaluacionpractica"
          element={
            user && (user.role === 'instructor' || user.role === 'admin')
              ? <EvaluacionPractica />
              : <Navigate to="/home" replace />
          }
        />

        {/* Examen Teorico: solo Alumno lo rinde */}
        <Route
          path="/examenteorico"
          element={
            user?.role === 'alumno'
              ? <ExamenTeorico />
              : <Navigate to="/home" replace />
          }
        />

        {/* Mis Resultados: solo Alumno ve su historial */}
        <Route
          path="/mis-resultados"
          element={
            user?.role === 'alumno'
              ? <MisResultados />
              : <Navigate to="/home" replace />
          }
        />

        {/* Gestion de Preguntas: solo Instructor arma el banco de preguntas */}
        <Route
          path="/gestion-preguntas"
          element={
            user?.role === 'instructor'
              ? <GestionPreguntas />
              : <Navigate to="/home" replace />
          }
        />

        {/* Esto es por si la ruta no existe, te manda al pre-inscripción */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;