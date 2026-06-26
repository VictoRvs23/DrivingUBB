import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    generarExamenAleatorioRequest,
    guardarRespuestasRequest,
    finalizarExamenRequest,
    obtenerResultadoRequest
} from '../services/examenteorico.service.js';
import '../styles/examenteorico.css';

const ExamenTeorico = () => {
    const { user } = useAuth(); // ✅ Traer datos del usuario autenticado
    const [step, setStep] = useState(1);
    const [examenId, setExamenId] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null);
    const [tiempoLimite] = useState(3600);
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
    if (!user?.id) {
        setError('No se pudo identificar al estudiante');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const response = await generarExamenAleatorioRequest(
            user.id,  // ✅ Automático del usuario autenticado
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
            const respuestasArray=preguntas.map(p=>{
                const respuestaTexto=respuestas[p.id_pregunta];
                let respuestaLetra=null;

                //convertir texto a letra
                if(respuestaTexto===p.opcion_a)respuestaLetra='A';
                else if (respuestaTexto===p.opcion_b)respuestaLetra='B';
                else if (respuestaTexto===p.opcion_c)respuestaLetra='C';
                else if (respuestaTexto===p.opcion_d)respuestaLetra='D';

                return{
                    id_pregunta: p.id_pregunta,
                    respuesta_dada:respuestaLetra
                }
            });


            await guardarRespuestasRequest(examenId, respuestasArray);
            await finalizarExamenRequest(examenId);

            const resultResponse = await obtenerResultadoRequest(examenId);
            console.log('DATA DEL SERVIDOR:',resultResponse.data);
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
        
        {/* Resumen del estudiante */}
        <div className="estudiante-info">
            <p><strong>Estudiante:</strong> {user?.nombre || 'Usuario'}</p>
            <p><strong>ID:</strong> {user?.id}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleIniciarExamen(); }}>
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

{resultado.preguntas_incorrectas && resultado.preguntas_incorrectas.length > 0 && (
    <div className="retroalimentacion">
        <h3>Detalle de Respuestas Incorrectas ({resultado.respuestas_incorrectas})</h3>
        {resultado.preguntas_incorrectas.map((pregunta, idx) => (
            <div key={idx} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                <p><strong>Pregunta:</strong> {pregunta.texto}</p>
                <p><strong>Tu respuesta:</strong> <span style={{color: '#dc3545'}}>{pregunta.respuesta_dada}</span></p>
                <p><strong>Respuesta correcta:</strong> <span style={{color: '#28a745'}}>{pregunta.respuesta_correcta}</span></p>
            </div>
        ))}
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