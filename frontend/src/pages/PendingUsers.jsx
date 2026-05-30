import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/PendingUsers.css';

const PendingUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await axios.patch(`http://localhost:3000/api/users/approve/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Usuario aprobado exitosamente');
            fetchPendingUsers();
        } catch (error) {
            alert('Error al aprobar usuario');
            console.error(error);
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/reject/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Usuario rechazado');
            fetchPendingUsers();
        } catch (error) {
            alert('Error al rechazar usuario');
            console.error(error);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <div className="pending-users-container">
                    <header className="section-header">
                        <h1>Solicitudes Pendientes</h1>
                    </header>
                    {loading ? (
                        <p className="loading-message">Cargando solicitudes...</p>
                    ) : pendingUsers.length === 0 ? (
                        <p className="no-requests-message">No hay solicitudes pendientes</p>
                    ) : (
                        <div className="pending-list">
                            {pendingUsers.map((user) => (
                                <div key={user.id} className="user-card">
                                    <div className="user-info">
                                        <div className="user-name">{user.nombre}</div>
                                        <div className="user-details">
                                            <div className="detail-row">
                                                <span className="detail-label">RUT:</span>
                                                <span className="detail-value">{user.rut}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Email:</span>
                                                <span className="detail-value">{user.email}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Teléfono:</span>
                                                <span className="detail-value">{user.numeroTelefonico}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Fecha:</span>
                                                <span className="detail-value">{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="user-date">Solicitud recibida el: {new Date(user.created_at).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    </div>
                                    <div className="card-actions">
                                        <button 
                                            className="btn-approve"
                                            onClick={() => handleApprove(user.id)}
                                        >
                                            ✓ Aprobar
                                        </button>
                                        <button 
                                            className="btn-reject"
                                            onClick={() => handleReject(user.id)}
                                        >
                                            ✕ Rechazar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingUsers;