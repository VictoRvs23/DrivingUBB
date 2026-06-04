import React, { useState, useRef } from 'react';
import {
    AiOutlineQuestionCircle,
    AiOutlineWarning,
    AiOutlineBulb,
    AiOutlineFileText,
    AiOutlinePaperClip,
    AiOutlineClose,
} from 'react-icons/ai';
import { createSoporteRequest } from '../../services/soporte.services';

/* ── Configuración por tipo ─────────────────────── */
const TIPO_CONFIG = {
    Duda: {
        label: 'Dudas / Consultas',
        Icon: AiOutlineQuestionCircle,
        descLabel: 'Descripción de la duda',
        placeholder: 'Describe tu duda o consulta con el mayor detalle posible...',
    },
    Error: {
        label: 'Reporte de Error',
        Icon: AiOutlineWarning,
        descLabel: 'Descripción del error',
        placeholder: 'Describe el error, qué estabas haciendo y qué mensaje apareció...',
    },
    Reclamo: {
        label: 'Reclamos',
        Icon: AiOutlineFileText,
        descLabel: 'Descripción del reclamo',
        placeholder: 'Describe tu reclamo en detalle. ¿Qué ocurrió y cuándo?...',
    },
    Sugerencia: {
        label: 'Sugerencias',
        Icon: AiOutlineBulb,
        descLabel: 'Descripción de la idea',
        placeholder: '¿Tienes una idea para mejorar? Cuéntanos todos los detalles...',
    },
};

const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/* ── Componente ──────────────────────────────────── */
const SoporteFormModal = ({ tipo, onClose }) => {
    const cfg = TIPO_CONFIG[tipo] || TIPO_CONFIG.Duda;
    const { Icon } = cfg;

    const [titulo, setTitulo]           = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen]           = useState(null);
    const [preview, setPreview]         = useState(null);
    const [errors, setErrors]           = useState({});
    const [loading, setLoading]         = useState(false);
    const [toast, setToast]             = useState(null); // { tipo: 'success'|'error', msg }

    const fileRef = useRef(null);

    /* ── Handlers ── */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrors((p) => ({ ...p, imagen: 'Solo se permiten imágenes.' }));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setErrors((p) => ({ ...p, imagen: 'La imagen no puede superar 10 MB.' }));
            return;
        }
        setImagen(file);
        setErrors((p) => { const n = { ...p }; delete n.imagen; return n; });
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const removeImagen = () => {
        setImagen(null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const validate = () => {
        const errs = {};
        if (!titulo.trim())
            errs.titulo = 'El título es obligatorio.';
        else if (titulo.trim().length < 5)
            errs.titulo = 'El título debe tener al menos 5 caracteres.';
        else if (titulo.trim().length > 150)
            errs.titulo = 'El título no puede superar 150 caracteres.';

        if (!descripcion.trim())
            errs.descripcion = 'La descripción es obligatoria.';
        else if (descripcion.trim().length < 10)
            errs.descripcion = 'La descripción debe tener al menos 10 caracteres.';

        return errs;
    };

    const showToast = (tipo, msg) => {
        setToast({ tipo, msg });
        setTimeout(() => setToast(null), 3200);
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        setErrors({});
        try {
            const formData = new FormData();
            formData.append('tipo', tipo);
            formData.append('titulo', titulo.trim());
            formData.append('descripcion', descripcion.trim());
            if (imagen) formData.append('imagen_adjunta', imagen);

            await createSoporteRequest(formData);
            showToast('success', '¡Solicitud enviada con éxito!');
            setTimeout(() => onClose(), 1600);
        } catch (err) {
            showToast('error', err.message || 'Error al enviar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="soporte-modal-overlay" onClick={handleOverlayClick}>
            <div className="soporte-modal-content">

                {/* Header */}
                <div className="soporte-modal-header">
                    <div className="soporte-modal-header-left">
                        <Icon style={{ fontSize: '1.5rem', color: '#94a3b8' }} />
                        <h2>{cfg.label}</h2>
                    </div>
                    <button className="btn-close-modal" onClick={onClose} aria-label="Cerrar">
                        <AiOutlineClose />
                    </button>
                </div>

                {/* Badge de tipo */}
                <div className="soporte-tipo-badge">
                    Tipo: <strong>{tipo}</strong>
                </div>

                {/* Título */}
                <div className="soporte-form-group">
                    <label htmlFor="sp-titulo">
                        Título <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        id="sp-titulo"
                        type="text"
                        maxLength={150}
                        placeholder="Resume tu solicitud en pocas palabras"
                        value={titulo}
                        className={errors.titulo ? 'input-error' : ''}
                        onChange={(e) => {
                            setTitulo(e.target.value);
                            if (errors.titulo) setErrors((p) => { const n = { ...p }; delete n.titulo; return n; });
                        }}
                    />
                    {errors.titulo && <span className="soporte-error-msg">{errors.titulo}</span>}
                </div>

                {/* Descripción */}
                <div className="soporte-form-group">
                    <label htmlFor="sp-desc">
                        {cfg.descLabel} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        id="sp-desc"
                        placeholder={cfg.placeholder}
                        value={descripcion}
                        className={errors.descripcion ? 'input-error' : ''}
                        onChange={(e) => {
                            setDescripcion(e.target.value);
                            if (errors.descripcion) setErrors((p) => { const n = { ...p }; delete n.descripcion; return n; });
                        }}
                    />
                    {errors.descripcion && <span className="soporte-error-msg">{errors.descripcion}</span>}
                </div>

                {/* Adjuntar imagen */}
                <div className="soporte-form-group">
                    <label>Imagen adjunta <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span></label>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {!imagen ? (
                        <button
                            type="button"
                            className="soporte-adjuntar-btn"
                            onClick={() => fileRef.current?.click()}
                        >
                            <AiOutlinePaperClip />
                            Adjuntar Ejemplo
                        </button>
                    ) : (
                        <div className="soporte-preview-box">
                            {preview && <img src={preview} alt="preview" />}
                            <div className="soporte-preview-info">
                                <span className="soporte-preview-nombre">{imagen.name}</span>
                                <span className="soporte-preview-size">{formatBytes(imagen.size)}</span>
                            </div>
                            <button
                                type="button"
                                className="soporte-preview-remove"
                                onClick={removeImagen}
                                aria-label="Quitar imagen"
                            >
                                <AiOutlineClose />
                            </button>
                        </div>
                    )}
                    {errors.imagen && <span className="soporte-error-msg">{errors.imagen}</span>}
                </div>

                {/* Acciones — reutiliza btn-cancel y btn-save del proyecto */}
                <div className="soporte-modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn-save" onClick={handleSubmit} disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {loading && <span className="soporte-spinner" />}
                        {loading ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`soporte-toast soporte-toast--${toast.tipo}`}>
                    {toast.tipo === 'success' ? '✓' : '✕'} {toast.msg}
                </div>
            )}
        </div>
    );
};

export default SoporteFormModal;
