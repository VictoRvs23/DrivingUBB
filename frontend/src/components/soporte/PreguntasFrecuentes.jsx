import React, { useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import Sidebar from '../Sidebar';
import { getFAQsRequest } from '../../services/preguntaFrecuente.services';
import '../../styles/Soporte.css';
import '../../styles/FAQ.css';

/* ── Item de acordeón ─────────────────────────── */
const FAQItem = ({ numero, pregunta, respuesta }) => {
    const [abierto, setAbierto] = useState(false);

    return (
        <div className={`faq-item ${abierto ? 'faq-item--abierto' : ''}`}>
            <button
                className="faq-item-header"
                onClick={() => setAbierto(!abierto)}
                aria-expanded={abierto}
            >
                <span className="faq-numero">{numero}.-</span>
                <span className="faq-pregunta-texto">¿{pregunta}?</span>
                <span className="faq-chevron">
                    {abierto ? <AiOutlineUp /> : <AiOutlineDown />}
                </span>
            </button>

            {abierto && (
                <div className="faq-item-body">
                    <span className="faq-respuesta-label">Respuesta:</span>
                    <p className="faq-respuesta-texto">{respuesta}</p>
                </div>
            )}
        </div>
    );
};

/* ── Componente principal ──────────────────────── */
const PreguntasFrecuentes = ({ onVolver }) => {
    const [faqs, setFaqs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await getFAQsRequest();
                setFaqs(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Error al cargar las preguntas frecuentes.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    return (
        <div className="main-container">
            <Sidebar />

            <div className="vehiculos-page">

                {/* Header */}
                <div className="vehiculos-header">
                    <h1>
                        <MdOutlineQuestionAnswer className="title-icon" style={{ fontSize: '2.2rem' }} />
                        Preguntas Frecuentes
                    </h1>
                </div>

                {/* Botón volver */}
                <button className="solicitudes-back-btn" onClick={onVolver}>
                    <AiOutlineLeft />
                    Volver a Soporte
                </button>

                {/* Contenido */}
                {loading && (
                    <div className="solicitudes-loading">Cargando preguntas frecuentes...</div>
                )}

                {!loading && error && (
                    <div className="solicitudes-empty" style={{ color: '#ef4444' }}>{error}</div>
                )}

                {!loading && !error && faqs.length === 0 && (
                    <div className="faq-lista">
                        <div className="faq-vacio">
                            <MdOutlineQuestionAnswer style={{ fontSize: '3rem', color: '#334155' }} />
                            <p>Aún no hay preguntas frecuentes disponibles.</p>
                        </div>
                    </div>
                )}

                {!loading && !error && faqs.length > 0 && (
                    <div className="faq-lista">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={faq.id}
                                numero={index + 1}
                                pregunta={faq.pregunta}
                                respuesta={faq.respuesta}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreguntasFrecuentes;
