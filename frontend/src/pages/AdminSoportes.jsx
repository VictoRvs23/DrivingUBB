import React, { useEffect, useState, useCallback } from 'react';
import {
    AiOutlineQuestionCircle,
    AiOutlineWarning,
    AiOutlineBulb,
    AiOutlineFileText,
    AiOutlineClose,
    AiOutlineDelete,
    AiOutlineMessage,
} from 'react-icons/ai';
import { MdOutlineSupportAgent } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import FiltroTipo from '../components/soporte/FiltroTipo';
import { getAllSoportesRequest, responderSoporteRequest, deleteSoporteRequest } from '../services/soporte.services';
import '../styles/Soporte.css';

/* ── Configuración por tipo ─────────────────────── */
const TIPO_CONFIG = {
    Duda:       { label: 'Duda / Consulta',  Icon: AiOutlineQuestionCircle },
    Error:      { label: 'Reporte de Error', Icon: AiOutlineWarning },
    Reclamo:    { label: 'Reclamo',          Icon: AiOutlineFileText },
    Sugerencia: { label: 'Sugerencia',       Icon: AiOutlineBulb },
};

const ESTADO_CONFIG = {
    'sin respuesta': { label: 'Pendiente',  clase: 'pendiente' },
    'respondido':    { label: 'Respondido', clase: 'respondido' },
    'eliminado':     { label: 'Eliminado',  clase: 'eliminado' },
};

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

