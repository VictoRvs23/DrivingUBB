import React, { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { getUsersRequest, deleteUserRequest, updateUserRequest, createUserRequest } from '../services/user.services';
import Sidebar from '../components/Sidebar';
import '../styles/User.css'; 

const User = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const initialFormState = {
        nombre: "",
        run: "",
        email: "",
        numeroTelefonico: "",
        role: "alumno",
        isApproved: "true",
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
        const confirmar = window.confirm(`¿Estás seguro de eliminar al usuario ${nombre}? Esta acción no se puede deshacer.`);
        if (confirmar) {
            try {
                await deleteUserRequest(id);
                setUsers(users.filter(u => u.id !== id));
                alert("Usuario eliminado con éxito.");
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("No se pudo eliminar el usuario.");
            }
        }
    };

    const handleOpenAddModal = () => {
        setSelectedUser(initialFormState); 
        setIsEditing(false); 
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser({
            ...user,
            isApproved: user.isApproved ? "true" : "false",
            password: ""
        });
        setIsEditing(true); 
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormChange = (e) => {
        setSelectedUser({
            ...selectedUser,
            [e.target.name]: e.target.value
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
                isApproved: selectedUser.isApproved === "true"
            };

            if (isEditing) {
                await updateUserRequest(selectedUser.id, payload);
                alert("Usuario actualizado con éxito.");
            } else {
                payload.password = selectedUser.password;
                await createUserRequest(payload);
                alert("Usuario creado con éxito.");
            }
            
            handleCloseModal();
            fetchUsers(); 
            
        } catch (error) {
            console.error("DETALLE DEL ERROR:", error.response?.data);
            const backendMessage = error.response?.data?.message || "Revisa la consola para más detalles.";
            
            if (error.response?.data?.errors) {
                alert(`Error de validación: \n- ${error.response.data.errors.join('\n- ')}`);
            } else {
                alert(`Error: ${backendMessage}`);
            }
        }
    };

    const sortedUsers = [...users].sort((a, b) => a.nombre.localeCompare(b.nombre));

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">
                <div className="vehiculos-header">
                    <h1><AiOutlineUser className="title-icon"/> Gestión de Usuarios</h1>
                    <button 
                        className="btn-add" 
                        onClick={handleOpenAddModal}
                        title="Registrar Nuevo Usuario"
                    >
                        +
                    </button>
                </div>
                
                {error && <p className="error-msg">{error}</p>}

                <div className="table-container">
                    <table className="vehiculos-table">
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
                            {sortedUsers.length > 0 ? (
                                sortedUsers.map((user) => (
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
                                            <span className={`estado-badge ${user.isApproved ? 'disponible' : 'mantencion'}`}>
                                                {user.isApproved ? 'Aprobado' : 'Pendiente'}
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
                                    <td colSpan="7" className="text-center">No hay usuarios registrados.</td>
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
                            <button className="btn-close-modal" onClick={handleCloseModal}>
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
                                <input 
                                    type="text" 
                                    name="numeroTelefonico" 
                                    value={selectedUser.numeroTelefonico} 
                                    onChange={handleFormChange} 
                                    required 
                                    maxLength="9"
                                    placeholder="912345678"
                                />
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
                                <select name="isApproved" value={selectedUser.isApproved} onChange={handleFormChange} required>
                                    <option value="true">Aprobado / Activo</option>
                                    <option value="false">Pendiente / Suspendido</option>
                                </select>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-save">{isEditing ? "Guardar Cambios" : "Crear Usuario"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;