import React, { useState, useEffect } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { PiSteeringWheel } from "react-icons/pi"; 
import { FaCarSide } from "react-icons/fa"; 
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getClasesAlumnoRequest, getClasesInstructorRequest } from '../services/clasespracticas.services';
import '../styles/ClasesPracticas.css';

const ClasesPracticas = () => {
    const { user } = useAuth();
    const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
    const [clases, setClases] = useState([]);
    const formatearFecha = (fechaDb) => {
        if (!fechaDb) return "Fecha no asignada";
        
        const fecha = new Date(fechaDb.replace(' ', 'T')); 
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const diaSemana = dias[fecha.getDay()];
        const diaNum = fecha.getDate().toString().padStart(2, '0');
        const mes = meses[fecha.getMonth()];
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${diaSemana} ${diaNum}, ${mes} - ${hora}:${minutos} hrs`;
    };

    const fetchClases = async () => {
        try {
            let response;
            if (isInstructor) {
                response = await getClasesInstructorRequest();
            } else {
                response = await getClasesAlumnoRequest();
            }
            setClases(response.data);
        } catch (error) {
            console.error("Error al cargar las clases desde la base de datos:", error);
        }
    };

    useEffect(() => {
        fetchClases();
    }, []);

    const getGradeStyle = (grade) => {
        if (!grade || grade === 'Pendiente') return 'grade-pending';
        const num = parseFloat(grade);
        if (num >= 4.0) return 'grade-pass'; 
        return 'grade-fail';
    };

    const formatGrade = (grade) => {
        if (!grade || grade === 'Pendiente') return 'Pendiente';
        return parseFloat(grade).toFixed(1);
    };

    return (
        <div className="main-container">
            <Sidebar />
            
            <div className="vehiculos-page cp-page-wrapper">
                
                <div className="vehiculos-header cp-custom-header">
                    <h1><PiSteeringWheel className="title-icon" style={{ fontSize: '2.5rem' }}/> Clases Prácticas</h1>
                </div>

                <div className="cp-white-container">
                    {clases.length > 0 ? (
                        clases.map((clase) => {
                            const nombreProfesor = clase.instructor ? clase.instructor.nombre : 'Pendiente';
                            const nombreAlumno = clase.user ? clase.user.nombre : 'Tú';
                            const calificacionActual = clase.calificacion || 'Pendiente';

                            return (
                                <div key={clase.id} className="cp-card">
                                    
                                    <div className="cp-card-left">
                                        <div className="cp-icon-container">
                                            <FaCarSide size={40} />
                                        </div>
                                        <div className="cp-class-info">
                                            <h3><strong>Clase n°{clase.numero_clase}:</strong> {clase.tema}</h3>
                                            <p>{formatearFecha(clase.fecha_hora)}</p>
                                        </div>
                                    </div>

                                    <div className="cp-card-right">
                                        <div className="cp-person-info">
                                            {isInstructor ? (
                                                <p><strong>Alumno:</strong> {nombreAlumno}</p>
                                            ) : (
                                                <p>
                                                    <strong>Profesor:</strong>{' '}
                                                    <span style={{ color: nombreProfesor === 'Pendiente' ? '#f59e0b' : 'inherit', fontWeight: nombreProfesor === 'Pendiente' ? 'bold' : 'normal' }}>
                                                        {nombreProfesor}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="cp-grade-badge">
                                            <span style={{ color: '#ffffff', fontWeight: 'normal' }}>Calificación : </span>
                                            <span className={getGradeStyle(calificacionActual)}>
                                                {formatGrade(calificacionActual)}
                                            </span>
                                        </div>
                                        {isInstructor && nombreProfesor !== 'Pendiente' && (
                                            <button 
                                                className="cp-edit-btn" 
                                                title="Calificar Alumno"
                                                onClick={() => console.log(`Abriendo modal para calificar clase ${clase.id}`)}
                                            >
                                                <AiOutlineEdit size={26} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="cp-empty-state">
                            <FaCarSide size={60} color="#94a3b8" />
                            <h2>No tienes clases prácticas programadas</h2>
                            <p>Dirígete a la sección de "Reservas" para agendar tu primera clase.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClasesPracticas;