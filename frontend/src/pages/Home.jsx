import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="content-header">
                    <div className="header-left">
                        <span className="header-icon"></span>
                        <h1>Inicio</h1>
                    </div>
                    <div className="header-right">
                        <button className="notification-btn"></button>
                    </div>
                </header>

                <section className="welcome-section">
                    <div className="welcome-card">
                        <h2>Bienvenido/a, {user?.nombre || '[Nombre de Usuario]'}</h2>
                        <div className="status-badge">
                        </div>
                    </div>
                </section>

                <section className="main-data-area">
                </section>
            </main>
        </div>
    );
};

export default Home;