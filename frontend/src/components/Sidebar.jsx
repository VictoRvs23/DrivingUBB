import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { 
    AiOutlineHome, 
    AiOutlineUser, 
    AiOutlineCheckCircle, 
    AiOutlineCar, 
    AiOutlineTeam, 
    AiOutlineMenu, 
    AiOutlineClose,       
    AiOutlineUsergroupAdd 
} from "react-icons/ai";
import { PiSteeringWheel } from "react-icons/pi";
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); 

    const menuItems = [
        { name: 'Inicio', icon: <AiOutlineHome />, path: '/home' },
        { name: 'Perfil', icon: <AiOutlineUser />, path: '/profile' },
        { name: 'Reservas', icon: <AiOutlineCheckCircle />, path: '/reservas' },
    ];

    if (user?.role !== 'secretaria') {
        menuItems.push({ 
            name: 'C. Prácticas', 
            icon: <PiSteeringWheel />,
            path: '/clases-practicas' 
        });
    }

    if (user?.role === 'secretaria' || user?.role === 'admin') {
        // Modulo solo permite a rol secretaria y admin
        menuItems.push({ 
            name: 'Asignaciones', 
            icon: <AiOutlineUsergroupAdd />,
            path: '/asignaciones' 
        });
        
        menuItems.push({ 
            name: 'Solicitudes', 
            icon: <VscGitPullRequestNewChanges />,
            path: '/admin/pending' 
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
            {/* Botón para ocultar o mostrar la sidebar */}
            <button className="mobile-nav-toggle" onClick={toggleMenu}>
                {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>

            {/* Fondo oscuro en celular, aver si funciona */}
            {isOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <h2>DrivingUBB</h2>
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
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;