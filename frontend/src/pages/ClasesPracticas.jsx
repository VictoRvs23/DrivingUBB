import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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

    const esClaseIniciada = (fechaDb) => {
        if (!fechaDb) return false;
        const fechaClase = new Date(fechaDb.replace(' ', 'T'));
        const ahora = new Date();
        return ahora >= fechaClase;
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
        const { value: motivo } = await Swal.fire({
            title: 'Cancelar clase práctica',
            html: '<p style="color:#94a3b8; margin-bottom: 10px; text-align:left;">Cuéntale al instructor por qué no podrás asistir. Podrá ver este mensaje.</p>',
            input: 'textarea',
            inputPlaceholder: 'Ej: Tengo un imprevisto y no podré asistir a esta clase...',
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

        if (!motivo) return;

        const result = await Swal.fire({
            title: '¿Cancelar reserva?',
            text: "Perderás tu cupo para esta clase práctica y se notificará al instructor.",
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
                await cancelarClaseRequest(idClase, { motivo: motivo.trim() });
                
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
                            const cancelada = clase.estado === 'Cancelada';
                            const iniciada = esClaseIniciada(clase.fecha_hora);

                            return (
                                <div key={clase.id} className={`cp-card ${cancelada ? 'cp-card-cancelada' : ''}`}>
                                    
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
                                        {cancelada ? (
                                            <div className="cp-cancelada-aviso">
                                                <p className="cp-cancelada-titulo">
                                                    Clase cancelada por {clase.cancelado_por === 'alumno' ? 'el alumno' : 'el instructor'}
                                                </p>
                                                {clase.motivo_cancelacion && (
                                                    <p className="cp-cancelada-motivo">"{clase.motivo_cancelacion}"</p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
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
                                                {isInstructor && calificacionActual === 'Pendiente' ? (
                                                    <button
                                                        className="cp-calificar-btn"
                                                        onClick={() => {
                                                            if(iniciada) {
                                                                navigate('/evaluacionpractica', {
                                                                    state: {
                                                                        claseId: clase.id,
                                                                        estudianteId: clase.user?.id,
                                                                        estudianteNombre: nombreAlumno
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        disabled={!iniciada}
                                                        title={iniciada ? "Calificar esta clase" : "La clase aún no ha comenzado"}
                                                        style={{
                                                            background: iniciada ? 'transparent' : '#1e293b',
                                                            border: iniciada ? '2px solid #3b82f6' : '2px solid #334155',
                                                            borderRadius: '20px',
                                                            padding: '8px 20px',
                                                            color: iniciada ? '#3b82f6' : '#64748b',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.95rem',
                                                            cursor: iniciada ? 'pointer' : 'not-allowed',
                                                            opacity: iniciada ? 1 : 0.6
                                                        }}
                                                    >
                                                        {iniciada ? 'Calificar' : 'Calificar'}
                                                    </button>
                                                ) : (
                                                    <div className="cp-grade-badge">
                                                        <span style={{ color: '#ffffff', fontWeight: 'normal' }}>Calificación : </span>
                                                        <span className={getGradeStyle(calificacionActual)}>
                                                            {formatGrade(calificacionActual)}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                <div className="cp-actions-container" style={{ display: 'flex', gap: '8px' }}>
                                                    {isInstructor && nombreProfesor !== 'Pendiente' && calificacionActual !== 'Pendiente' && (
                                                        <button 
                                                            className="cp-action-btn edit" 
                                                            title="Editar Calificación"
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
                                            </>
                                        )}
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