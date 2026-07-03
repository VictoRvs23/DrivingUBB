import {useState} from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/useAuth";
import {
    crearEvaluacionRequest,
    registrarFaltaRequest,
    finalizarEvaluacionRequest,
} from "../services/evaluacionpractica.service.js";
import "../styles/EvaluacionPractica.css";
import "../styles/Home.css";

const EvaluacionPractica = () => {
    const { user } = useAuth(); // ✅ Traer datos del usuario autenticado
    const [step,setStep]=useState(1);
    const [evaluacionId,setEvaluacionId]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState('');
    const [evaluacionData,setEvaluacionData]=useState({
        id_estudiante: user?.id || "", // ✅ Automático del usuario
        id_instructor:"",
        fecha_evaluacion:"",
    });
    const [faltaData, setFaltaData] = useState({
    nombre_falta: '',
    es_critica: false
});
const [faltas, setFaltas] = useState([]);
const [faltaCritica, setFaltaCritica] = useState(false);
const [puntajeObtenido, setPuntajeObtenido] = useState(null);
const [observaciones,setObservaciones]=useState('');

const tiposFaltas = [
    //faltas criticas
    {nombre: 'No respetar semáforo', critica: true, peso: 30},
    {nombre: 'Manejo peligroso', critica: true, peso: 25},
    {nombre: 'No usar cinturon', critica: true, peso: 20},

    //faltas graves
    { nombre: 'No ceder paso', critica: false, peso: 20 },
    { nombre: 'Exceso de velocidad', critica: false, peso: 15 },
    { nombre: 'No usar espejo', critica: false, peso: 12 },
    { nombre: 'Cambio de carril sin señalizar', critica: false, peso: 15 },

    //faltas leves
    { nombre: 'Mala posición de manos', critica: false, peso: 5 },
    { nombre: 'Velocidad insuficiente', critica: false, peso: 8 },
    { nombre: 'Mala posición de asiento', critica: false, peso: 3 },
    { nombre: 'Falta de concentración', critica: false, peso: 6 },
    { nombre: 'No apagar intermitente', critica: false, peso: 2 }
];

const handleCrearEvaluacion=async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');

    try{
        const payload = {
            ...evaluacionData,
            id_estudiante: user?.id || "",
        };

        const response=await crearEvaluacionRequest(payload);
        const newId=response.data.id_evaluacion;
        setEvaluacionId(newId);
        setStep(2); //paso2
    }catch (err){
        setError('Error al crear la evaluación: '+(err.response?.data?.message || err.message));
    }finally{
        setLoading(false);
    }
};

const handleRegistrarFalta=async(e)=>{
    e.preventDefault();

    if(!faltaData.nombre_falta){
        setError('Seleccione una falta');
        return;
    }

    setLoading(true);
    setError('');

    try{
        await registrarFaltaRequest(evaluacionId, faltaData);
        setFaltas([...faltas,faltaData]);
        if(faltaData.es_critica){
            setFaltaCritica(true);
        }

        setFaltaData({nombre_falta:'', es_critica:false});
    }catch (err){
        setError('Error al registrar la falta: '+(err.response?.data?.message || err.message));
    }finally{
        setLoading(false);
    }
};

const handleFinalizarEvaluacion=async(e)=>{
    e.preventDefault();

    setLoading(true);
    setError('');

    //calculo de puntaje obtenido con pesos
    try{
        // Calcular puntaje restando pesos de faltas
        let puntajeCalculado = 100;
        let tieneFaltaCritica = false;
        
        faltas.forEach(falta => {
            const faltaConfig = tiposFaltas.find(f => f.nombre === falta.nombre_falta);
            if(faltaConfig) {
                puntajeCalculado -= faltaConfig.peso;
            }
            if(falta.es_critica) {
                tieneFaltaCritica = true;
            }
        });

        // Asegurar que el puntaje no sea negativo
        puntajeCalculado = Math.max(0, puntajeCalculado);
                
        let obs = '';
        if(faltas.length === 0) {
            obs = 'Evaluación perfecta. Sin faltas registradas. Puntaje: 100';
        } else if(tieneFaltaCritica) {
            obs = `Evaluación reprobada por falta crítica. Total faltas: ${faltas.length}. Puntaje: ${puntajeCalculado}`;
        } else {
            obs = `Evaluación completada. Total faltas: ${faltas.length}. Puntaje: ${puntajeCalculado}`;
        }

         await finalizarEvaluacionRequest(evaluacionId, {puntaje_obtenido: puntajeCalculado, observaciones: obs});

         //guardar en estado
         setPuntajeObtenido(puntajeCalculado);
         setObservaciones(obs);
         setStep(3); //mostrar resultados
     }catch (err){
        setError('Error al finalizar la evaluación: '+(err.response?.data?.message || err.message));
     }finally{
        setLoading(false);
    }
};

    return(
    <div className="dashboard-layout">
    <Sidebar />
    <main className="main-content">
        <header className="content-header">
            <h1>Evaluacion Practica</h1>
        </header>
    <div className="evaluacion-practica-container">
        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
            <div className="evaluacion-form">
                <h2>Iniciar Nueva Evaluación</h2>
                
                {/* Resumen del estudiante */}
                <div className="estudiante-info">
                    <p><strong>Estudiante:</strong> {user?.nombre || 'Usuario'}</p>
                    <p><strong>ID:</strong> {user?.id}</p>
                </div>

                <form onSubmit={handleCrearEvaluacion}>
                    <div className="form-group">
                        <label>ID Instructor</label>
                        <input
                            type="number"
                            value={evaluacionData.id_instructor}
                            onChange={(e) => setEvaluacionData({...evaluacionData, id_instructor: e.target.value})}
                            required
                            placeholder="Ej: 1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha Evaluación</label>
                        <input
                            type="datetime-local"
                            value={evaluacionData.fecha_evaluacion}
                            onChange={(e) => setEvaluacionData({...evaluacionData, fecha_evaluacion: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Iniciar Evaluación'}
                    </button>
                </form>
            </div>
        )}
        {step === 2 && (
            <div className="evaluacion-faltas">
                <h2>Registrar Faltas - Evaluacion #{evaluacionId}</h2>

                {faltaCritica && (
                    <div className="warning-message">
                        FALTA CRITICA DETECTADA - Evaluacion reprobada automaticamente
                    </div>
                )}

                <form onSubmit={handleRegistrarFalta}>
                    <div className="form-group">
                        <label>Tipo de Falta</label>
                        <select
                            value={faltaData.nombre_falta}
                            onChange={(e) => {
                                const faltaSeleccionada = tiposFaltas.find(f => f.nombre === e.target.value);
                                setFaltaData({
                                    nombre_falta: e.target.value,
                                    es_critica: faltaSeleccionada?.critica || false
                                });
                            }}
                            required
                        >
                            <option value="">-- Seleccionar falta --</option>
                            {tiposFaltas.map((falta, idx) => (
                                <option key={idx} value={falta.nombre}>
                                    {falta.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar Falta'}
                    </button>
                </form>

                <div className="faltas-list">
                    <h3>Faltas Registradas ({faltas.length})</h3>
                    {faltas.map((falta, idx) => (
                        <li key={idx}>{falta.nombre_falta}</li>
                    ))}
                </div>

                <button 
                    onClick={handleFinalizarEvaluacion}
                    disabled={loading}
                    className="btn-finalizar"
                >
                    {loading ? 'Finalizando...' : 'Finalizar Evaluacion'}
                </button>
            </div>
        )}

        {step === 3 && (
    <div className="evaluacion-resultados">
        <h2>Resultados de Evaluación</h2>
        
        <div className="resultado-header">
    <div className="score-badge-eval" style={{
        background: puntajeObtenido >= 60 
            ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' 
            : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
        border: puntajeObtenido >= 60 ? '3px solid #27ae60' : '3px solid #e74c3c'
    }}>
        <span className="score-value-eval">{puntajeObtenido}%</span>
        <span className="score-label-eval">
            {puntajeObtenido >= 60 ? 'APROBADO' : 'REPROBADO'}
        </span>
    </div>
</div>

        <div className="resultado-stats">
            <div className="stat-box">
                <span className="stat-label">Puntaje Obtenido</span>
                <span className={`stat-value ${puntajeObtenido >= 60 ? 'green' : 'red'}`}>
                    {puntajeObtenido}/100
                </span>
            </div>
            <div className="stat-box">
                <span className="stat-label">Total Faltas</span>
                <span className="stat-value">{faltas.length}</span>
            </div>
            <div className="stat-box">
                <span className="stat-label">Faltas Críticas</span>
                <span className="stat-value" style={{color: faltas.filter(f => f.es_critica).length > 0 ? '#e74c3c' : '#27ae60'}}>
                    {faltas.filter(f => f.es_critica).length}
                </span>
            </div>
        </div>

        <div className="faltas-detalle">
            <h3>Detalle de Faltas Registradas</h3>
            {faltas.length > 0 ? (
                <ul>
                    {faltas.map((falta, idx) => (
                        <li key={idx} className={falta.es_critica ? 'critica' : 'normal'}>
                            <span className="falta-nombre">{falta.nombre_falta}</span>
                            <span className="falta-tipo">
                                {falta.es_critica ? '⚠️ Crítica' : '✓ Normal'}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-faltas">Sin faltas registradas</p>
            )}
        </div>

        <div className="observaciones-box">
            <h3>Observaciones</h3>
            <p>{observaciones}</p>
        </div>

        <button onClick={() => {
            setStep(1);
            setEvaluacionId(null);
            setEvaluacionData({ id_estudiante: '', id_instructor: '', fecha_evaluacion: '' });
            setFaltas([]);
            setFaltaCritica(false);
            setPuntajeObtenido(null);
            setObservaciones('');
        }} className="btn-nueva-evaluacion">
            Nueva Evaluación
        </button>
    </div>
)}
            </div>
        </main>
    </div>
);
};

export default EvaluacionPractica;