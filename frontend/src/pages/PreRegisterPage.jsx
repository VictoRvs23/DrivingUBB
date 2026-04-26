import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Register.css';

const PreRegisterPage = () => {
    const [formData, setFormData] = useState({ nombre: '', rut: '', email: '' });
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('Solicitud enviada con éxito. DrivingUBB revisará tus datos');
        setFormData({ nombre: '', rut: '', email: '' });
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
                        <label>Correo Electrónico</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-register">Enviar Solicitud</button>
                </form>

                {mensaje && <p className="status-message" style={{color: 'green', marginTop: '10px'}}>{mensaje}</p>}
                
                <div className="footer-links">
                    <Link to="/login">¿Ya eres parte de DrivingUBB? Iniciar Sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default PreRegisterPage;