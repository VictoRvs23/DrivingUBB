import React, { useState, useEffect } from 'react';
import { MdOndemandVideo } from "react-icons/md";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
    getClasesTeoricasRequest,
    getMisClasesTeoricasRequest,
    crearClaseTeoricaRequest,
    editarClaseTeoricaRequest,
    eliminarClaseTeoricaRequest
} from '../services/clasesteoricas.services';
import '../styles/ClasesTeoricas.css';

const initialFormState = {
    titulo_clase: '',
    fecha_hora: '',
    enlace_videollamada: '',
    codigo_acceso: '' 
};

const ClasesTeoricas = () => {
    const { user } = useAuth();
    const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

    const [clases, setClases] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedClase, setSelectedClase] = useState(initialFormState);
    const [selectedId, setSelectedId] = useState(null);

    const formatearFecha = (fechaDb) => {
        if (!fechaDb) return "Fecha no asignada";
        const fecha = new Date(fechaDb);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const diaSemana = dias[fecha.getDay()];
        const diaNum = fecha.getDate().toString().padStart(2, '0');
        const mes = meses[fecha.getMonth()];
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${diaSemana} ${diaNum}, ${mes} - ${hora}:${minutos} hrs`;
    };

    const esClasePasada = (fechaDb) => {
        const inicio = new Date(fechaDb).getTime();
        const finDeClase = inicio + (60 * 60 * 1000); 
        return Date.now() > finDeClase;
    };

    const MINUTOS_ANTICIPACION = 30;
    const puedeIngresar = (fechaDb) => {
        const inicio = new Date(fechaDb).getTime();
        const ventanaApertura = inicio - MINUTOS_ANTICIPACION * 60 * 1000;
        return Date.now() >= ventanaApertura && !esClasePasada(fechaDb);
    };

    const fetchClases = async () => {
        try {
            const response = isInstructor
                ? await getMisClasesTeoricasRequest()
                : await getClasesTeoricasRequest();
            setClases(response.data);
        } catch (error) {
            console.error("Error al cargar las clases teóricas:", error);
        }
    };

    useEffect(() => {
        fetchClases();
    }, []);

    const handleOpenCreateModal = () => {
        setSelectedClase(initialFormState);
        setIsEditing(false);
        setSelectedId(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (clase) => {
        setSelectedClase({
            titulo_clase: clase.titulo_clase,
            fecha_hora: clase.fecha_hora ? clase.fecha_hora.slice(0, 16) : '',
            enlace_videollamada: clase.enlace_videollamada,
            codigo_acceso: clase.codigo_acceso || '' 
        });
        setSelectedId(clase.id_clase);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormChange = (e) => {
        setSelectedClase({ ...selectedClase, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await editarClaseTeoricaRequest(selectedId, selectedClase);
                Swal.fire({
                    title: 'Clase actualizada',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });
            } else {
                await crearClaseTeoricaRequest(selectedClase);
                Swal.fire({
                    title: 'Clase creada',
                    text: 'La clase teórica ya está disponible para los alumnos.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });
            }
            setIsModalOpen(false);
            fetchClases();
        } catch (error) {
            const errores = error.response?.data?.errores;
            Swal.fire({
                title: 'Error',
                text: errores ? errores.join(' ') : 'No se pudo guardar la clase. Intenta nuevamente.',
                icon: 'error',
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleDelete = async (id, titulo) => {
        const result = await Swal.fire({
            title: '¿Eliminar clase?',
            text: `Vas a eliminar "${titulo}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e293b',
            color: '#f1f5f9'
        });

        if (result.isConfirmed) {
            try {
                await eliminarClaseTeoricaRequest(id);
                Swal.fire({
                    title: 'Eliminada',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#3b82f6'
                });
                fetchClases();
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar la clase.',
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

            <div className="vehiculos-page ct-page-wrapper">

                <div className="vehiculos-header">
                    <h1><MdOndemandVideo className="title-icon" /> Clases Teóricas</h1>
                    {isInstructor && (
                        <button className="ct-add-btn" onClick={handleOpenCreateModal} title="Nueva Clase Teórica">
                            +
                        </button>
                    )}
                </div>

                <div className="ct-white-container">
                    {clases.length > 0 ? (
                        clases.map((clase) => {
                            const pasada = esClasePasada(clase.fecha_hora);
                            return (
                                <div key={clase.id_clase} className={`ct-card ${pasada ? 'ct-card-pasada' : ''}`}>
                                    <div className="ct-card-left">
                                        <div className="ct-icon-container">
                                            <MdOndemandVideo size={36} />
                                        </div>
                                        <div className="ct-class-info">
                                            <h3><strong>{clase.titulo_clase}</strong></h3>
                                            <p>{formatearFecha(clase.fecha_hora)}</p>
                                            
                                            {clase.codigo_acceso && (
                                                <p style={{ marginTop: '5px', color: '#60a5fa', fontWeight: '500', fontSize: '0.9rem' }}>
                                                    Código de acceso: <span style={{ color: '#f1f5f9', letterSpacing: '1px' }}>{clase.codigo_acceso}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ct-card-right">
                                        {!isInstructor && clase.profesor && (
                                            <div className="ct-person-info">
                                                <p><strong>Profesor:</strong> {clase.profesor.nombre}</p>
                                            </div>
                                        )}

                                        {isInstructor ? (
                                            <div className="ct-actions-container">
                                                <button
                                                    className="ct-action-btn edit"
                                                    title="Editar Clase"
                                                    onClick={() => handleOpenEditModal(clase)}
                                                >
                                                    <AiOutlineEdit size={22} />
                                                </button>
                                                <button
                                                    className="ct-action-btn delete"
                                                    title="Eliminar Clase"
                                                    onClick={() => handleDelete(clase.id_clase, clase.titulo_clase)}
                                                >
                                                    <AiOutlineDelete size={22} />
                                                </button>
                                            </div>
                                        ) : (
                                            (() => {
                                                const disponible = puedeIngresar(clase.fecha_hora);
                                                return (
                                                    <a
                                                        href={disponible ? clase.enlace_videollamada : undefined}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => { if (!disponible) e.preventDefault(); }}
                                                        className={`ct-ingresar-btn ${!disponible ? 'ct-ingresar-btn-pasada' : ''}`}
                                                        title={
                                                            pasada
                                                                ? 'Esta clase ya finalizó'
                                                                : !disponible
                                                                    ? `Disponible ${MINUTOS_ANTICIPACION} minutos antes de la clase`
                                                                    : ''
                                                        }
                                                    >
                                                        Ingresar
                                                    </a>
                                                );
                                            })()
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        
                        <div className="ct-empty-state" style={{textAlign: 'center', padding: '40px 0'}}>
                            <MdOndemandVideo size={60} color="#94a3b8" />
                            <h2 style={{color: '#f1f5f9', marginTop: '20px'}}>No tienes clases teoricas programadas</h2>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="ct-modal-overlay" onClick={handleCloseModal}>
                    <div className="ct-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ct-modal-header">
                            <h2>{isEditing ? 'Editar Clase Teórica' : 'Nueva Clase Teórica'}</h2>
                            <button className="ct-modal-close" onClick={handleCloseModal}>
                                <AiOutlineClose size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="ct-form-group">
                                <label>Título de la Clase:</label>
                                <input
                                    type="text"
                                    name="titulo_clase"
                                    value={selectedClase.titulo_clase}
                                    onChange={handleFormChange}
                                    placeholder="Ej: Introducción a las señales de tránsito"
                                    required
                                />
                            </div>

                            <div className="ct-form-group">
                                <label>Fecha y Hora:</label>
                                <input
                                    type="datetime-local"
                                    name="fecha_hora"
                                    value={selectedClase.fecha_hora}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="ct-form-group">
                                <label>Enlace de Videollamada:</label>
                                <input
                                    type="url"
                                    name="enlace_videollamada"
                                    value={selectedClase.enlace_videollamada}
                                    onChange={handleFormChange}
                                    placeholder="https://www.zoom.com/es..."
                                    required
                                />
                            </div>

                            <div className="ct-form-group">
                                <label>Código de Acceso (Opcional):</label>
                                <input
                                    type="text"
                                    name="codigo_acceso"
                                    value={selectedClase.codigo_acceso}
                                    onChange={handleFormChange}
                                    placeholder="Ej: 123456 o xyz-abcd"
                                />
                            </div>

                            <div className="ct-modal-footer">
                                <button type="button" className="ct-btn-cancel" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ct-btn-confirm">
                                    {isEditing ? 'Guardar Cambios' : 'Crear Clase'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClasesTeoricas;