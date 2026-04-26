import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

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
                <header className="content-header">
                    <h1>Solicitudes Pendientes</h1>
                </header>
                <div className="table-container">
                    {loading ? (
                        <p>Cargando solicitudes...</p>
                    ) : pendingUsers.length === 0 ? (
                        <p>No hay solicitudes pendientes</p>
                    ) : (
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Alumno</th>
                                    <th>RUT</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Fecha</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.nombre}</td>
                                        <td>{user.rut}</td>
                                        <td>{user.email}</td>
                                        <td>{user.numeroTelefonico}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                className="btn-approve"
                                                onClick={() => handleApprove(user.id)}
                                            >
                                                Aprobar
                                            </button>
                                            <button 
                                                className="btn-reject"
                                                onClick={() => handleReject(user.id)}
                                            >
                                                Rechazar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingUsers;