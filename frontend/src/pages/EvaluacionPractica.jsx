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
    setLoading(true);
    setError('');

    try{
        const response = await finalizarEvaluacionRequest(evaluacionId, {
            puntaje_obtenido: faltaCritica ? 0 : 100 - (faltas.length * 5),
            observaciones: `Evaluación completada. Faltas registradas: ${faltas.length}`
        });
        setStep(3); //finalizado
    }catch(err){
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
                <h2>Resultados de Evaluacion</h2>
                <p>Evaluacion #{evaluacionId} finalizada</p>
                <p>Total de faltas: {faltas.length}</p>
                <p>Faltas criticas: {faltas.filter(f => f.es_critica).length}</p>

                <button onClick={() => {
                    setStep(1);
                    setEvaluacionId(null);
                    setEvaluacionData({ id_estudiante: '', id_instructor: '', fecha_evaluacion: '' });
                    setFaltas([]);
                    setFaltaCritica(false);
                }}>
                    Nueva Evaluacion
                </button>
            </div>
        )}
    </div>
);

export default EvaluacionPractica;