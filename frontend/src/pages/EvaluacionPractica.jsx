import {useState} from "react";
import {
    crearEvaluacionRequest,
    registrarFaltaRequest,
    finalizarEvaluacionRequest,
} from "../services/evaluacionpractica.service.js";
import "../styles/EvaluacionPractica.css";

const EvaluacionPractica = () => {
    const [step,setStep]=useState(1); //1crear 2registrar falta 3 finalizar
    const [evaluacionId,setEvaluacionId]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState('');
    const [evaluacionData,setEvaluacionData]=useState({
        id_estudiante:"",
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
    { nombre: 'No ceder paso', critica: false },
    { nombre: 'No respetar semáforo', critica: true },
    { nombre: 'Exceso de velocidad', critica: false },
    { nombre: 'Manejo peligroso', critica: true },
    { nombre: 'Mala posición de manos', critica: false },
    { nombre: 'No usar cinturón', critica: true }
];

const handleCrearEvaluacion=async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');

    try{
        const response=await crearEvaluacionRequest(evaluacionData);
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

    //validacion de 1 falta
    if(faltas.length===0){
        setError('Debe registrar al menos una falta antes de finalizar');
        return;
    }

    setLoading(true);
    setError('');

    //calculo de puntaje obtenido
    try{
        const puntaje=faltaCritica ? 0:100-(faltas.length*5);
        const estadoFinal=puntaje>=60 ? 'Aprobado' : 'Reprobado';
        const obs=faltaCritica
         ? `Evaluación reprobada por falta crítica. Total faltas: ${faltas.length}`
         : `Evaluación completada. Total faltas: ${faltas.length}. Puntaje: ${puntaje}`;

         await finalizarEvaluacionRequest(evaluacionId, {puntaje_obtenido: puntaje, observaciones: obs});

         //guardar en estado
         setPuntajeObtenido(puntaje);
         setObservaciones(obs);
         setStep(3); //mostrar resultados
     }catch (err){
        setError('Error al finalizar la evaluación: '+(err.response?.data?.message || err.message));
     }finally{
        setLoading(false);
    }
};

    return(
    <div className="evaluacion-practica-container">
        <h1>Evaluacion Practica</h1>
        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
            <div className="evaluacion-form">
                <h2>Iniciar Nueva Evaluación</h2>
                <form onSubmit={handleCrearEvaluacion}>
                    <div className="form-group">
                        <label>ID Estudiante</label>
                        <input
                            type="number"
                            value={evaluacionData.id_estudiante}
                            onChange={(e) => setEvaluacionData({...evaluacionData, id_estudiante: e.target.value})}
                            required
                            placeholder="Ej: 1"
                        />
                    </div>

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

                    <button type="submit" disabled={loading || faltaCritica}>
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
);
};

export default EvaluacionPractica;