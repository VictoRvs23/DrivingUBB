import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { AiOutlineUser, AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import Swal from 'sweetalert2'; 
import { updateUserRequest } from '../services/user.services';
import '../styles/Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        numeroTelefonico: "",
        direccion: ""
    });

    const currentUser = user || {
        id: null,
        nombre: "Cargando...",
        role: "...",
        email: "...",
        run: "...",
        numeroTelefonico: "...",
        direccion: "No registrada"
    };

    const avatarUrl = user?.foto 
        ? user.foto 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.nombre)}&background=94a3b8&color=fff&size=200&font-size=0.4`;

    const handleOpenModal = () => {
        setFormData({
            nombre: currentUser.nombre || "",
            numeroTelefonico: currentUser.numeroTelefonico || "",
            direccion: currentUser.direccion || ""
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...currentUser,
                nombre: formData.nombre,
                numeroTelefonico: formData.numeroTelefonico,
                direccion: formData.direccion
            };

            await updateUserRequest(currentUser.id, payload);
            
            Swal.fire({
                title: "Éxito", 
                text: "Tu perfil ha sido actualizado.", 
                icon: "success",
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#8b5cf6'
            }).then(() => {
                window.location.reload();
            });
            
        } catch (error) {
            console.error("Error al actualizar perfil:", error.response?.data);
            const backendMessage = error.response?.data?.message || "Revisa la consola para más detalles.";
            
            Swal.fire({
                title: "Error", 
                text: backendMessage, 
                icon: "error",
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#8b5cf6'
            });
        }
    };

    return (
        <div className="main-container">
            <Sidebar />

            <div className="profile-page">
                <div className="profile-header">
                    <h1><AiOutlineUser className="title-icon"/> Perfil de Usuario</h1>
                </div>

                <div className="profile-card-container">
                    <div className="profile-card">
                        <button 
                            className="btn-action editar btn-edit-profile" 
                            title="Editar Perfil"
                            onClick={handleOpenModal}
                        >
                            <AiOutlineEdit />
                        </button>

                        <div className="profile-content">
                            <div className="profile-image-section">
                                <div className="image-wrapper">
                                    <img src={avatarUrl} alt={`Avatar de ${currentUser.nombre}`} />
                                </div>
                                <span className={`estado-badge role-badge ${currentUser.role?.toLowerCase()}`}>
                                    {currentUser.role?.toUpperCase()}
                                </span>
                            </div>

                            <div className="profile-details-section">
                                <div className="detail-group">
                                    <label>Nombre Completo</label>
                                    <p className="detail-value highlight">{currentUser.nombre}</p>
                                </div>

                                <div className="detail-group">
                                    <label>Correo Electrónico</label>
                                    <p className="detail-value">{currentUser.email}</p>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-group">
                                        <label>RUT / RUN</label>
                                        <p className="detail-value">{currentUser.run || currentUser.rut}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Número Telefónico</label>
                                        <p className="detail-value">
                                            {currentUser.numeroTelefonico ? `+56 ${currentUser.numeroTelefonico}` : "No registrado"}
                                        </p>
                                    </div>
                                </div>

                                <div className="detail-group">
                                    <label>Dirección</label>
                                    <p className="detail-value">{currentUser.direccion || "No registrada en el sistema"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Actualizar mis datos</h2>
                            <button className="btn-close-modal" onClick={handleCloseModal}>
                                <AiOutlineClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Nombre Completo:</label>
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    value={formData.nombre} 
                                    onChange={handleFormChange} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Teléfono (Ej: 912345678):</label>
                                <input 
                                    type="text" 
                                    name="numeroTelefonico" 
                                    value={formData.numeroTelefonico} 
                                    onChange={handleFormChange} 
                                    maxLength="9"
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Dirección:</label>
                                <input 
                                    type="text" 
                                    name="direccion" 
                                    value={formData.direccion} 
                                    onChange={handleFormChange} 
                                    placeholder="Ej: Los Carrera 123, Concepción"
                                    required 
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-save" style={{backgroundColor: '#8b5cf6'}}>Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;