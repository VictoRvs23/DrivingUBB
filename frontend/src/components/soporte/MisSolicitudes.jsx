import React, { useEffect, useState } from 'react';
import {
    AiOutlineQuestionCircle,
    AiOutlineWarning,
    AiOutlineBulb,
    AiOutlineFileText,
    AiOutlineClose,
    AiOutlineLeft,
    AiOutlineRight,
} from 'react-icons/ai';
import { MdOutlineSupportAgent } from 'react-icons/md';
import Sidebar from '../Sidebar';
import { getMisSoportesRequest } from '../../services/soporte.services';
import '../../styles/Soporte.css';

/* ── Configuración por tipo ─────────────────────── */
const TIPO_CONFIG = {
    Duda:      { label: 'Duda / Consulta',   Icon: AiOutlineQuestionCircle },
    Error:     { label: 'Reporte de Error',   Icon: AiOutlineWarning },
    Reclamo:   { label: 'Reclamo',            Icon: AiOutlineFileText },
    Sugerencia:{ label: 'Sugerencia',         Icon: AiOutlineBulb },
};

const ESTADO_CONFIG = {
    'sin respuesta': { label: 'Pendiente',  clase: 'pendiente' },
    'respondido':    { label: 'Respondido', clase: 'respondido' },
    'eliminado':     { label: 'Eliminado',  clase: 'eliminado' },
};

const formatFecha = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/* ── Modal de detalle ────────────────────────────── */
const DetalleModal = ({ soporte, onCerrar }) => {
    const cfg    = TIPO_CONFIG[soporte.tipo]   || { label: soporte.tipo, Icon: AiOutlineFileText };
    const estado = ESTADO_CONFIG[soporte.estado] || { label: soporte.estado, clase: '' };
    const { Icon } = cfg;

    const handleOverlay = (e) => { if (e.target === e.currentTarget) onCerrar(); };

    return (
        <div className="soporte-modal-overlay" onClick={handleOverlay}>
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

                {/* Meta: tipo + fecha + estado */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
                    <span className="soporte-tipo-badge">
                        {cfg.label} · {formatFecha(soporte.created_at)}
                    </span>
                    <span className={`estado-badge-soporte ${estado.clase}`}>
                        {estado.label}
                    </span>
                </div>

                {/* Descripción */}
                <div className="detalle-seccion">
                    <p className="detalle-seccion-title">Tu solicitud</p>
                    <p className="detalle-texto">{soporte.descripcion}</p>
                </div>

                {/* Imagen adjunta */}
                {soporte.imagen_adjunta && (
                    <div className="detalle-seccion">
                        <p className="detalle-seccion-title">Imagen adjunta</p>
                        <a href={soporte.imagen_adjunta} target="_blank" rel="noreferrer">
                            <img
                                src={soporte.imagen_adjunta}
                                alt="Imagen adjunta"
                                className="detalle-imagen"
                            />
                        </a>
                    </div>
                )}

                {/* Respuesta del admin */}
                <div className="detalle-seccion">
                    <p className="detalle-seccion-title">Respuesta del equipo</p>
                    {soporte.respuesta_admin ? (
                        <div className="detalle-respuesta-box">{soporte.respuesta_admin}</div>
                    ) : (
                        <div className="detalle-sin-respuesta">
                            Tu solicitud está siendo revisada. Te responderemos a la brevedad.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="soporte-modal-actions">
                    <button className="btn-save" onClick={onCerrar}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

/* ── Componente principal ────────────────────────── */
const MisSolicitudes = ({ onVolver }) => {
    const [soportes, setSoportes] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [detalle, setDetalle]   = useState(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await getMisSoportesRequest();
                setSoportes(data);
            } catch (err) {
                setError(err.message || 'Error al cargar tus solicitudes.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">

                {/* Header — mismo patrón que el resto de páginas */}
                <div className="vehiculos-header">
                    <h1>
                        <MdOutlineSupportAgent className="title-icon" style={{ fontSize: '2.2rem' }} />
                        Mis Solicitudes
                    </h1>
                </div>

                {/* Botón volver */}
                <button className="solicitudes-back-btn" onClick={onVolver}>
                    <AiOutlineLeft />
                    Volver a Soporte
                </button>

                {/* Contenido */}
                {loading && (
                    <div className="solicitudes-loading">Cargando tus solicitudes...</div>
                )}

                {!loading && error && (
                    <div className="solicitudes-empty" style={{ color: '#ef4444' }}>{error}</div>
                )}

                {!loading && !error && soportes.length === 0 && (
                    <div className="table-container">
                        <p className="text-center">Aún no has enviado ninguna solicitud.</p>
                    </div>
                )}

                {!loading && !error && soportes.length > 0 && (
                    <div className="table-container">
                        <div className="solicitudes-lista">
                            {soportes.map((s) => {
                                const cfg    = TIPO_CONFIG[s.tipo]   || { label: s.tipo, Icon: AiOutlineFileText };
                                const estado = ESTADO_CONFIG[s.estado] || { label: s.estado, clase: '' };
                                const { Icon } = cfg;

                                return (
                                    <button
                                        key={s.id}
                                        className="solicitud-card"
                                        onClick={() => setDetalle(s)}
                                    >
                                        <Icon className="solicitud-icon" />

                                        <div className="solicitud-info">
                                            <p className="solicitud-tipo-titulo">
                                                <strong>{cfg.label}:</strong> {s.titulo}
                                            </p>
                                            <p className="solicitud-fecha">{formatFecha(s.created_at)}</p>
                                        </div>

                                        <div className="solicitud-right">
                                            <span className={`estado-badge-soporte ${estado.clase}`}>
                                                {estado.label}
                                            </span>
                                            <AiOutlineRight className="solicitud-chevron" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            {detalle && (
                <DetalleModal soporte={detalle} onCerrar={() => setDetalle(null)} />
            )}
        </div>
    );
};

export default MisSolicitudes;
