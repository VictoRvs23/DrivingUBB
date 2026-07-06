import React from 'react';
import {
    AiOutlineQuestionCircle,
    AiOutlineWarning,
    AiOutlineBulb,
    AiOutlineFileText,
    AiOutlineUnorderedList,
} from 'react-icons/ai';

const TIPOS = [
    { valor: null,         label: 'Todos',      Icon: AiOutlineUnorderedList },
    { valor: 'Duda',       label: 'Dudas',       Icon: AiOutlineQuestionCircle },
    { valor: 'Error',      label: 'Errores',     Icon: AiOutlineWarning },
    { valor: 'Reclamo',    label: 'Reclamos',    Icon: AiOutlineFileText },
    { valor: 'Sugerencia', label: 'Sugerencias', Icon: AiOutlineBulb },
];

/**
 * Barra de filtro por tipo de soporte.
 * @param {string|null}  tipoActivo  
 * @param {Function}     onChange    
 */
const FiltroTipo = ({ tipoActivo, onChange }) => {
    return (
        <div className="filtro-tipo-bar">
            {TIPOS.map(({ valor, label, Icon }) => (
                <button
                    key={label}
                    className={`filtro-tipo-btn ${tipoActivo === valor ? 'filtro-tipo-btn--activo' : ''}`}
                    onClick={() => onChange(valor)}
                >
                    <Icon style={{ fontSize: '1.05rem' }} />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default FiltroTipo;
