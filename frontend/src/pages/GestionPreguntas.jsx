import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import {
    obtenerPreguntasRequest,
    crearPreguntaRequest,
    eliminarPreguntaRequest,
} from '../services/examenteorico.service.js';
import '../styles/Home.css';
import '../styles/EvaluacionPractica.css';
import '../styles/GestionPreguntas.css';

const preguntaVacia = {
    texto_pregunta: '',
    categoria: 'señales',
    opcion_a: '',
    opcion_b: '',
    opcion_c: '',
    opcion_d: '',
    respuesta_correcta: 'A',
    nivel_dificultad: 'medio',
};

const GestionPreguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [form, setForm] = useState(preguntaVacia);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cargarPreguntas = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await obtenerPreguntasRequest();
            setPreguntas(res.data);
        } catch (err) {
            setError('Error al cargar las preguntas: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarPreguntas();
    }, [cargarPreguntas]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await crearPreguntaRequest(form);
            setForm(preguntaVacia);
            await cargarPreguntas();
        } catch (err) {
            setError('Error al crear la pregunta: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id_pregunta) => {
        setLoading(true);
        setError('');
        try {
            await eliminarPreguntaRequest(id_pregunta);
            await cargarPreguntas();
        } catch (err) {
            setError('Error al eliminar la pregunta: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="content-header">
                    <h1>Gestión de Preguntas</h1>
                </header>

                <div className="gestion-preguntas-container">
                    {error && <div className="error-message">{error}</div>}

                    <div className="evaluacion-form">
                        <h2>Agregar Pregunta al Banco</h2>
                        <form onSubmit={handleCrear}>
                            <div className="form-group">
                                <label>Texto de la Pregunta</label>
                                <input
                                    type="text"
                                    name="texto_pregunta"
                                    value={form.texto_pregunta}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Categoría</label>
                                <select name="categoria" value={form.categoria} onChange={handleChange}>
                                    <option value="señales">Señales</option>
                                    <option value="mecanica">Mecánica</option>
                                    <option value="leyes">Leyes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Opción A</label>
                                <input type="text" name="opcion_a" value={form.opcion_a} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Opción B</label>
                                <input type="text" name="opcion_b" value={form.opcion_b} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Opción C</label>
                                <input type="text" name="opcion_c" value={form.opcion_c} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Opción D</label>
                                <input type="text" name="opcion_d" value={form.opcion_d} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Respuesta Correcta</label>
                                <select name="respuesta_correcta" value={form.respuesta_correcta} onChange={handleChange}>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Nivel de Dificultad</label>
                                <select name="nivel_dificultad" value={form.nivel_dificultad} onChange={handleChange}>
                                    <option value="facil">Fácil</option>
                                    <option value="medio">Medio</option>
                                    <option value="dificil">Difícil</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Agregar Pregunta'}
                            </button>
                        </form>
                    </div>

                    <div className="preguntas-lista">
                        <h3>Banco de Preguntas ({preguntas.length})</h3>
                        {preguntas.length === 0 && <p className="no-faltas">Aún no hay preguntas registradas.</p>}
                        {preguntas.map((p) => (
                            <div key={p.id_pregunta} className="pregunta-row">
                                <div className="pregunta-row-info">
                                    <span className="pregunta-row-texto">{p.texto_pregunta}</span>
                                    <span className="pregunta-row-meta">
                                        <span className={`categoria-chip ${p.categoria}`}>{p.categoria}</span>
                                        <span className="pregunta-row-dificultad">{p.nivel_dificultad}</span>
                                        <span className="pregunta-row-correcta">Correcta: {p.respuesta_correcta}</span>
                                    </span>
                                </div>
                                <button
                                    className="btn-eliminar-pregunta"
                                    onClick={() => handleEliminar(p.id_pregunta)}
                                    disabled={loading}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GestionPreguntas;