/* ── Modal de detalle + respuesta ───────────────── */
const DetalleAdminModal = ({ soporte, onCerrar, onResponder }) => {
    const cfg    = TIPO_CONFIG[soporte.tipo]    || { label: soporte.tipo,    Icon: AiOutlineFileText };
    const estado = ESTADO_CONFIG[soporte.estado] || { label: soporte.estado, clase: '' };
    const { Icon } = cfg;

    const [respuesta, setRespuesta]   = useState(soporte.respuesta_admin || '');
    const [loading, setLoading]       = useState(false);
    const [errMsg, setErrMsg]         = useState('');

    const yaEliminado = soporte.estado === 'eliminado';

    const handleResponder = async () => {
        if (!respuesta.trim()) {
            setErrMsg('La respuesta no puede estar vacía.');
            return;
        }
        if (respuesta.trim().length < 5) {
            setErrMsg('La respuesta debe tener al menos 5 caracteres.');
            return;
        }
        setLoading(true);
        setErrMsg('');
        try {
            await onResponder(soporte.id, respuesta.trim());
            onCerrar();
        } catch (err) {
            setErrMsg(err.message || 'Error al enviar la respuesta.');
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
                        <Icon style={{ fontSize: '1.5rem', color: '#94a3b8' }} />
                        <h2>{soporte.titulo}</h2>
                    </div>
                    <button className="btn-close-modal" onClick={onCerrar} aria-label="Cerrar">
                        <AiOutlineClose />
                    </button>
                </div>

                {/* Meta: tipo + usuario + fecha + estado */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
                    <span className="soporte-tipo-badge">
                        {cfg.label} · {formatFecha(soporte.created_at)}
                    </span>
                    <span className={`estado-badge-soporte ${estado.clase}`}>
                        {estado.label}
                    </span>
                    {soporte.usuario && (
                        <span className="soporte-tipo-badge" style={{ background: '#0f172a' }}>
                            👤 {soporte.usuario.nombre} — {soporte.usuario.email}
                        </span>
                    )}
                </div>

                {/* Descripción del usuario */}
                <div className="detalle-seccion">
                    <p className="detalle-seccion-title">Solicitud del usuario</p>
                    <p className="detalle-texto">{soporte.descripcion}</p>
                </div>

                {/* Imagen adjunta */}
                {soporte.imagen_adjunta && (
                    <div className="detalle-seccion">
                        <p className="detalle-seccion-title">Imagen adjunta</p>
                        <a href={soporte.imagen_adjunta} target="_blank" rel="noreferrer">
                            <img src={soporte.imagen_adjunta} alt="Adjunto" className="detalle-imagen" />
                        </a>
                    </div>
                )}

                {/* Respuesta del admin */}
                <div className="detalle-seccion">
                    <p className="detalle-seccion-title">
                        {soporte.respuesta_admin ? 'Respuesta enviada (editable)' : 'Escribir respuesta'}
                    </p>
                    {yaEliminado ? (
                        <div className="detalle-sin-respuesta">
                            Este ticket está eliminado y no puede ser respondido.
                        </div>
                    ) : (
                        <>
                            <textarea
                                className="admin-respuesta-textarea"
                                placeholder="Escribe aquí tu respuesta para el usuario..."
                                value={respuesta}
                                onChange={(e) => {
                                    setRespuesta(e.target.value);
                                    if (errMsg) setErrMsg('');
                                }}
                                rows={5}
                            />
                            {errMsg && <span className="soporte-error-msg">{errMsg}</span>}
                        </>
                    )}
                </div>

                {/* Acciones */}
                <div className="soporte-modal-actions">
                    <button className="btn-cancel" onClick={onCerrar} disabled={loading}>
                        Cancelar
                    </button>
                    {!yaEliminado && (
                        <button
                            className="btn-save"
                            onClick={handleResponder}
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {loading && <span className="soporte-spinner" />}
                            {loading ? 'Enviando...' : 'Enviar Respuesta'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Componente principal ────────────────────────── */
const AdminSoportes = () => {
    const [soportes, setSoportes]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [filtroTipo, setFiltroTipo] = useState(null);
    const [detalle, setDetalle]       = useState(null);
    const [toast, setToast]           = useState(null); // { tipo: 'success'|'error', msg }

    /* ── Fetch con filtro ── */
    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllSoportesRequest(filtroTipo);
            setSoportes(data);
        } catch (err) {
            setError(err.message || 'Error al cargar los soportes.');
        } finally {
            setLoading(false);
        }
    }, [filtroTipo]);

    useEffect(() => { cargar(); }, [cargar]);

    /* ── Toast helper ── */
    const showToast = (tipo, msg) => {
        setToast({ tipo, msg });
        setTimeout(() => setToast(null), 3200);
    };

    /* ── Responder ── */
    const handleResponder = async (id, respuesta_admin) => {
        await responderSoporteRequest(id, respuesta_admin);
        showToast('success', 'Respuesta enviada con éxito.');
        cargar(); // Recarga la tabla para actualizar estado
    };

    /* ── Eliminar (soft-delete) ── */
    const handleEliminar = async (soporte) => {
        const confirmar = window.confirm(
            `¿Estás seguro de marcar como eliminada la solicitud "${soporte.titulo}"?\nEsta acción cambia su estado a "Eliminado".`
        );
        if (!confirmar) return;
        try {
            await deleteSoporteRequest(soporte.id);
            showToast('success', 'Solicitud marcada como eliminada.');
            cargar();
        } catch (err) {
            showToast('error', err.message || 'Error al eliminar la solicitud.');
        }
    };

    /* ── Contadores por estado (para el resumen) ── */
    const totalPendientes  = soportes.filter(s => s.estado === 'sin respuesta').length;
    const totalRespondidos = soportes.filter(s => s.estado === 'respondido').length;
    const totalEliminados  = soportes.filter(s => s.estado === 'eliminado').length;

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">

                {/* Header — mismo patrón que Vehiculos / User */}
                <div className="vehiculos-header">
                    <h1>
                        <MdOutlineSupportAgent className="title-icon" style={{ fontSize: '2.2rem' }} />
                        Gestión de Soportes
                    </h1>
                </div>

                {/* Resumen rápido */}
                {!loading && !error && (
                    <div className="admin-soporte-resumen">
                        <div className="resumen-chip resumen-chip--total">
                            Total: <strong>{soportes.length}</strong>
                        </div>
                        <div className="resumen-chip resumen-chip--pendiente">
                            Pendientes: <strong>{totalPendientes}</strong>
                        </div>
                        <div className="resumen-chip resumen-chip--respondido">
                            Respondidos: <strong>{totalRespondidos}</strong>
                        </div>
                        <div className="resumen-chip resumen-chip--eliminado">
                            Eliminados: <strong>{totalEliminados}</strong>
                        </div>
                    </div>
                )}

                {/* Filtro por tipo */}
                <FiltroTipo tipoActivo={filtroTipo} onChange={setFiltroTipo} />

                {/* Estados de carga */}
                {loading && <div className="solicitudes-loading">Cargando soportes...</div>}
                {!loading && error && (
                    <div className="solicitudes-empty" style={{ color: '#ef4444' }}>{error}</div>
                )}

                {/* Tabla */}
                {!loading && !error && (
                    <div className="table-container">
                        {soportes.length === 0 ? (
                            <p className="text-center">
                                {filtroTipo
                                    ? `No hay solicitudes de tipo "${filtroTipo}".`
                                    : 'No hay solicitudes registradas.'}
                            </p>
                        ) : (
                            <table className="vehiculos-table">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Título</th>
                                        <th>Usuario</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {soportes.map((s) => {
                                        const cfg    = TIPO_CONFIG[s.tipo]    || { label: s.tipo,    Icon: AiOutlineFileText };
                                        const estado = ESTADO_CONFIG[s.estado] || { label: s.estado, clase: '' };
                                        const { Icon } = cfg;
                                        const yaEliminado = s.estado === 'eliminado';

                                        return (
                                            <tr key={s.id} className={yaEliminado ? 'fila-eliminada' : ''}>

                                                {/* Tipo */}
                                                <td>
                                                    <div className="admin-tipo-cell">
                                                        <Icon style={{ fontSize: '1.2rem', color: '#94a3b8', flexShrink: 0 }} />
                                                        <span>{cfg.label}</span>
                                                    </div>
                                                </td>

                                                {/* Título */}
                                                <td>
                                                    <span className="admin-titulo-cell" title={s.titulo}>
                                                        {s.titulo.length > 45 ? s.titulo.slice(0, 45) + '…' : s.titulo}
                                                    </span>
                                                </td>

                                                {/* Usuario */}
                                                <td>
                                                    {s.usuario ? (
                                                        <div className="admin-usuario-cell">
                                                            <strong>{s.usuario.nombre}</strong>
                                                            <span>{s.usuario.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8' }}>—</span>
                                                    )}
                                                </td>

                                                {/* Fecha */}
                                                <td style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                                                    {formatFecha(s.created_at)}
                                                </td>

                                                {/* Estado */}
                                                <td>
                                                    <span className={`estado-badge-soporte ${estado.clase}`}>
                                                        {estado.label}
                                                    </span>
                                                </td>

                                                {/* Acciones */}
                                                <td className="acciones-celda">
                                                    {/* Ver / Responder */}
                                                    <button
                                                        className="btn-action editar"
                                                        title={yaEliminado ? 'Ver detalle' : 'Ver / Responder'}
                                                        onClick={() => setDetalle(s)}
                                                    >
                                                        <AiOutlineMessage />
                                                    </button>

                                                    {/* Eliminar (solo si no está ya eliminado) */}
                                                    {!yaEliminado && (
                                                        <button
                                                            className="btn-action eliminar"
                                                            title="Marcar como eliminado"
                                                            onClick={() => handleEliminar(s)}
                                                        >
                                                            <AiOutlineDelete />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de detalle/respuesta */}
            {detalle && (
                <DetalleAdminModal
                    soporte={detalle}
                    onCerrar={() => setDetalle(null)}
                    onResponder={handleResponder}
                />
            )}

            {/* Toast de resultado */}
            {toast && (
                <div className={`soporte-toast soporte-toast--${toast.tipo}`}>
                    {toast.tipo === 'success' ? '✓' : '✕'} {toast.msg}
                </div>
            )}
        </div>
    );
};

export default AdminSoportes;
