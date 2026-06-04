import React, { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { FiSliders } from "react-icons/fi"; 
import Swal from 'sweetalert2'; 
import { getUsersRequest, deleteUserRequest, updateUserRequest, createUserRequest } from '../services/user.services';
import Sidebar from '../components/Sidebar';
import '../styles/User.css'; 

const User = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ role: "", estado: "" });
    const [tempFilters, setTempFilters] = useState({ role: "", estado: "" });

    const initialFormState = {
        nombre: "",
        run: "",
        email: "",
        numeroTelefonico: "",
        role: "alumno",
        estado: "Activo",
        password: "" 
    };
    
    const [selectedUser, setSelectedUser] = useState(initialFormState);

    const fetchUsers = async () => {
        try {
            const response = await getUsersRequest();
            setUsers(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setError("No se pudieron cargar los usuarios.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    const handleDelete = async (id, nombre) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar al usuario ${nombre}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#1a2639',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUserRequest(id);
                    setUsers(users.filter(u => u.id !== id));
                    Swal.fire("Eliminado", "Usuario eliminado con éxito.", "success");
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: selectedUser.nombre,
                run: selectedUser.run,
                email: selectedUser.email,
                numeroTelefonico: String(selectedUser.numeroTelefonico),
                role: selectedUser.role,
                estado: selectedUser.estado 
            };

            if (isEditing) {
                await updateUserRequest(selectedUser.id, payload);
                Swal.fire("Éxito", "Usuario actualizado con éxito.", "success");
            } else {
                payload.password = selectedUser.password;
                await createUserRequest(payload);
                Swal.fire("Éxito", "Usuario creado con éxito.", "success");
            }
            
            setIsModalOpen(false);
            fetchUsers(); 
            
        } catch (error) {
            console.error("DETALLE DEL ERROR:", error.response?.data);
            const backendMessage = error.response?.data?.message || "Revisa la consola para más detalles.";
            if (error.response?.data?.errors) {
                Swal.fire("Error de validación", error.response.data.errors.join('\n'), "error");
            } else {
                Swal.fire("Error", backendMessage, "error");
            }
        }
    };

    const handleFormChange = (e) => setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    
    const handleOpenAddModal = () => {
        setSelectedUser(initialFormState); 
        setIsEditing(false); 
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser({ ...user, estado: user.estado || "Inactivo", password: "" });
        setIsEditing(true); 
        setIsModalOpen(true); 
    };
    const handleOpenFilterModal = () => {
        setTempFilters(activeFilters);
        setIsFilterModalOpen(true);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setActiveFilters(tempFilters);
        setIsFilterModalOpen(false);
    };

    const handleClearFilters = () => {
        const emptyFilters = { role: "", estado: "" };
        setActiveFilters(emptyFilters);
        setTempFilters(emptyFilters);
        setIsFilterModalOpen(false);
    };
    const filteredUsers = users.filter(user => {
        const matchRole = activeFilters.role === "" || user.role === activeFilters.role;
        const matchEstado = activeFilters.estado === "" || user.estado === activeFilters.estado;
        return matchRole && matchEstado;
    });
    const rolePriority = { admin: 1, secretaria: 2, instructor: 3, alumno: 4 };
    const displayUsers = [...filteredUsers].sort((a, b) => {
        const prioridadA = rolePriority[a.role?.toLowerCase()] || 5;
        const prioridadB = rolePriority[b.role?.toLowerCase()] || 5;
        if (prioridadA !== prioridadB) return prioridadA - prioridadB;
        return a.nombre.localeCompare(b.nombre);
    });

    return (
        <div className="main-container">
            <Sidebar />

            <div className="users-page">
                <div className="users-header">
                    <h1><AiOutlineUser className="title-icon"/> Gestión de Usuarios</h1>
                    
                    <div className="header-actions">
                        <button 
                            className="btn-filter" 
                            onClick={handleOpenFilterModal}
                            title="Filtrar Usuarios"
                        >
                            <FiSliders />
                        </button>

                        <button 
                            className="btn-add" 
                            onClick={handleOpenAddModal}
                            title="Registrar Nuevo Usuario"
                        >
                            +
                        </button>
                    </div>
                </div>
                
                {error && <p className="error-msg">{error}</p>}

                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>RUN</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayUsers.length > 0 ? (
                                displayUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td><strong>{user.nombre}</strong></td>
                                        <td>{user.run}</td>
                                        <td>{user.email}</td>
                                        <td>{user.numeroTelefonico}</td>
                                        <td>
                                            <span className={`estado-badge ${user.role?.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`estado-badge ${(user.estado || 'inactivo').toLowerCase()}`}>
                                                {user.estado || 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="acciones-celda">
                                            <button 
                                                className="btn-action editar" 
                                                title="Editar"
                                                onClick={() => handleOpenEditModal(user)} 
                                            >
                                                <AiOutlineEdit />
                                            </button>

                                            <button 
                                                className="btn-action eliminar" 
                                                title="Eliminar"
                                                onClick={() => handleDelete(user.id, user.nombre)}
                                            >
                                                <AiOutlineDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No se encontraron usuarios con esos filtros.</td>
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
                            <h2>{isEditing ? `Editar Usuario: ${selectedUser.nombre}` : "Registrar Nuevo Usuario"}</h2>
                            <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                                <AiOutlineClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Nombre Completo:</label>
                                <input type="text" name="nombre" value={selectedUser.nombre} onChange={handleFormChange} required />
                            </div>
                            
                            <div className="form-group">
                                <label>RUN:</label>
                                <input type="text" name="run" value={selectedUser.run} onChange={handleFormChange} required placeholder="12345678-9"/>
                            </div>

                            <div className="form-group">
                                <label>Correo Electrónico:</label>
                                <input type="email" name="email" value={selectedUser.email} onChange={handleFormChange} required />
                            </div>

                            <div className="form-group">
                                <label>Teléfono (Debe empezar con 9):</label>
                                <input type="text" name="numeroTelefonico" value={selectedUser.numeroTelefonico} onChange={handleFormChange} required maxLength="9" placeholder="912345678" />
                            </div>

                            {!isEditing && (
                                <div className="form-group">
                                    <label>Contraseña Temporal:</label>
                                    <input type="password" name="password" value={selectedUser.password} onChange={handleFormChange} required />
                                </div>
                            )}
                            
                            <div className="form-group">
                                <label>Rol:</label>
                                <select name="role" value={selectedUser.role} onChange={handleFormChange} required>
                                    <option value="alumno">Alumno</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="secretaria">Secretaria</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Estado del Acceso:</label>
                                <select name="estado" value={selectedUser.estado} onChange={handleFormChange} required>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="Reprobado">Reprobado</option>
                                </select>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">{isEditing ? "Guardar Cambios" : "Crear Usuario"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isFilterModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>Filtrar Usuarios</h2>
                            <button className="btn-close-modal" onClick={() => setIsFilterModalOpen(false)}>
                                <AiOutlineClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleFilterSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Filtrar por Rol:</label>
                                <select 
                                    value={tempFilters.role} 
                                    onChange={(e) => setTempFilters({ ...tempFilters, role: e.target.value })}
                                >
                                    <option value="">Todos los Roles</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="secretaria">Secretaria</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Filtrar por Estado:</label>
                                <select 
                                    value={tempFilters.estado} 
                                    onChange={(e) => setTempFilters({ ...tempFilters, estado: e.target.value })}
                                >
                                    <option value="">Todos los Estados</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="Reprobado">Reprobado</option>
                                </select>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleClearFilters}>Limpiar Filtros</button>
                                <button type="submit" className="btn-save">Aplicar Filtro</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;