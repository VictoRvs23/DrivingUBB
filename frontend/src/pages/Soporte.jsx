import React, { useState } from 'react';
import { AiOutlineQuestionCircle, AiOutlineWarning, AiOutlineBulb, AiOutlineFileText } from 'react-icons/ai';
import { MdOutlineSupportAgent } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import SoporteFormModal from '../components/soporte/SoporteFormModal';
import MisSolicitudes from '../components/soporte/MisSolicitudes';
import PreguntasFrecuentes from '../components/soporte/PreguntasFrecuentes';
import '../styles/Soporte.css';

const CATEGORIAS = [
    { tipo: 'Duda',       label: 'Dudas / Consultas', Icon: AiOutlineQuestionCircle },
    { tipo: 'Error',      label: 'Reporte de Error',  Icon: AiOutlineWarning },
    { tipo: 'Reclamo',    label: 'Reclamos',          Icon: AiOutlineFileText },
    { tipo: 'Sugerencia', label: 'Sugerencias',       Icon: AiOutlineBulb },
];

const Soporte = () => {
    const [modalTipo, setModalTipo]           = useState(null);
    const [verSolicitudes, setVerSolicitudes] = useState(false);
    const [verFAQs, setVerFAQs]               = useState(false);

    if (verSolicitudes) {
        return <MisSolicitudes onVolver={() => setVerSolicitudes(false)} />;
    }

    if (verFAQs) {
        return <PreguntasFrecuentes onVolver={() => setVerFAQs(false)} />;
    }

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page soporte-page">

                {/* Header */}
                <div className="vehiculos-header">
                    <h1>
                        <MdOutlineSupportAgent className="title-icon" style={{ fontSize: '2.2rem' }} />
                        Soporte
                    </h1>
                </div>

                {/* Card de categorías */}
                <div className="soporte-main-card">
                    <p className="soporte-pregunta">¿En qué te podemos ayudar?</p>
                    <div className="soporte-categorias">
                        {CATEGORIAS.map(({ tipo, label, Icon }) => (
                            <button
                                key={tipo}
                                className="soporte-cat-btn"
                                onClick={() => setModalTipo(tipo)}
                            >
                                <Icon className="soporte-cat-icon" />
                                <span className="soporte-cat-label">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Botones de acciones */}
                <div className="soporte-acciones">
                    <button
                        className="soporte-accion-btn"
                        onClick={() => setVerSolicitudes(true)}
                    >
                        <AiOutlineFileText style={{ fontSize: '1.2rem' }} />
                        Mis Solicitudes
                    </button>
                    <button
                        className="soporte-accion-btn soporte-accion-btn--secondary"
                        onClick={() => setVerFAQs(true)}
                    >
                        <AiOutlineQuestionCircle style={{ fontSize: '1.2rem' }} />
                        Preguntas Frecuentes
                    </button>
                </div>

                {/* Redes sociales eliminadas según solicitud */}
            </div>

            {/* Modal de formulario */}
            {modalTipo && (
                <SoporteFormModal
                    tipo={modalTipo}
                    onClose={() => setModalTipo(null)}
                />
            )}
        </div>
    );
};

export default Soporte;
