import React, { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose, AiOutlineCar, AiOutlineFilePdf } from "react-icons/ai";
import { FiSliders } from "react-icons/fi";
import Swal from 'sweetalert2'; 
import { getVehiculosRequest, deleteVehiculoRequest, updateVehiculoRequest, createVehiculoRequest } from '../services/vehiculo.services';
import Sidebar from '../components/Sidebar';
import '../styles/Vehiculos.css'; 

const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilterEstado, setActiveFilterEstado] = useState("");
    const [tempFilterEstado, setTempFilterEstado] = useState("");
    
    const initialFormState = {
        patente: "",
        numeroMovil: "",
        estado: "Disponible",
        permiso_circulacion: null, 
        revision_tecnica: null     
    };
    
    const [selectedVehiculo, setSelectedVehiculo] = useState(initialFormState);
    const [archivos, setArchivos] = useState({
        permiso_circulacion: null,
        revision_tecnica: null
    });
    
    const [archivosAQuitar, setArchivosAQuitar] = useState({
        permiso: false,
        revision: false
    });

    const fetchVehiculos = async () => {
        try {
            const response = await getVehiculosRequest();
            setVehiculos(response.data);
        } catch (error) {
            console.error("Error al cargar vehículos:", error);
            setError("No se pudieron cargar los vehículos.");
        }
    };

    useEffect(() => {
        fetchVehiculos();
    }, []);

    const handleDelete = async (id, patente) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el vehículo con patente ${patente}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', 
            cancelButtonColor: '#334155', 
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e293b', 
            color: '#f1f5f9' 
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteVehiculoRequest(id);
                    setVehiculos(vehiculos.filter(v => v.id !== id));
                    
                    Swal.fire({
                        title: "Eliminado",
                        text: "Vehículo eliminado con éxito.",
                        icon: "success",
                        background: '#1e293b',
                        color: '#f1f5f9',
                        confirmButtonColor: '#8b5cf6'
                    });
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar el vehículo.",
                        icon: "error",
                        background: '#1e293b',
                        color: '#f1f5f9',
                        confirmButtonColor: '#8b5cf6'
                    });
                }
            }
        });
    };

    const handleVerDocumento = (archivo) => {
        if (archivo && archivo.toLowerCase().includes('.pdf')) {
            window.open(`http://localhost:3000/uploads/${archivo}`, '_blank');
        } else if (archivo && !archivo.toLowerCase().includes('.pdf')) {
            Swal.fire({
                title: "Formato Incorrecto",
                text: "El archivo seleccionado no es un PDF.",
                icon: "error",
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#8b5cf6'
            });
        } else {
            Swal.fire({
                title: "Sin documento",
                text: "No existe un archivo registrado para este vehículo.",
                icon: "warning",
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#8b5cf6'
            });
        }
    };

    const handleOpenAddModal = () => {
        setSelectedVehiculo(initialFormState); 
        setArchivos({ permiso_circulacion: null, revision_tecnica: null }); 
        setArchivosAQuitar({ permiso: false, revision: false });
        setIsEditing(false); 
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (vehiculo) => {
        setSelectedVehiculo({
            id: vehiculo.id,
            patente: vehiculo.patente,
            numeroMovil: vehiculo.numeroMovil,
            estado: vehiculo.estado,
            permiso_circulacion: vehiculo.permiso_circulacion,
            revision_tecnica: vehiculo.revision_tecnica
        });
        setArchivos({ permiso_circulacion: null, revision_tecnica: null });
        setArchivosAQuitar({ permiso: false, revision: false }); 
        setIsEditing(true); 
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormChange = (e) => {
        setSelectedVehiculo({
            ...selectedVehiculo,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setArchivos({
            ...archivos,
            [e.target.name]: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('patente', selectedVehiculo.patente);
            formData.append('numeroMovil', parseInt(selectedVehiculo.numeroMovil, 10));
            formData.append('estado', selectedVehiculo.estado);

            if (archivos.permiso_circulacion) {
                formData.append('permiso_circulacion', archivos.permiso_circulacion);
            }
            if (archivos.revision_tecnica) {
                formData.append('revision_tecnica', archivos.revision_tecnica);
            }

            if (isEditing) {
                if (archivosAQuitar.permiso) formData.append('quitar_permiso', 'true');
                if (archivosAQuitar.revision) formData.append('quitar_revision', 'true');

                await updateVehiculoRequest(selectedVehiculo.id, formData);
                Swal.fire({
                    title: "Éxito",
                    text: "Vehículo actualizado con éxito.",
                    icon: "success",
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#8b5cf6'
                });
            } else {
                await createVehiculoRequest(formData);
                Swal.fire({
                    title: "Éxito",
                    text: "Vehículo creado con éxito.",
                    icon: "success",
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#8b5cf6'
                });
            }
            
            handleCloseModal();
            fetchVehiculos(); 
            
        } catch (error) {
            console.error("DETALLE DEL ERROR DEL BACKEND:", error.response?.data);
            const backendMessage = error.response?.data?.message || "Revisa la consola para más detalles.";
            
            if (error.response?.data?.errores) {
                Swal.fire({
                    title: "Error de validación", 
                    text: error.response.data.errores.join('\n'), 
                    icon: "error",
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#8b5cf6'
                });
            } else {
                Swal.fire({
                    title: "Error", 
                    text: backendMessage, 
                    icon: "error",
                    background: '#1e293b',
                    color: '#f1f5f9',
                    confirmButtonColor: '#8b5cf6'
                });
            }
        }
    };

    const handleOpenFilterModal = () => {
        setTempFilterEstado(activeFilterEstado);
        setIsFilterModalOpen(true);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setActiveFilterEstado(tempFilterEstado);
        setIsFilterModalOpen(false);
    };

    const handleClearFilters = () => {
        setActiveFilterEstado("");
        setTempFilterEstado("");
        setIsFilterModalOpen(false);
    };

    const filteredVehiculos = vehiculos.filter(v => {
        return activeFilterEstado === "" || v.estado === activeFilterEstado;
    });
    const vehiculosOrdenados = [...filteredVehiculos].sort((a, b) => a.numeroMovil - b.numeroMovil);

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">
                <div className="vehiculos-header">
                    <h1><AiOutlineCar className="title-icon"/> Gestión de Vehículos</h1>

                    <div className="header-actions">
                        <button 
                            className="btn-filter" 
                            onClick={handleOpenFilterModal}
                            title="Filtrar Vehículos"
                        >
                            <FiSliders />
                        </button>
                        
                        <button 
                            className="btn-add" 
                            onClick={handleOpenAddModal}
                            title="Registrar Nuevo Vehículo"
                        >
                            +
                        </button>
                    </div>
                </div>
                
                {error && <p className="error-msg">{error}</p>}

                <div className="table-container">
                    <table className="vehiculos-table">
                        <thead>
                            <tr>
                                <th>N° Móvil</th>
                                <th>Patente</th>
                                <th>Estado</th>
                                <th>Permiso Circulación</th>
                                <th>Revisión Técnica</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculosOrdenados.length > 0 ? (
                                vehiculosOrdenados.map((vehiculo) => (
                                    <tr key={vehiculo.id}>
                                        <td>{vehiculo.numeroMovil}</td>
                                        <td><strong>{vehiculo.patente}</strong></td>
                                        <td>
                                            <span className={`estado-badge ${vehiculo.estado?.toLowerCase().replace(' ', '-')}`}>
                                                {vehiculo.estado}
                                            </span>
                                        </td>
                                        
                                        <td>
                                            <button 
                                                className="btn-documento"
                                                onClick={() => handleVerDocumento(vehiculo.permiso_circulacion)}
                                                style={{ color: vehiculo.permiso_circulacion && vehiculo.permiso_circulacion.includes('.pdf') ? '#ffffff' : '#94a3b8' }}
                                                title="Ver Permiso de Circulación"
                                            >
                                                <AiOutlineFilePdf size={20} color={vehiculo.permiso_circulacion && vehiculo.permiso_circulacion.includes('.pdf') ? "#ef4444" : "#94a3b8"} /> 
                                                {vehiculo.permiso_circulacion && vehiculo.permiso_circulacion.includes('.pdf') ? "Ver Documento" : "Faltante"}
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn-documento"
                                                onClick={() => handleVerDocumento(vehiculo.revision_tecnica)}
                                                style={{ color: vehiculo.revision_tecnica && vehiculo.revision_tecnica.includes('.pdf') ? '#ffffff' : '#94a3b8' }}
                                                title="Ver Revisión Técnica"
                                            >
                                                <AiOutlineFilePdf size={20} color={vehiculo.revision_tecnica && vehiculo.revision_tecnica.includes('.pdf') ? "#ef4444" : "#94a3b8"} /> 
                                                {vehiculo.revision_tecnica && vehiculo.revision_tecnica.includes('.pdf') ? "Ver Documento" : "Faltante"}
                                            </button>
                                        </td>
                                        
                                        <td className="acciones-celda">
                                            <button 
                                                className="btn-action editar" 
                                                title="Editar"
                                                onClick={() => handleOpenEditModal(vehiculo)} 
                                            >
                                                <AiOutlineEdit />
                                            </button>

                                            <button 
                                                className="btn-action eliminar" 
                                                title="Eliminar"
                                                onClick={() => handleDelete(vehiculo.id, vehiculo.patente)}
                                            >
                                                <AiOutlineDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No se encontraron vehículos con esos filtros.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isEditing ? `Editar Vehículo: ${selectedVehiculo.patente}` : "Registrar Nuevo Vehículo"}</h2>
                            <button className="btn-close-modal" onClick={handleCloseModal}>
                                <AiOutlineClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Patente:</label>
                                <input type="text" name="patente" value={selectedVehiculo.patente} onChange={handleFormChange} required maxLength={6}/>
                            </div>
                            
                            <div className="form-group">
                                <label>Número Móvil:</label>
                                <input type="number" name="numeroMovil" value={selectedVehiculo.numeroMovil} onChange={handleFormChange} required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Estado:</label>
                                <select name="estado" value={selectedVehiculo.estado} onChange={handleFormChange} required>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Mantencion">Mantencion</option>
                                    <option value="En Ruta">En Ruta</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Permiso de Circulación (PDF):</label>
                                {isEditing && selectedVehiculo.permiso_circulacion && selectedVehiculo.permiso_circulacion.includes('.pdf') && !archivosAQuitar.permiso ? (
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                        <AiOutlineFilePdf color="#ef4444" size={24} style={{ marginRight: '10px' }}/>
                                        <span style={{ color: '#f1f5f9', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }} title={selectedVehiculo.permiso_circulacion}>
                                            Archivo Actual Guardado
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => setArchivosAQuitar({...archivosAQuitar, permiso: true})}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                            title="Eliminar documento actual"
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <input 
                                        type="file" 
                                        name="permiso_circulacion" 
                                        accept=".pdf" 
                                        onChange={handleFileChange} 
                                        required={!isEditing && !selectedVehiculo.permiso_circulacion} 
                                    />
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label>Revisión Técnica (PDF):</label>
                                {isEditing && selectedVehiculo.revision_tecnica && selectedVehiculo.revision_tecnica.includes('.pdf') && !archivosAQuitar.revision ? (
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                        <AiOutlineFilePdf color="#ef4444" size={24} style={{ marginRight: '10px' }}/>
                                        <span style={{ color: '#f1f5f9', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }} title={selectedVehiculo.revision_tecnica}>
                                            Archivo Actual Guardado
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => setArchivosAQuitar({...archivosAQuitar, revision: true})}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                            title="Eliminar documento actual"
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <input 
                                        type="file" 
                                        name="revision_tecnica" 
                                        accept=".pdf" 
                                        onChange={handleFileChange} 
                                        required={!isEditing && !selectedVehiculo.revision_tecnica}
                                    />
                                )}
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-save">{isEditing ? "Guardar Cambios" : "Crear Vehículo"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehiculos;