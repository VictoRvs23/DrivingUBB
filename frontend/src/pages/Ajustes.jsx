import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdOutlineSettings } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import { changePasswordRequest, toggleEmailsRequest } from '../services/configuracion.services';
import { useDarkMode } from '../context/DarkModeContext';
import '../styles/Ajustes.css';

const Toggle = ({ checked, onChange, disabled = false, id }) => (
    <label className={`toggle-switch ${disabled ? 'toggle-switch--disabled' : ''}`} htmlFor={id}>
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => !disabled && onChange(e.target.checked)}
            disabled={disabled}
        />
        <span className="toggle-track">
            <span className="toggle-thumb" />
        </span>
    </label>
);

const PasswordInput = ({ id, label, value, onChange }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="ajustes-field">
            <label htmlFor={id} className="ajustes-field-label">{label}</label>
            <div className="ajustes-input-wrapper">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className="ajustes-input"
                    autoComplete="off"
                />
                <button
                    type="button"
                    className="ajustes-eye-btn"
                    onClick={() => setVisible(!visible)}
                    tabIndex={-1}
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
            </div>
        </div>
    );
};

const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8)           score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw))  score++;
    return score;
};
const STRENGTH_LABELS = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
const STRENGTH_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#478049', '#22c55e'];

const PasswordStrength = ({ password }) => {
    const score = getStrength(password);
    return (
        <div className="pw-strength">
            <div className="pw-strength-bars">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="pw-strength-bar"
                        style={{ background: i < score ? STRENGTH_COLORS[score] : '#334155', transition: 'background 0.3s ease' }}
                    />
                ))}
            </div>
            <span className="pw-strength-label" style={{ color: STRENGTH_COLORS[score] }}>
                {STRENGTH_LABELS[score]}
            </span>
        </div>
    );
};

const Ajustes = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [oldPassword, setOldPassword]         = useState('');
    const [newPassword, setNewPassword]         = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwError, setPwError]                 = useState('');
    const [pwLoading, setPwLoading]             = useState(false);
    const [pwToast, setPwToast]                 = useState(null);
    const [cooldownMsg, setCooldownMsg]         = useState('');
    const [recibirCorreos, setRecibirCorreos] = useState(() => {
        const saved = localStorage.getItem('recibir_correos');
        return saved !== null ? saved === 'true' : true;
    });
    const [correoLoading, setCorreoLoading] = useState(false);
    const [correoToast, setCorreoToast]     = useState(null);

    const showToast = (setter, tipo, msg) => {
        setter({ tipo, msg });
        setTimeout(() => setter(null), 3500);
    };

    const validatePassword = () => {
        if (!oldPassword || !newPassword || !confirmPassword)
            return 'Todos los campos son obligatorios.';
        if (newPassword.length < 6)
            return 'La nueva contraseña debe tener al menos 6 caracteres.';
        if (newPassword !== confirmPassword)
            return 'Las nuevas contraseñas no coinciden.';
        if (oldPassword === newPassword)
            return 'La nueva contraseña no puede ser igual a la actual.';
        return null;
    };

    const handleChangePassword = async () => {
        setPwError('');
        setCooldownMsg('');

        const validationError = validatePassword();
        if (validationError) { setPwError(validationError); return; }

        setPwLoading(true);
        try {
            await changePasswordRequest({ oldPassword, newPassword, confirmPassword });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast(setPwToast, 'success', 'Contraseña actualizada exitosamente.');
        } catch (err) {
            if (err.status === 429 || err.message?.includes('esperar')) {
                setCooldownMsg(err.message);
            } else {
                setPwError(err.message || 'Error al cambiar la contraseña.');
            }
        } finally {
            setPwLoading(false);
        }
    };

    const handleToggleCorreos = async (nuevoValor) => {
        setCorreoLoading(true);
        try {
            const res = await toggleEmailsRequest(nuevoValor);
            const valorFinal = res.recibir_correos;
            setRecibirCorreos(valorFinal);
            localStorage.setItem('recibir_correos', String(valorFinal));
            showToast(setCorreoToast, 'success', res.message || 'Preferencia actualizada.');
        } catch (err) {
            showToast(setCorreoToast, 'error', err.message || 'Error al actualizar preferencia.');
        } finally {
            setCorreoLoading(false);
        }
    };

    const handleToggleDarkMode = (nuevoValor) => {
        toggleDarkMode(nuevoValor);
    };

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page ajustes-page">

                {/* Header */}
                <div className="vehiculos-header ajustes-header">
                    <h1>
                        <MdOutlineSettings className="title-icon" style={{ fontSize: '2.2rem' }} />
                        Ajustes
                    </h1>
                </div>

                {/* Card principal */}
                <div className="ajustes-card">

                    {/* ── Columna izquierda: Seguridad ── */}
                    <div className="ajustes-seccion">
                        <h2 className="ajustes-seccion-titulo">Seguridad</h2>

                        {/* Aviso de cooldown que viene del backend */}
                        {cooldownMsg && (
                            <div className="ajustes-cooldown-aviso">
                                {cooldownMsg}
                            </div>
                        )}

                        <PasswordInput
                            id="old-password"
                            label="Contraseña actual"
                            value={oldPassword}
                            onChange={(e) => { setOldPassword(e.target.value); setPwError(''); }}
                        />
                        <PasswordInput
                            id="new-password"
                            label="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setPwError(''); }}
                        />
                        <PasswordInput
                            id="confirm-password"
                            label="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }}
                        />

                        {newPassword.length > 0 && (
                            <PasswordStrength password={newPassword} />
                        )}

                        {pwError && <p className="ajustes-error-msg">{pwError}</p>}

                        <button
                            className="ajustes-btn-primary"
                            onClick={handleChangePassword}
                            disabled={pwLoading}
                        >
                            {pwLoading
                                ? <><span className="soporte-spinner" /> Actualizando...</>
                                : 'Actualizar Contraseña'}
                        </button>

                        {pwToast && (
                            <div className={`ajustes-toast ajustes-toast--${pwToast.tipo}`}>
                                {pwToast.tipo === 'success' ? '✓' : '✕'} {pwToast.msg}
                            </div>
                        )}
                    </div>

                    {/* Divisor vertical */}
                    <div className="ajustes-divisor" />

                    {/* ── Columna derecha: Preferencias ── */}
                    <div className="ajustes-seccion">
                        <h2 className="ajustes-seccion-titulo">Preferencias</h2>

                        {/* Correos electrónicos */}
                        <div className="ajustes-preferencia-row">
                            <div className="ajustes-preferencia-info">
                                <span className="ajustes-preferencia-label">Recibir correos electrónicos</span>
                                <span className="ajustes-preferencia-desc">
                                    Notificaciones sobre reservas, clases y avisos del sistema.
                                </span>
                            </div>
                            <Toggle
                                id="toggle-correos"
                                checked={recibirCorreos}
                                onChange={handleToggleCorreos}
                                disabled={correoLoading}
                            />
                        </div>

                        {correoToast && (
                            <div className={`ajustes-toast ajustes-toast--${correoToast.tipo}`}>
                                {correoToast.tipo === 'success' ? '✓' : '✕'} {correoToast.msg}
                            </div>
                        )}

                        {/* Modo oscuro — ahora funcional */}
                        <div className="ajustes-preferencia-row">
                            <div className="ajustes-preferencia-info">
                                <span className="ajustes-preferencia-label">
                                    Modo oscuro
                                </span>
                                <span className="ajustes-preferencia-desc">
                                    Cambia la apariencia de la aplicación a tonos oscuros.
                                </span>
                            </div>
                            <Toggle
                                id="toggle-dark"
                                checked={darkMode}
                                onChange={handleToggleDarkMode}
                                disabled={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ajustes;
