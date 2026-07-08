import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { preRegisterRequest } from '../services/user.services.js';
import '../styles/Register.css';

const PreRegisterPage = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', numeroTelefonico: '', run: '' });
    const [file, setFile] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            return setMensaje('Error: Debes adjuntar obligatoriamente el comprobante de tu transferencia o boleta.');
        }

        setLoading(true);
        setMensaje('');

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('run', formData.run);
        data.append('numeroTelefonico', formData.numeroTelefonico);
        data.append('email', formData.email);
        data.append('boleta', file);

        try {
            await preRegisterRequest(data);
            setMensaje('¡Solicitud enviada con éxito! DrivingUBB revisará tus datos y tu boleta.');
            setFormData({ nombre: '', numeroTelefonico: '', email: '', run: '' });
            setFile(null);
            e.target.reset();
        } catch (error) {
            const errorBackend = error.response?.data?.message || 'Error al enviar la solicitud';
            setMensaje(`Error: ${errorBackend}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>DrivingUBB</h1>
                <h2>Pre-Inscripción de Alumno</h2>
                <p>Ingresa tus datos y adjunta tu boleta de pago para la validación.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input type="text" name="nombre" placeholder="Juan Pérez" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>RUT / RUN</label>
                        <input type="text" name="run" placeholder="12.345.678-9" value={formData.run} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Número Telefónico</label>
                        <input type="text" name="numeroTelefonico" placeholder="912345678" value={formData.numeroTelefonico} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" name="email" placeholder="ejemplo@correo.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    
                    <div className="input-group">
                        <label>Adjuntar Boleta de Pago (PDF o Imágenes)</label>
                        <input type="file" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} required />
                    </div>

                    <button type="submit" className="btn-register" disabled={loading}>
                        {loading ? 'Subiendo archivos...' : 'Enviar Solicitud'}
                    </button>
                </form>

                {mensaje && (
                    <p className="status-message" style={{
                        color: mensaje.includes('Error') ? '#ef4444' : '#22c55e', 
                        marginTop: '15px',
                        fontWeight: 'bold'
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