import { useState, useEffect } from 'react';
import {
    generarExamenAleatorioRequest,
    guardarRespuestasRequest,
    finalizarExamenRequest,
    obtenerResultadoRequest
} from '../services/examenteorico.service.js';
import '../styles/examenteorico.css';

const ExamenTeorico = () => {
    const [step, setStep] = useState(1);
    const [examenId, setExamenId] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null);
    const [tiempoLimite] = useState(3600);
    const [idEstudiante,setIdEstudiante] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Timer countdown
    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        handleFinalizarExamen();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

const handleIniciarExamen = async () => {
    if (!idEstudiante) {
        setError('Debes ingresar tu ID de estudiante');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const response = await generarExamenAleatorioRequest(
            parseInt(idEstudiante),  // ← Convierte a número
            tiempoLimite
        );
        setExamenId(response.data.id_examen);
        setPreguntas(response.data.preguntas);
        setTimer(tiempoLimite);
        setStep(2);
    } catch (err) {
        setError('Error al iniciar el examen: ' + (err.response?.data?.message || err.message));
    } finally {
        setLoading(false);
    }
};

    const handleSeleccionarRespuesta = (id_pregunta, respuesta_dada) => {
        setRespuestas({
            ...respuestas,
            [id_pregunta]: respuesta_dada
        });
    };

    const handleSiguientePregunta = () => {
        if (currentQuestionIndex < preguntas.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreguntaAnterior = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFinalizarExamen = async () => {
        setLoading(true);
        setError('');

        try {
            const respuestasArray = preguntas.map(p => ({
                id_pregunta: p.id_pregunta,
                respuesta_dada: respuestas[p.id_pregunta] || null
            }));

            await guardarRespuestasRequest(examenId, respuestasArray);
            await finalizarExamenRequest(examenId);

            const resultResponse = await obtenerResultadoRequest(examenId);
            setResultado(resultResponse.data);
            setStep(3);
        } catch (err) {
            setError('Error al finalizar el examen: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const formatearTiempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="examen-teorico-container">
            <h1>Examen Teórico</h1>
            {error && <div className="error-message">{error}</div>}

            {step === 1 && (
    <div className="examen-inicio">
        <h2>Iniciar Examen Teórico</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); handleIniciarExamen(); }}>
            <div className="form-group">
                <label>ID Estudiante</label>
                <input
                    type="number"
                    value={idEstudiante}
                    onChange={(e) => setIdEstudiante(e.target.value)}
                    required
                    placeholder="Ej: 1"
                    min="1"
                />
            </div>

            <div className="info-box">
                <p><strong>Tiempo límite:</strong> 1 hora</p>
                <p><strong>Instrucciones:</strong></p>
                <ul>
                    <li>Responde todas las preguntas</li>
                    <li>El examen se auto-finalizará cuando se acabe el tiempo</li>
                    <li>No puedes volver a entrar una vez finalizado</li>
                </ul>
            </div>
            
            <button type="submit" disabled={loading} className="btn-iniciar">
                {loading ? 'Iniciando...' : 'Iniciar Examen'}
            </button>
        </form>
    </div>
)}

            {step === 2 && preguntas.length > 0 && (
                <div className="examen-responder">
                    <div className="examen-header">
                        <div className="timer" style={{ color: timer < 300 ? '#e74c3c' : '#3498db' }}>
                            ⏱️ {formatearTiempo(timer)}
                        </div>
                        <div className="progreso">
                            Pregunta {currentQuestionIndex + 1} de {preguntas.length}
                        </div>
                    </div>

                    {preguntas[currentQuestionIndex] && (
    <div className="pregunta-card">
        <h3>{preguntas[currentQuestionIndex].texto_pregunta}</h3>

        <div className="opciones">
            {['opcion_a', 'opcion_b', 'opcion_c', 'opcion_d'].map((clave, idx) => (
                <label key={idx} className="opcion">
                    <input
                        type="radio"
                        name={`pregunta_${preguntas[currentQuestionIndex].id_pregunta}`}
                        value={preguntas[currentQuestionIndex][clave]}
                        checked={respuestas[preguntas[currentQuestionIndex].id_pregunta] === preguntas[currentQuestionIndex][clave]}
                        onChange={() => handleSeleccionarRespuesta(preguntas[currentQuestionIndex].id_pregunta, preguntas[currentQuestionIndex][clave])}
                    />
                    <span className="opcion-text">{preguntas[currentQuestionIndex][clave]}</span>
                </label>
            ))}
        </div>
    </div>
)}

                    <div className="navegacion-preguntas">
                        <button 
                            onClick={handlePreguntaAnterior} 
                            disabled={currentQuestionIndex === 0}
                            className="btn-nav"
                        >
                            ← Anterior
                        </button>

                        <button 
                            onClick={handleSiguientePregunta} 
                            disabled={currentQuestionIndex === preguntas.length - 1}
                            className="btn-nav"
                        >
                            Siguiente →
                        </button>
                    </div>

                    <button 
                        onClick={handleFinalizarExamen} 
                        disabled={loading}
                        className="btn-finalizar"
                    >
                        {loading ? 'Finalizando...' : 'Finalizar Examen'}
                    </button>
                </div>
            )}

            {step === 3 && resultado && (
                <div className="examen-resultados">
                    <h2>Resultados del Examen</h2>

                    <div className="resultado-header">
                        <div className={`score-badge ${resultado.puntaje >= 60 ? 'aprobado' : 'reprobado'}`}>
                            <span className="score-value">{resultado.puntaje}%</span>
                            <span className="score-label">{resultado.puntaje >= 60 ? 'APROBADO' : 'REPROBADO'}</span>
                        </div>
                    </div>

                    <div className="resultado-stats">
                        <div className="stat-item">
                            <span className="stat-label">Respuestas Correctas</span>
                            <span className="stat-value">{resultado.respuestas_correctas || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Respuestas Incorrectas</span>
                            <span className="stat-value">{resultado.respuestas_incorrectas || 0}</span>
                        </div>
                    </div>

                    {resultado.retroalimentacion && (
                        <div className="retroalimentacion">
                            <h3>Retroalimentación</h3>
                            <p>{resultado.retroalimentacion}</p>
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            setStep(1);
                            setExamenId(null);
                            setPreguntas([]);
                            setRespuestas({});
                            setTimer(0);
                            setResultado(null);
                            setCurrentQuestionIndex(0);
                        }}
                        className="btn-nuevo-examen"
                    >
                        Realizar Nuevo Examen
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExamenTeorico;