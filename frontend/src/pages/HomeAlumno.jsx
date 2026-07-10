import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
    AiOutlineBook, 
    AiOutlineCar, 
    AiOutlineFileDone, 
    AiOutlineVideoCamera, 
    AiOutlineLaptop 
} from "react-icons/ai";

const HomeAlumno = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loadingData, setLoadingData] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        horasPracticas: 0,
        horasTeoricas: 0,
        examenesAprobados: 0,
        proximaActividad: null
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) {
                    setLoadingData(false);
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/dashboard/mi-resumen`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = response.data?.data || response.data || {};

                setDashboardData({
                    horasPracticas: data.horasPracticas ?? 0,
                    horasTeoricas: data.horasTeoricas ?? 0,
                    examenesAprobados: data.examenesAprobados ?? 0,
                    proximaActividad: data.proximaActividad ?? null
                });
            } catch (error) {
                console.error("Error general en la carga del dashboard:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getProgressColor = (current, total) => {
        const percentage = (current / total) * 100;
        if (percentage >= 70) return 'green';
        if (percentage >= 35) return 'yellow';
        return 'red';
    };

    const colorTeoricas = getProgressColor(dashboardData.horasTeoricas, 10);
    const colorPracticas = getProgressColor(dashboardData.horasPracticas, 12);
    const colorExamenes = getProgressColor(dashboardData.examenesAprobados, 10);

    return (
        <div className="home-content">
            <div className="welcome-bar">
                <h2>Bienvenido/a, <span>{user?.nombre || "Cargando..."}</span></h2>
                <span className="badge-proceso">Estado Curso: En Proceso</span>
            </div>

            {loadingData ? (
                <p style={{textAlign: 'center', color: '#94a3b8', padding: '50px 0'}}>Cargando tu progreso...</p>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className={`stat-icon ${colorTeoricas}`}><AiOutlineBook /></div>
                            <div className="stat-info">
                                <h3><span className={`text-${colorTeoricas}`}>{dashboardData.horasTeoricas}</span>/10 hrs</h3>
                                <p>Horas Teóricas<br/>Completadas</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className={`stat-icon ${colorPracticas}`}><AiOutlineCar /></div>
                            <div className="stat-info">
                                <h3><span className={`text-${colorPracticas}`}>{dashboardData.horasPracticas}</span>/12 hrs</h3>
                                <p>Horas Prácticas<br/>Completadas</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className={`stat-icon ${colorExamenes}`}><AiOutlineFileDone /></div>
                            <div className="stat-info">
                                <h3><span className={`text-${colorExamenes}`}>{dashboardData.examenesAprobados}</span>/10</h3>
                                <p>Exámenes simulados<br/>Aprobados</p>
                            </div>
                        </div>
                    </div>

                    <div className="activities-section">
                        <h3 className="section-title">Próxima Actividad</h3>

                        {dashboardData.proximaActividad ? (
                            <div className="activity-card">
                                <div className="activity-icon"><AiOutlineVideoCamera /></div>
                                <div className="activity-details">
                                    <h4>{dashboardData.proximaActividad.tipo}</h4>
                                    <p>{new Date(dashboardData.proximaActividad.fecha).toLocaleString()}</p>
                                </div>
                                <div className="activity-instructor">
                                    <p>Prof. {dashboardData.proximaActividad.instructor}</p>
                                </div>
                                
                                {dashboardData.proximaActividad.isTeorica && (
                                    (() => {
                                        const inicio = new Date(dashboardData.proximaActividad.fecha).getTime();
                                        const ventanaApertura = inicio - 30 * 60 * 1000; 
                                        const finDeClase = inicio + 60 * 60 * 1000;
                                        const ahora = Date.now();
                                        const disponible = ahora >= ventanaApertura && ahora <= finDeClase;
                                        const pasada = ahora > finDeClase;

                                        return (
                                            <a
                                                href={disponible ? dashboardData.proximaActividad.enlace_videollamada : undefined}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => { if (!disponible) e.preventDefault(); }}
                                                className={`btn-outline-blue ${!disponible ? 'disabled' : ''}`}
                                                title={
                                                    pasada
                                                        ? 'Esta clase ya finalizó'
                                                        : !disponible
                                                            ? 'Disponible 30 minutos antes de la clase'
                                                            : 'Ingresar a la videollamada'
                                                }
                                            >
                                                Ingresar
                                            </a>
                                        );
                                    })()
                                )}
                            </div>
                        ) : (
                            <div className="activity-card" style={{justifyContent: 'center'}}>
                                <p style={{color: '#94a3b8', margin: 0}}>No tienes clases prácticas programadas próximamente.</p>
                            </div>
                        )}

                        <div className="activity-card">
                            <div className="activity-icon"><AiOutlineLaptop /></div>
                            <div className="activity-details">
                                <h4>Simulador Examen Teórico</h4>
                                <p>Disponible 24/7</p>
                            </div>
                            <div className="activity-instructor">
                                <p>Autoestudio</p>
                            </div>
                            <button className="btn-action-secondary" onClick={() => navigate('/examenteorico')}>Iniciar</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeAlumno;