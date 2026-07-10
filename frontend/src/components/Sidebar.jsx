import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheckCircle, AiOutlineCar, AiOutlineTeam, AiOutlineMenu, AiOutlineClose, AiOutlineUsergroupAdd } from "react-icons/ai";
import { PiSteeringWheel } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineSupportAgent, MdQuiz, MdOutlineFactCheck, MdOndemandVideo } from "react-icons/md";
import '../styles/Sidebar.css';
import logo from '../assets/LogDrivingUBB.png'; 

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Inicio', icon: <AiOutlineHome />, path: '/home' },
        { name: 'Perfil', icon: <AiOutlineUser />, path: '/profile' },
    ];

    if (user?.role === 'alumno') {
        menuItems.push({
            name: 'Reservas',
            icon: <AiOutlineCheckCircle />,
            path: '/reservas'
        });
        menuItems.push({
            name: 'Mis Resultados',
            icon: <MdOutlineFactCheck />,
            path: '/mis-resultados'
        });
    }

    if (user?.role === 'instructor') {
        menuItems.push({
            name: 'Preguntas',
            icon: <MdQuiz />,
            path: '/gestion-preguntas'
        });
    }

    if (user?.role === 'alumno' || user?.role === 'instructor') {
        menuItems.push({
            name: 'C. Prácticas',
            icon: <PiSteeringWheel />,
            path: '/clases-practicas'
        });
        menuItems.push({
            name: 'C. Teóricas',
            icon: <MdOndemandVideo />,
            path: '/clases-teoricas'
        });
        menuItems.push({
            name: 'Soporte',
            icon: <MdOutlineSupportAgent />,
            path: '/soporte'
        });
    }

    if (user?.role === 'secretaria') {
        menuItems.push({
            name: 'Solicitudes',
            icon: <VscGitPullRequestNewChanges />,
            path: '/admin/pending'
        });
    }

    if (user?.role === 'secretaria' || user?.role === 'admin') {
        menuItems.push({ 
            name: 'Asignaciones', 
            icon: <AiOutlineUsergroupAdd />,
            path: '/asignaciones' 
        });
        
        menuItems.push({
            name: 'G. Soportes',
            icon: <MdOutlineSupportAgent style={{ opacity: 0.75 }} />,
            path: '/admin/soportes'
        });
        menuItems.push({
            name: 'Vehículos',
            icon: <AiOutlineCar />,
            path: '/vehiculos'
        });
        menuItems.push({
            name: 'Usuarios',
            icon: <AiOutlineTeam />,
            path: '/users'
        });
    }

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="mobile-nav-toggle" onClick={toggleMenu}>
                {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>

            {isOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-box">
                        <img src={logo} alt="Logo DrivingUBB" className="sidebar-logo-img" />
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
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
                </nav>

                <div className="sidebar-footer">
                    <button className="btn-logout" onClick={() => { logout(); navigate('/login'); }}>
                        <TbLogout2 className="logout-icon" /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;