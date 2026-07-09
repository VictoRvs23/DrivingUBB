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
        revision_tecnica: null,
        vencimiento_permiso: "",
        vencimiento_revision: ""
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

    const verificarDocumento = (fecha, archivo) => {
        if (!archivo && !fecha) return { texto: 'Sin Registro', clase: 'badge-gray' };
        if (!fecha) return { texto: 'Falta Fecha', clase: 'badge-gray' };
        
        const hoy = new Date();
        const vencimiento = new Date(fecha + 'T00:00:00'); 
        
        const diferenciaTiempo = vencimiento.getTime() - hoy.getTime();
        const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

        if (diasRestantes < 0) {
            return { texto: 'Vencido', clase: 'badge-red' }; 
        } else if (diasRestantes <= 30) {
            return { texto: `Vence en ${diasRestantes} días`, clase: 'badge-yellow' }; 
        } else {
            return { texto: 'Al Día', clase: 'badge-green' }; 
        }
    };

    const getEstadoVisual = (vehiculo) => vehiculo.estadoCalculado ?? vehiculo.estado;

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
            revision_tecnica: vehiculo.revision_tecnica,
            vencimiento_permiso: vehiculo.vencimiento_permiso ? vehiculo.vencimiento_permiso.split('T')[0] : "",
            vencimiento_revision: vehiculo.vencimiento_revision ? vehiculo.vencimiento_revision.split('T')[0] : ""
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
            formData.append('vencimiento_permiso', selectedVehiculo.vencimiento_permiso || '');
            formData.append('vencimiento_revision', selectedVehiculo.vencimiento_revision || '');

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
            console.error("DETALLE DEL ERROR DEL BACKEND:", JSON.stringify(error.response?.data, null, 2));
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
        return activeFilterEstado === "" || (v.estadoCalculado ?? v.estado) === activeFilterEstado;
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
                                        <td title={vehiculo.numeroMovil}>{vehiculo.numeroMovil}</td>
                                        <td title={vehiculo.patente}><strong>{vehiculo.patente}</strong></td>
                                        <td>
                                            <span className={`estado-badge ${getEstadoVisual(vehiculo)?.toLowerCase().replace(' ', '-')}`}>
                                                {getEstadoVisual(vehiculo)}
                                            </span>
                                        </td>
                                        
                                        <td>
                                            <div className="doc-cell-content">
                                                <span className={`doc-badge ${verificarDocumento(vehiculo.vencimiento_permiso, vehiculo.permiso_circulacion).clase}`}>
                                                    {verificarDocumento(vehiculo.vencimiento_permiso, vehiculo.permiso_circulacion).texto}
                                                </span>
                                                <button 
                                                    className="btn-documento"
                                                    onClick={() => handleVerDocumento(vehiculo.permiso_circulacion)}
                                                    style={{ color: vehiculo.permiso_circulacion?.includes('.pdf') ? '#ffffff' : '#94a3b8' }}
                                                    title="Ver Permiso de Circulación"
                                                >
                                                    <AiOutlineFilePdf size={20} color={vehiculo.permiso_circulacion?.includes('.pdf') ? "#ef4444" : "#94a3b8"} /> 
                                                    {vehiculo.permiso_circulacion?.includes('.pdf') ? "Ver PDF" : "Faltante"}
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="doc-cell-content">
                                                <span className={`doc-badge ${verificarDocumento(vehiculo.vencimiento_revision, vehiculo.revision_tecnica).clase}`}>
                                                    {verificarDocumento(vehiculo.vencimiento_revision, vehiculo.revision_tecnica).texto}
                                                </span>
                                                <button 
                                                    className="btn-documento"
                                                    onClick={() => handleVerDocumento(vehiculo.revision_tecnica)}
                                                    style={{ color: vehiculo.revision_tecnica?.includes('.pdf') ? '#ffffff' : '#94a3b8' }}
                                                    title="Ver Revisión Técnica"
                                                >
                                                    <AiOutlineFilePdf size={20} color={vehiculo.revision_tecnica?.includes('.pdf') ? "#ef4444" : "#94a3b8"} /> 
                                                    {vehiculo.revision_tecnica?.includes('.pdf') ? "Ver PDF" : "Faltante"}
                                                </button>
                                            </div>
                                        </td>
                                        
                                        <td className="acciones-celda">
                                            <div className="acciones-wrapper">
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
                                            </div>
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
                    <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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
                            
                            {isEditing && (
                                <div className="form-group">
                                    <label>Estado:</label>
                                    <select name="estado" value={selectedVehiculo.estado} onChange={handleFormChange} required>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Mantencion">Mantencion</option>
                                        <option value="En Ruta">En Ruta</option>
                                        <option value="No Disponible">No Disponible</option>
                                    </select>
                                </div>
                            )}
                            
                            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>Permiso de Circulación (PDF):</label>
                                    {isEditing && selectedVehiculo.permiso_circulacion && selectedVehiculo.permiso_circulacion.includes('.pdf') && !archivosAQuitar.permiso ? (
                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                            <AiOutlineFilePdf color="#ef4444" size={24} style={{ marginRight: '10px' }}/>
                                            <span style={{ color: '#f1f5f9', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }} title={selectedVehiculo.permiso_circulacion}>
                                                Archivo Actual
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
                                        />
                                    )}
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Fecha de Vencimiento del Permiso:</label>
                                    <input 
                                        type="date" 
                                        name="vencimiento_permiso" 
                                        value={selectedVehiculo.vencimiento_permiso} 
                                        onChange={handleFormChange} 
                                        style={{ backgroundColor: '#1e293b' }}
                                    />
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>Revisión Técnica (PDF):</label>
                                    {isEditing && selectedVehiculo.revision_tecnica && selectedVehiculo.revision_tecnica.includes('.pdf') && !archivosAQuitar.revision ? (
                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                            <AiOutlineFilePdf color="#ef4444" size={24} style={{ marginRight: '10px' }}/>
                                            <span style={{ color: '#f1f5f9', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }} title={selectedVehiculo.revision_tecnica}>
                                                Archivo Actual
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
                                        />
                                    )}
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Fecha de Vencimiento de la Revisión:</label>
                                    <input 
                                        type="date" 
                                        name="vencimiento_revision" 
                                        value={selectedVehiculo.vencimiento_revision} 
                                        onChange={handleFormChange}
                                        style={{ backgroundColor: '#1e293b' }}
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-save">{isEditing ? "Guardar Cambios" : "Crear Vehículo"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {isFilterModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>Filtrar Vehículos</h2>
                            <button className="btn-close-modal" onClick={() => setIsFilterModalOpen(false)}>
                                <AiOutlineClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleFilterSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Filtrar por Estado:</label>
                                <select 
                                    value={tempFilterEstado} 
                                    onChange={(e) => setTempFilterEstado(e.target.value)}
                                >
                                    <option value="">Todos los Estados</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Mantencion">Mantencion</option>
                                    <option value="En Ruta">En Ruta</option>
                                    <option value="No Disponible">No Disponible</option>
                                </select>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleClearFilters}>Limpiar Filtro</button>
                                <button type="submit" className="btn-save">Aplicar Filtro</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehiculos;