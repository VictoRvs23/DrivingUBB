import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
    AiOutlineTeam, 
    AiOutlineClockCircle, 
    AiOutlineCheckCircle,
    AiOutlineQuestionCircle,
    AiOutlineTool,
    AiOutlineBulb
} from "react-icons/ai";

const HomeSecreAdmin = () => {
    const { user } = useAuth();
    const [loadingData, setLoadingData] = useState(true);

    const [adminData, setAdminData] = useState({
        usuariosTotales: 0,
        nuevosHoy: 0,
        ticketsPendientes: 0,
        resueltosMes: 0,
        ticketsRecientes: []
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`http://localhost:3000/api/dashboard/admin-resumen`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setAdminData(response.data);
            } catch (error) {
                console.error("Error al obtener datos del admin:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchAdminData();
    }, []);

    const getBadgeClass = (estado) => {
        switch(estado) {
            case 'Resuelto': return 'badge-green';
            case 'En proceso': return 'badge-blue';
            case 'Pendiente': return 'badge-yellow';
            default: return 'badge-gray';
        }
    };

    const getIconForType = (tipo) => {
        if (tipo === 'pregunta') return <AiOutlineQuestionCircle/>;
        if (tipo === 'tecnico') return <AiOutlineTool/>;
        return <AiOutlineBulb/>;
    };

    return (
        <div className="home-content">
            <div className="welcome-bar" style={{ justifyContent: 'center', borderBottom: 'none', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#f1f5f9', fontWeight: 'bold' }}>Panel de Control</h2>
            </div>

            {loadingData ? (
                <p style={{textAlign: 'center', color: '#94a3b8', padding: '50px 0'}}>Cargando métricas del sistema...</p>
            ) : (
                <>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card">
                            <div className="stat-icon-large blue"><AiOutlineTeam /></div>
                            <h3>{adminData.usuariosTotales.toLocaleString('es-CL')}</h3>
                            <p>Usuarios Totales: <span className="text-green">+{adminData.nuevosHoy} hoy</span></p>
                        </div>

                        <div className="admin-stat-card">
                            <div className="stat-icon-large yellow"><AiOutlineClockCircle /></div>
                            <h3>{adminData.ticketsPendientes}</h3>
                            <p>Tickets pendientes</p>
                        </div>

                        <div className="admin-stat-card">
                            <div className="stat-icon-large green"><AiOutlineCheckCircle /></div>
                            <h3>{adminData.resueltosMes}</h3>
                            <p>Resueltos este mes</p>
                        </div>
                    </div>

                    <div className="activities-section" style={{ marginTop: '40px' }}>
                        <h3 className="section-title" style={{ textAlign: 'left' }}>Tickets Recientes</h3>
                        
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Usuario</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminData.ticketsRecientes.length > 0 ? (
                                        adminData.ticketsRecientes.map((ticket) => (
                                            <tr key={ticket.id}>
                                                <td className="table-icon">{getIconForType(ticket.tipo)}</td>
                                                <td className="table-user">{ticket.usuario}</td>
                                                <td>
                                                    <span className={`ticket-badge ${getBadgeClass(ticket.estado)}`}>
                                                        {ticket.estado}
                                                    </span>
                                                </td>
                                                <td className="table-date">{ticket.fecha}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{padding: '30px', color: '#94a3b8'}}>No hay tickets recientes.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeSecreAdmin;