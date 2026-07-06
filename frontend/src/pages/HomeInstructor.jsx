import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AiOutlineForm, AiOutlineCar } from "react-icons/ai";
import { PiSteeringWheel } from "react-icons/pi";

const HomeInstructor = () => {
    const { user } = useAuth();
    const [loadingData, setLoadingData] = useState(true);
    const [instructorData, setInstructorData] = useState({
        clasesHoy: 0,
        evaluacionesPendientes: 0,
        proximasClases: []
    });

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:3000/api/dashboard/instructor-resumen', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setInstructorData(response.data);
            } catch (error) {
                console.error("Error al obtener datos del instructor:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchInstructorData();
    }, []);

    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let fechaActual = new Date().toLocaleDateString('es-ES', opcionesFecha);
    fechaActual = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

    return (
        <div className="home-content">
            <div className="welcome-bar">
                <h2>Bienvenido/a, <span>Prof. {user?.nombre || "Cargando..."}</span></h2>
                <span className="date-badge">{fechaActual}</span>
            </div>

            {loadingData ? (
                <p style={{textAlign: 'center', color: '#94a3b8', padding: '50px 0'}}>Cargando tu agenda de hoy...</p>
            ) : (
                <>
                    <div className="instructor-stats-grid">
                        <div className="instructor-stat-card">
                            <div className="stat-icon-large blue"><PiSteeringWheel /></div>
                            <h3>{instructorData.clasesHoy}</h3>
                            <p>Clases programadas hoy</p>
                        </div>

                        <div className="instructor-stat-card">
                            {instructorData.evaluacionesPendientes > 0 && <div className="notification-dot"></div>}
                            <div className="stat-icon-large gray"><AiOutlineForm /></div>
                            <h3>{instructorData.evaluacionesPendientes}</h3>
                            <p>Evaluaciones pendientes</p>
                        </div>
                    </div>

                    <div className="activities-section">
                        <h3 className="section-title">Próximas Clases</h3>
                        <div className="instructor-class-list">
                            {instructorData.proximasClases.length > 0 ? (
                                instructorData.proximasClases.map((clase) => (
                                    <div className="instructor-class-card" key={clase.id}>
                                        <div className="instructor-class-icon"><AiOutlineCar /></div>
                                        <div className="instructor-class-details">
                                            <h4>{clase.titulo}</h4>
                                            <p style={{textTransform: 'capitalize'}}>{clase.fecha}</p>
                                        </div>
                                        <div className="instructor-class-alumno">
                                            <p><span>Alumno:</span> {clase.alumno}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="instructor-class-card" style={{justifyContent: 'center'}}>
                                    <p style={{color: '#94a3b8', margin: 0}}>No tienes clases programadas próximamente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeInstructor;