import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheckCircle, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
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
        // luego debo agregar mas opciones
    ];

    if (user?.role === 'secretaria') {
        menuItems.push({ 
            name: 'Solicitudes', 
            icon: <VscGitPullRequestNewChanges />,
            path: '/admin/pending' 
        });
    }

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* un boton para oculatr o mostrar la sidebar */}
            <button className="mobile-nav-toggle" onClick={toggleMenu}>
                {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>

            {/* cosas para el celular, solo es una prueba */}
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