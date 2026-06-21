import React, { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose, AiOutlineCar } from "react-icons/ai";
import { getVehiculosRequest, deleteVehiculoRequest, updateVehiculoRequest, createVehiculoRequest } from '../services/vehiculo.services';
import Sidebar from '../components/Sidebar';
import '../styles/Vehiculos.css'; 

const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const initialFormState = {
        patente: "",
        numeroMovil: "",
        estado: "Disponible",
        permiso_circulacion: "",
        revision_tecnica: ""
    };
    
    const [selectedVehiculo, setSelectedVehiculo] = useState(initialFormState);
    const formatDateForInput = (dateValue) => {
        if (!dateValue) return "";
        
        const dateString = String(dateValue);

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        if (dateString.includes('T')) {
            return dateString.split('T')[0]; 
        }

        if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3 && parts[0].length === 2) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`; 
            }
        }

        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`; 
            }
        }

        return "";
    };

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
        const confirmar = window.confirm(`¿Estás seguro de eliminar el vehículo con patente ${patente}?`);
        if (confirmar) {
            try {
                await deleteVehiculoRequest(id);
                setVehiculos(vehiculos.filter(v => v.id !== id));
                alert("Vehículo eliminado con éxito.");
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("No se pudo eliminar el vehículo.");
            }
        }
    };

    const handleOpenAddModal = () => {
        setSelectedVehiculo(initialFormState); 
        setIsEditing(false); 
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (vehiculo) => {
        setSelectedVehiculo({
            ...vehiculo,
            permiso_circulacion: formatDateForInput(vehiculo.permiso_circulacion),
            revision_tecnica: formatDateForInput(vehiculo.revision_tecnica)
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                patente: selectedVehiculo.patente,
                numeroMovil: parseInt(selectedVehiculo.numeroMovil, 10),
                estado: selectedVehiculo.estado,
                permiso_circulacion: selectedVehiculo.permiso_circulacion,
                revision_tecnica: selectedVehiculo.revision_tecnica
            };

            if (isEditing) {
                await updateVehiculoRequest(selectedVehiculo.id, payload);
                setVehiculos(vehiculos.map(v => v.id === selectedVehiculo.id ? { ...payload, id: selectedVehiculo.id } : v));
                alert("Vehículo actualizado con éxito.");
            } else {
                const response = await createVehiculoRequest(payload);
                setVehiculos([...vehiculos, response.data]);
                alert("Vehículo creado con éxito.");
            }
            
            handleCloseModal();
            fetchVehiculos(); 
            
        } catch (error) {
            console.error("DETALLE DEL ERROR DEL BACKEND:", error.response?.data);
            const backendMessage = error.response?.data?.message || "Revisa la consola para ver qué campo falló.";
            alert(`Error 400: ${backendMessage}`);
        }
    };

    const vehiculosOrdenados = [...vehiculos].sort((a, b) => a.numeroMovil - b.numeroMovil);

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">
                <div className="vehiculos-header">
                    <h1><AiOutlineCar className="title-icon"/> Gestión de Vehículos</h1>
                    <button 
                        className="btn-add" 
                        onClick={handleOpenAddModal}
                        title="Registrar Nuevo Vehículo"
                    >
                        +
                    </button>
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
                                        <td>{formatDateForInput(vehiculo.permiso_circulacion)}</td>
                                        <td>{formatDateForInput(vehiculo.revision_tecnica)}</td>
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
                                    <td colSpan="6" className="text-center">No hay vehículos registrados.</td>
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
                                <label>Venc. Permiso Circulación:</label>
                                <input type="date" name="permiso_circulacion" value={selectedVehiculo.permiso_circulacion} onChange={handleFormChange} required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Venc. Revisión Técnica:</label>
                                <input type="date" name="revision_tecnica" value={selectedVehiculo.revision_tecnica} onChange={handleFormChange} required/>
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