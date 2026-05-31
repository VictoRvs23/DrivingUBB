import {useState} from "react";
import {
    crearEvaluacionRequest,
    registrarFaltaRequest,
    finalizarEvaluacionRequest,
}from "../services/evaluacionpractica.service.js";
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

    return(
        <div className="evaluacion-practica-container">
            <h1>Evaluacion Practica</h1>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default EvaluacionPractica;