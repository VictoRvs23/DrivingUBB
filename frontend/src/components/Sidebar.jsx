import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheckCircle, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdAssignment, MdQuiz, MdLibraryBooks } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { BsGear } from 'react-icons/bs';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Secciones organizadas
    const menuSections = [
        {
            title: 'MIS DATOS',
            icon: '📊',
            items: [
                { name: 'Inicio', icon: <AiOutlineHome />, path: '/home' },
                { name: 'Mi Perfil', icon: <AiOutlineUser />, path: '/profile' },
                { name: 'Mis Datos', icon: <MdLibraryBooks />, path: '/my-data' }
            ]
        },
        {
            title: 'EVALUACIONES',
            icon: '📚',
            condition: user?.role === 'alumno' || user?.role === 'instructor',
            items: [
                { name: 'Examen Teórico', icon: <MdQuiz />, path: '/examenteorico' },
                { name: 'Evaluación Práctica', icon: <MdAssignment />, path: '/evaluacionpractica' },
                { name: 'Mis Resultados', icon: <BsGear />, path: '/my-results' }
            ]
        },
        {
            title: 'GESTIÓN',
            icon: '🗓️',
            items: [
                { name: 'Reservas', icon: <AiOutlineCheckCircle />, path: '/reservas' }
            ]
        },
        {
            title: 'ADMINISTRACIÓN',
            icon: '⚙️',
            condition: user?.role === 'secretaria',
            items: [
                { name: 'Solicitudes Pendientes', icon: <VscGitPullRequestNewChanges />, path: '/admin/pending' },
                { name: 'Crear Preguntas', icon: <FiSettings />, path: '/admin/create-questions' }
            ]
        }
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="mobile-nav-toggle" onClick={toggleMenu}>
                {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>

            {isOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header mejorado con badge de rol */}
                <div className="sidebar-header">
                    <h2 className="sidebar-logo">DrivingUBB</h2>
                    <div className="user-info">
                        <span className="user-name">{user?.nombre || 'Usuario'}</span>
                        <span className={`role-badge role-${user?.role}`}>
                            {user?.role === 'alumno' ? '👤 Alumno' : 
                             user?.role === 'secretaria' ? '⚙️ Admin' : 
                             user?.role === 'instructor' ? '🚗 Instructor' : 'Usuario'}
                        </span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuSections.map((section, idx) => {
                        // Mostrar sección solo si cumple condición (o no tiene condición = siempre mostrar)
                        if (section.condition === false) return null;

                        return (
                            <div key={idx} className="nav-section">
                                <div className="section-title">
                                    <span className="section-icon">{section.icon}</span>
                                    <span>{section.title}</span>
                                </div>
                                <div className="section-items">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.name}
                                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                            onClick={() => {
                                                navigate(item.path);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <span className="sidebar-icon">{item.icon}</span>
                                            <span className="sidebar-text">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="btn-logout" onClick={() => { logout(); navigate('/login'); }}>
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;