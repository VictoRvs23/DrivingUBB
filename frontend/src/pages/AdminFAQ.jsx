import React, { useEffect, useState, useCallback } from 'react';
import {
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlineClose,
    AiOutlinePlus,
} from 'react-icons/ai';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import {
    getFAQsRequest,
    createFAQRequest,
    updateFAQRequest,
    deleteFAQRequest,
} from '../services/preguntaFrecuente.services';
import '../styles/Soporte.css';
import '../styles/FAQ.css';

const LIMITE_FAQS = 4;
const FORM_INICIAL = { pregunta: '', respuesta: '' };

const FAQModal = ({ faqEditar, onGuardar, onCerrar, totalActual }) => {
    const esEdicion = Boolean(faqEditar);

    const [form, setForm]     = useState(faqEditar ? { pregunta: faqEditar.pregunta, respuesta: faqEditar.respuesta } : FORM_INICIAL);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const errs = {};
        if (!form.pregunta.trim())
            errs.pregunta = 'La pregunta es obligatoria.';
        else if (form.pregunta.trim().length < 5)
            errs.pregunta = 'La pregunta debe tener al menos 5 caracteres.';
        else if (form.pregunta.trim().length > 255)
            errs.pregunta = 'La pregunta no puede superar 255 caracteres.';

        if (!form.respuesta.trim())
            errs.respuesta = 'La respuesta es obligatoria.';
        else if (form.respuesta.trim().length < 5)
            errs.respuesta = 'La respuesta debe tener al menos 5 caracteres.';

        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            await onGuardar(
                faqEditar?.id || null,
                { pregunta: form.pregunta.trim(), respuesta: form.respuesta.trim() }
            );
            onCerrar();
        } catch (err) {
            setErrors({ general: err.message || 'Error al guardar la pregunta frecuente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="soporte-modal-overlay" onClick={(e) => e.target === e.currentTarget && onCerrar()}>
            <div className="soporte-modal-content">

                {/* Header */}
                <div className="soporte-modal-header">
                    <div className="soporte-modal-header-left">
                        <MdOutlineQuestionAnswer style={{ fontSize: '1.5rem', color: '#94a3b8' }} />
                        <h2>{esEdicion ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}</h2>
                    </div>
                    <button className="btn-close-modal" onClick={onCerrar} aria-label="Cerrar">
                        <AiOutlineClose />
                    </button>
                </div>

                {/* Aviso de límite (solo en creación) */}
                {!esEdicion && (
                    <div className={`faq-limite-aviso ${totalActual >= LIMITE_FAQS ? 'faq-limite-aviso--lleno' : ''}`}>
                        {totalActual >= LIMITE_FAQS
                            ? `Límite alcanzado: ya hay ${LIMITE_FAQS} preguntas activas. Elimina una para poder añadir otra.`
                            : `${totalActual} / ${LIMITE_FAQS} preguntas frecuentes activas`}
                    </div>
                )}

                {/* Error general */}
                {errors.general && (
                    <div className="faq-error-general">{errors.general}</div>
                )}

                {/* Campo: Pregunta (título) */}
                <div className="soporte-form-group">
                    <label htmlFor="faq-pregunta">
                        Pregunta (título) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        id="faq-pregunta"
                        name="pregunta"
                        type="text"
                        maxLength={255}
                        placeholder="Ej: Cómo puedo restablecer mi contraseña"
                        value={form.pregunta}
                        className={errors.pregunta ? 'input-error' : ''}
                        onChange={handleChange}
                        disabled={!esEdicion && totalActual >= LIMITE_FAQS}
                    />
                    {/* Contador de caracteres */}
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textAlign: 'right', marginTop: '3px' }}>
                        {form.pregunta.length} / 255
                    </span>
                    {errors.pregunta && <span className="soporte-error-msg">{errors.pregunta}</span>}
                </div>

                {/* Campo: Respuesta (descripción) */}
                <div className="soporte-form-group">
                    <label htmlFor="faq-respuesta">
                        Respuesta <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        id="faq-respuesta"
                        name="respuesta"
                        placeholder="Escribe aquí la respuesta detallada..."
                        value={form.respuesta}
                        className={errors.respuesta ? 'input-error' : ''}
                        onChange={handleChange}
                        rows={5}
                        disabled={!esEdicion && totalActual >= LIMITE_FAQS}
                    />
                    {errors.respuesta && <span className="soporte-error-msg">{errors.respuesta}</span>}
                </div>

                {/* Acciones */}
                <div className="soporte-modal-actions">
                    <button className="btn-cancel" onClick={onCerrar} disabled={loading}>
                        Cancelar
                    </button>
                    <button
                        className="btn-save"
                        onClick={handleSubmit}
                        disabled={loading || (!esEdicion && totalActual >= LIMITE_FAQS)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {loading && <span className="soporte-spinner" />}
                        {loading ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Crear Pregunta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminFAQ = () => {
    const [faqs, setFaqs]         = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [modal, setModal]       = useState(null); 
    const [toast, setToast]       = useState(null);

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFAQsRequest();
            setFaqs(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Error al cargar las preguntas frecuentes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const showToast = (tipo, msg) => {
        setToast({ tipo, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleGuardar = async (id, data) => {
        if (id) {
            await updateFAQRequest(id, data);
            showToast('success', 'Pregunta frecuente actualizada con éxito.');
        } else {
            await createFAQRequest(data);
            showToast('success', 'Pregunta frecuente creada con éxito.');
        }
        cargar();
    };

    const handleEliminar = async (faq) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar la pregunta "¿${faq.pregunta}?". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e293b',
            color: '#f1f5f9'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteFAQRequest(faq.id);
            showToast('success', 'Pregunta frecuente eliminada.');
            cargar();
        } catch (err) {
            showToast('error', err.message || 'Error al eliminar la pregunta frecuente.');
        }
    };

    const limiteAlcanzado = faqs.length >= LIMITE_FAQS;

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">

                {/* Header con botón + */}
                <div className="vehiculos-header">
                    <h1>
                        <MdOutlineQuestionAnswer className="title-icon" style={{ fontSize: '2.2rem' }} />
                        Preguntas Frecuentes
                    </h1>
                    <button
                        className="btn-add"
                        title={limiteAlcanzado ? `Límite de ${LIMITE_FAQS} preguntas alcanzado` : 'Agregar pregunta frecuente'}
                        onClick={() => setModal('crear')}
                        disabled={limiteAlcanzado}
                        style={{ opacity: limiteAlcanzado ? 0.45 : 1, cursor: limiteAlcanzado ? 'not-allowed' : 'pointer' }}
                    >
                        <AiOutlinePlus />
                    </button>
                </div>

                {/* Contador de preguntas */}
                {!loading && !error && (
                    <div className="admin-soporte-resumen">
                        <div className={`resumen-chip ${limiteAlcanzado ? 'resumen-chip--pendiente' : 'resumen-chip--respondido'}`}>
                            {faqs.length} / {LIMITE_FAQS} preguntas activas
                            {limiteAlcanzado && ' — Límite alcanzado'}
                        </div>
                    </div>
                )}

                {/* Estados */}
                {loading && <div className="solicitudes-loading">Cargando preguntas frecuentes...</div>}

                {!loading && error && (
                    <div className="table-container">
                        <p className="text-center" style={{ color: '#ef4444' }}>{error}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                            <button className="btn-save" onClick={cargar}>Reintentar</button>
                        </div>
                    </div>
                )}

                {/* Tarjetas de preguntas frecuentes */}
                {!loading && !error && (
                    <div className="faq-admin-lista">
                        {faqs.length === 0 ? (
                            <div className="table-container">
                                <p className="text-center">No hay preguntas frecuentes. Usa el botón + para agregar la primera.</p>
                            </div>
                        ) : (
                            faqs.map((faq, index) => (
                                <div key={faq.id} className="faq-admin-card">
                                    {/* Número + pregunta */}
                                    <div className="faq-admin-card-body">
                                        <div className="faq-admin-numero">{index + 1}</div>
                                        <div className="faq-admin-contenido">
                                            <p className="faq-admin-pregunta">¿{faq.pregunta}?</p>
                                            <p className="faq-admin-respuesta">
                                                <span className="faq-respuesta-label">Respuesta:</span> {faq.respuesta}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="faq-admin-acciones">
                                        <button
                                            className="btn-action editar"
                                            title="Editar"
                                            onClick={() => setModal(faq)}
                                        >
                                            <AiOutlineEdit />
                                        </button>
                                        <button
                                            className="btn-action eliminar"
                                            title="Eliminar"
                                            onClick={() => handleEliminar(faq)}
                                        >
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal crear / editar */}
            {modal && (
                <FAQModal
                    faqEditar={modal === 'crear' ? null : modal}
                    onGuardar={handleGuardar}
                    onCerrar={() => setModal(null)}
                    totalActual={faqs.length}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className={`soporte-toast soporte-toast--${toast.tipo}`}>
                    {toast.tipo === 'success' ? '✓' : '✕'} {toast.msg}
                </div>
            )}
        </div>
    );
};

export default AdminFAQ;
