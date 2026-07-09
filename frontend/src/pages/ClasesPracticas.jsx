import React, { useState, useEffect } from 'react';
import { PiSteeringWheel } from "react-icons/pi"; 
import { FaCarSide } from "react-icons/fa";
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Swal from 'sweetalert2'; 
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getClasesAlumnoRequest, getClasesInstructorRequest, cancelarClaseRequest } from '../services/clasespracticas.services';
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

    const handleCancelarClase = async (idClase) => {
        const result = await Swal.fire({
            title: '¿Cancelar reserva?',
            text: "Perderás tu cupo para esta clase práctica.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155', 
            confirmButtonText: 'Sí, cancelar clase',
            cancelButtonText: 'Mantener reserva',
            background: '#1e293b',
            color: '#f1f5f9' 
        });

        if (result.isConfirmed) {
            try {
                await cancelarClaseRequest(idClase);
                
                Swal.fire({
                    title: '¡Cancelada!',
                    text: 'Tu clase ha sido cancelada con éxito.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });

                fetchClases();
            } catch (error) {
                console.error("Error al cancelar la clase:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al cancelar la clase. Intenta nuevamente.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });
            }
        }
    };

    const handleCancelarClaseInstructor = async (idClase) => {
        const { value: motivo } = await Swal.fire({
            title: 'Cancelar clase práctica',
            html: '<p style="color:#94a3b8; margin-bottom: 10px; text-align:left;">Indica el motivo de la cancelación. El alumno podrá ver este mensaje.</p>',
            input: 'textarea',
            inputPlaceholder: 'Ej: El vehículo asignado no está disponible por mantención...',
            inputAttributes: {
                'aria-label': 'Motivo de la cancelación'
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Cancelar clase',
            cancelButtonText: 'Volver',
            background: '#1e293b',
            color: '#f1f5f9',
            inputValidator: (value) => {
                if (!value || !value.trim()) {
                    return 'Debes indicar un motivo para cancelar la clase.';
                }
            }
        });

        if (motivo) {
            const confirmacion = await Swal.fire({
                title: '¿Confirmar cancelación?',
                html: `Esta acción cancelará la clase y notificará al alumno con el siguiente motivo:<br><br><em style="color:#f1f5f9;">"${motivo.trim()}"</em>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#334155',
                confirmButtonText: 'Sí, cancelar clase',
                cancelButtonText: 'Volver',
                background: '#1e293b',
                color: '#f1f5f9'
            });

            if (!confirmacion.isConfirmed) return;

            try {
                await cancelarClaseRequest(idClase, { motivo: motivo.trim() });

                Swal.fire({
                    title: 'Clase cancelada',
                    text: 'Se notificó al alumno con el motivo indicado.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });

                fetchClases();
            } catch (error) {
                console.error("Error al cancelar la clase:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al cancelar la clase. Intenta nuevamente.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });
            }
        }
    };

    return (
        <div className="main-container">
            <Sidebar />
            
            <div className="vehiculos-page cp-page-wrapper">
                
                <div className="vehiculos-header">
                    <h1><PiSteeringWheel className="title-icon" /> Clases Prácticas</h1>
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
                                            <h3><strong>{clase.tema}</strong></h3>
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
                                        
                                        <div className="cp-actions-container" style={{ display: 'flex', gap: '8px' }}>
                                            {isInstructor && nombreProfesor !== 'Pendiente' && (
                                                <button 
                                                    className="cp-action-btn edit" 
                                                    title="Calificar Alumno"
                                                    onClick={() => console.log(`Abriendo modal para calificar clase ${clase.id}`)}
                                                >
                                                    <AiOutlineEdit size={22} />
                                                </button>
                                            )}

                                            {isInstructor && (
                                                <button 
                                                    className="cp-action-btn cancel" 
                                                    title="Cancelar Clase"
                                                    onClick={() => handleCancelarClaseInstructor(clase.id)}
                                                >
                                                    <AiOutlineDelete size={22} />
                                                </button>
                                            )}

                                            {user?.role === 'alumno' && (
                                                <button 
                                                    className="cp-action-btn cancel" 
                                                    title="Cancelar Clase"
                                                    onClick={() => handleCancelarClase(clase.id)}
                                                >
                                                    <AiOutlineDelete size={22} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="cp-empty-state" style={{textAlign: 'center', padding: '40px 0'}}>
                            <FaCarSide size={60} color="#94a3b8" />
                            <h2 style={{color: '#f1f5f9', marginTop: '20px'}}>No tienes clases prácticas programadas</h2>
                            <p style={{color: '#94a3b8'}}>Dirígete a la sección de "Reservas" para agendar tu primera clase.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClasesPracticas;