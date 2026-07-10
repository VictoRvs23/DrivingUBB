import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AiOutlineForm, AiOutlineCar } from "react-icons/ai";
import { PiSteeringWheel } from "react-icons/pi";
import { getClasesInstructorRequest } from '../services/clasespracticas.services.js';

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
                const response = await getClasesInstructorRequest();
                const clases = response.data;
                
                const ahora = new Date();
                const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
                const finHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

                let clasesHoyCount = 0;
                let evaluacionesCount = 0;
                let futuras = [];

                clases.forEach(clase => {
                    if (clase.estado === 'Cancelada') return;

                    const fechaClase = new Date(clase.fecha_hora.replace(' ', 'T'));
                    const sinCalificar = !clase.calificacion || clase.calificacion === 'Pendiente';
                    
                    if (fechaClase >= inicioHoy && fechaClase <= finHoy) {
                        clasesHoyCount++;
                    }

                    if (sinCalificar && fechaClase <= ahora) {
                        evaluacionesCount++;
                    }

                    if (sinCalificar && fechaClase > ahora) {
                        futuras.push({
                            ...clase,
                            dateObj: fechaClase
                        });
                    }
                });

                futuras.sort((a, b) => a.dateObj - b.dateObj);
                
                let proximasFormateadas = [];
                if (futuras.length > 0) {
                    const proxima = futuras[0];
                    
                    const opciones = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
                    let fechaFormateada = proxima.dateObj.toLocaleString('es-ES', opciones) + ' hrs.';
                    
                    proximasFormateadas.push({
                        id: proxima.id,
                        titulo: proxima.tema || `Clase Práctica N°${proxima.numero_clase || 'X'}`,
                        fecha: fechaFormateada,
                        alumno: proxima.user ? proxima.user.nombre : 'Por asignar'
                    });
                }

                setInstructorData({
                    clasesHoy: clasesHoyCount,
                    evaluacionesPendientes: evaluacionesCount,
                    proximasClases: proximasFormateadas
                });

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
                        <h3 className="section-title">Próxima Clase</h3>
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