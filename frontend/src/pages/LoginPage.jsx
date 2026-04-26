import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials.email, credentials.password);
            navigate('/home');
        } catch (err) {
            setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>DrivingUBB</h1>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-register">Entrar</button>
                </form>
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
                <div className="footer-links">
                    <Link to="/">¿No tienes cuenta? Solicita pre-inscripción</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;