import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerEvaluacionesPorEstudianteRequest } from '../services/evaluacionpractica.service.js';
import { obtenerExamenesPorEstudianteRequest } from '../services/examenteorico.service.js';
import Sidebar from '../components/Sidebar.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import CertificadoPDF from '../components/CertificadoPDF';
import '../styles/Home.css';
import '../styles/EvaluacionPractica.css';
import '../styles/examenteorico.css';
import '../styles/MisResultados.css';

const estadoLabel = (estado) => {
    if (estado === 'aprobado') return 'APROBADO';
    if (estado === 'reprobado') return 'REPROBADO';
    return 'EN PROGRESO';
};

const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
};

const MisResultados = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('practica');
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [seleccionado, setSeleccionado] = useState(null);
    const certificadoRef = useRef();

    const cargarEvaluaciones = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        setError('');
        try {
            const res = await obtenerEvaluacionesPorEstudianteRequest(user.id);
            setEvaluaciones(res.data);
        } catch (err) {
            setError('Error al cargar tus evaluaciones: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const cargarExamenes = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        setError('');
        try {
            const res = await obtenerExamenesPorEstudianteRequest(user.id);
            setExamenes(res.data);
        } catch (err) {
            setError('Error al cargar tus examenes: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        setSeleccionado(null);
        if (tab === 'practica') cargarEvaluaciones();
        else cargarExamenes();
    }, [tab, cargarEvaluaciones, cargarExamenes]);

    const tienePracticaAprobada = evaluaciones.some(ev => ev.estado === 'aprobado');
    const tieneTeoricoAprobado = examenes.some(ex => ex.retroalimentacion?.aprobo === true || ex.estado === 'aprobado');
    const cursoAprobado = tienePracticaAprobada && tieneTeoricoAprobado;
    const handleDescargarCertificado = async () => {
        try {
            Swal.fire({
                title: 'Generando Certificado...',
                text: 'Por favor espera unos segundos.',
                allowOutsideClick: false,
                background: '#1e293b',
                color: '#f1f5f9',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const elemento = certificadoRef.current;
            
            const canvas = await html2canvas(elemento, {
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const dataObtenida = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1123, 794]
            });
            
            pdf.addImage(dataObtenida, 'PNG', 0, 0, 1123, 794);
            pdf.save(`Certificado_DrivingUBB_${user?.run || 'Alumno'}.pdf`);

            Swal.fire({
                title: '¡Descarga Exitosa!',
                text: 'Tu certificado se ha guardado en tu equipo.',
                icon: 'success',
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#10b981'
            });

        } catch (error) {
            console.error("Error generando PDF:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al generar el documento.',
                icon: 'error',
                background: '#1e293b',
                color: '#f1f5f9'
            });
        }
    };

    const fechaHoy = new Date().toLocaleDateString('es-CL');

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="content-header">
                    <h1>Mis Resultados</h1>
                </header>

                {cursoAprobado && !loading && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                        border: '1px solid #10b981',
                        borderRadius: '12px',
                        padding: '20px 30px',
                        margin: '0 30px 25px 30px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div>
                            <h2 style={{ color: '#10b981', margin: '0 0 8px 0', fontSize: '1.5rem' }}>¡Felicidades, has aprobado el curso!</h2>
                            <p style={{ color: '#f1f5f9', margin: 0, fontSize: '1rem' }}>Has completado satisfactoriamente tus evaluaciones prácticas y teóricas.</p>
                        </div>
                        <button 
                            onClick={handleDescargarCertificado}
                            style={{ 
                                backgroundColor: '#10b981', 
                                color: '#ffffff', 
                                border: 'none', 
                                padding: '12px 24px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold', 
                                fontSize: '1rem',
                                transition: 'transform 0.2s',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Descargar Certificado
                        </button>
                    </div>
                )}

                <div className="mis-resultados-container">
                    <div className="historial-tabs">
                        <button
                            className={tab === 'practica' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => setTab('practica')}
                        >
                            Evaluación Práctica
                        </button>
                        <button
                            className={tab === 'teorico' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => setTab('teorico')}
                        >
                            Examen Teórico
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {loading && <p className="no-faltas">Cargando...</p>}

                    {!loading && !seleccionado && tab === 'practica' && (
                        <div className="historial-lista">
                            {evaluaciones.length === 0 && (
                                <p className="no-faltas">Aún no tienes evaluaciones prácticas registradas.</p>
                            )}
                            {evaluaciones.map((ev) => (
                                <div key={ev.id_evaluacion} className="historial-item" onClick={() => setSeleccionado(ev)}>
                                    <div>
                                        <span className="historial-item-fecha">{formatearFecha(ev.fecha_evaluacion)}</span>
                                        <span className="historial-item-sub">{ev.faltas?.length || 0} falta(s) registrada(s)</span>
                                    </div>
                                    <span className={`estado-chip ${ev.estado}`}>{estadoLabel(ev.estado)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !seleccionado && tab === 'teorico' && (
                        <div className="historial-lista">
                            {examenes.length === 0 && (
                                <p className="no-faltas">Aún no has rendido ningún examen teórico.</p>
                            )}
                            {examenes.map((ex) => {
                                const estadoFinal = ex.estado === 'en_progreso'
                                    ? 'en_progreso'
                                    : (ex.retroalimentacion?.aprobo ? 'aprobado' : 'reprobado');
                                return (
                                    <div key={ex.id_examen} className="historial-item" onClick={() => setSeleccionado(ex)}>
                                        <div>
                                            <span className="historial-item-fecha">{formatearFecha(ex.fecha_examen)}</span>
                                            <span className="historial-item-sub">
                                                {ex.puntaje_obtenido != null ? `${ex.puntaje_obtenido}%` : 'Sin finalizar'}
                                            </span>
                                        </div>
                                        <span className={`estado-chip ${estadoFinal}`}>{estadoLabel(estadoFinal)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {seleccionado && tab === 'practica' && (
                        <div className="evaluacion-resultados">
                            <button className="btn-volver" onClick={() => setSeleccionado(null)}>Volver al historial</button>
                            <h2>Evaluación del {formatearFecha(seleccionado.fecha_evaluacion)}</h2>

                            {seleccionado.estado === 'en_progreso' ? (
                                <p className="no-faltas">Esta evaluación todavía está en progreso.</p>
                            ) : (
                                <>
                                    <div className="resultado-header">
                                        <div className="score-badge-eval" style={{
                                            background: seleccionado.estado === 'aprobado'
                                                ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                                                : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                                            border: seleccionado.estado === 'aprobado' ? '3px solid #27ae60' : '3px solid #e74c3c'
                                        }}>
                                            <span className="score-value-eval">{seleccionado.puntaje_obtenido}%</span>
                                            <span className="score-label-eval">{estadoLabel(seleccionado.estado)}</span>
                                        </div>
                                    </div>

                                    {seleccionado.falta_critica && (
                                        <div className="warning-message">
                                            FALTA CRITICA DETECTADA EN ESTA EVALUACION
                                        </div>
                                    )}

                                    <div className="faltas-detalle">
                                        <h3>Faltas cometidas</h3>
                                        {(!seleccionado.faltas || seleccionado.faltas.length === 0) ? (
                                            <p className="no-faltas">Sin faltas registradas.</p>
                                        ) : (
                                            <ul>
                                                {seleccionado.faltas.map((f, idx) => (
                                                    <li key={idx} className={f.es_critica ? 'critica' : 'normal'}>
                                                        <span className="falta-nombre">{f.nombre_falta}</span>
                                                        <span className="falta-tipo">{f.es_critica ? 'Crítica' : 'Normal'}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {seleccionado.observaciones && (
                                        <div className="observaciones-box">
                                            <h3>Observaciones del instructor</h3>
                                            <p>{seleccionado.observaciones}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {seleccionado && tab === 'teorico' && (
                        <div className="examen-resultados">
                            <button className="btn-volver" onClick={() => setSeleccionado(null)}>Volver al historial</button>
                            <h2>Examen del {formatearFecha(seleccionado.fecha_examen)}</h2>

                            {seleccionado.estado === 'en_progreso' ? (
                                <p className="no-faltas">Este examen quedó sin finalizar.</p>
                            ) : (
                                <>
                                    <div className="resultado-header">
                                        <div className={`score-badge ${seleccionado.retroalimentacion?.aprobo ? 'aprobado' : 'reprobado'}`}>
                                            <span className="score-value">{seleccionado.puntaje_obtenido}%</span>
                                            <span className="score-label">{seleccionado.retroalimentacion?.aprobo ? 'APROBADO' : 'REPROBADO'}</span>
                                        </div>
                                    </div>

                                    <div className="resultado-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">Respuestas Correctas</span>
                                            <span className="stat-value">{seleccionado.retroalimentacion?.respuestas_correctas ?? 0}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Respuestas Incorrectas</span>
                                            <span className="stat-value">
                                                {(seleccionado.retroalimentacion?.total_respuestas ?? 0)
                                                    - (seleccionado.retroalimentacion?.respuestas_correctas ?? 0)}
                                            </span>
                                        </div>
                                    </div>

                                    {seleccionado.retroalimentacion?.preguntas_incorrectas?.length > 0 && (
                                        <div className="retroalimentacion">
                                            <h3>Preguntas que debes reforzar</h3>
                                            {seleccionado.retroalimentacion.preguntas_incorrectas.map((p, idx) => (
                                                <div key={idx} className="pregunta-incorrecta-item">
                                                    <p><strong>Pregunta:</strong> {p.texto}</p>
                                                    <p><strong>Tu respuesta:</strong> <span style={{ color: '#dc3545' }}>{p.respuesta_dada}</span></p>
                                                    <p><strong>Respuesta correcta:</strong> <span style={{ color: '#28a745' }}>{p.respuesta_correcta}</span></p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
                
                <CertificadoPDF 
                    ref={certificadoRef} 
                    alumno={{ nombre: user?.nombre || 'Estudiante', run: user?.run || 'Sin registro' }} 
                    fecha={fechaHoy}
                    nota="Aprobado con Distinción"
                />
            </main>
        </div>
    );
};

export default MisResultados;
