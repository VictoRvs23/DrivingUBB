import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheckCircle } from "react-icons/ai";
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Inicio', icon: <AiOutlineHome />, path: '/home' },
        { name: 'Perfil', icon: <AiOutlineUser />, path: '/profile' },
        { name: 'Reservas', icon: <AiOutlineCheckCircle />, path: '/reservas' },
    ];

    if (user?.role === 'secretaria') {
        menuItems.push({ 
            name: 'Solicitudes', 
            icon: <VscGitPullRequestNewChanges />,
            path: '/admin/pending' 
        });
    }

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h2>DrivingUBB</h2>
            </div>
            
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button 
                        key={item.name}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
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
    );
};

export default Sidebar;