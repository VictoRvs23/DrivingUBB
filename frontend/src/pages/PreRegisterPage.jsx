import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { preRegisterRequest } from '../services/user.services.js';
import '../styles/Register.css';

const PreRegisterPage = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', numeroTelefonico: '', rut: '' });
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await preRegisterRequest(formData);
            setMensaje('¡Solicitud enviada con éxito! DrivingUBB revisará tus datos.');
            setFormData({ nombre: '', numeroTelefonico: '', email: '', rut: '' });
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al enviar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>DrivingUBB</h1>
                <h2>Pre-Inscripción de Alumno</h2>
                <p>Ingresa tus datos para el formulario de pre-inscripción.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>RUT</label>
                        <input type="text" name="rut" placeholder="12.345.678-9" value={formData.rut} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Número Telefónico</label>
                        <input type="text" name="numeroTelefonico" placeholder="+56912345678" value={formData.numeroTelefonico} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-register" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </form>

                {mensaje && (
                    <p className="status-message" style={{
                        color: mensaje.includes('Error') ? 'red' : 'green', 
                        marginTop: '10px'
                    }}>
                        {mensaje}
                    </p>
                )}
                
                <div className="footer-links">
                    <Link to="/login">¿Ya eres parte de DrivingUBB? Iniciar Sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default PreRegisterPage;