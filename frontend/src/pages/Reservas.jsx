import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import { getReservasRequest, createReservaRequest } from '../services/reservas.services';
import '../styles/Reservas.css';

const Reservas = () => {
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [ocupados, setOcupados] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    
    const bloques = [
        "08:00", "09:00", "10:00", "11:00", 
        "12:00", "15:00", "16:00", "17:00", "18:00"
    ];

    useEffect(() => {
        const fetchOcupados = async () => {
            try {
                const res = await getReservasRequest(fecha);
                setOcupados(res.data.map(r => r.hora));
                setSeleccionado(null); 
            } catch (error) {
                console.error("Error al cargar horarios", error);
            }
        };
        fetchOcupados();
    }, [fecha]);

    const handleConfirmar = async () => {
        if (!seleccionado) {
            return Swal.fire({
                icon: 'warning',
                title: 'Selecciona un horario',
                text: 'Debes elegir un horario antes de confirmar la reserva.',
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#3b82f6'
            });
        }

        try {
            await createReservaRequest({ fecha, hora: seleccionado });
            await Swal.fire({
                icon: 'success',
                title: 'Reserva Confirmada',
                text: `¡Reserva confirmada para el ${fecha} a las ${seleccionado}!`,
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#3b82f6'
            });
            setOcupados([...ocupados, seleccionado]);
            setSeleccionado(null);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al reservar',
                text: error.response?.data?.message || 'Ocurrió un error al crear la reserva.',
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="content-header">
                    <h1>Agendar Clase Práctica</h1>
                </header>

                <div className="reservas-container">
                    <div className="date-selector">
                        <label>Selecciona el día:</label>
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={fecha} 
                            onChange={(e) => setFecha(e.target.value)} 
                        />
                    </div>

                    <h3>Horarios Disponibles</h3>
                    <div className="schedule-grid">
                        {bloques.map(hora => {
                            const estaOcupado = ocupados.includes(hora);
                            const esSeleccionado = seleccionado === hora;

                            return (
                                <button
                                    key={hora}
                                    className={`time-block ${esSeleccionado ? 'selected' : ''}`}
                                    disabled={estaOcupado}
                                    onClick={() => setSeleccionado(hora)}
                                >
                                    <span>{hora}</span>
                                    <span className="status-text">
                                        {estaOcupado ? 'No disponible' : 'Disponible'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {seleccionado && (
                        <button className="btn-confirmar" onClick={handleConfirmar}>
                            Confirmar Reserva {seleccionado}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Reservas;