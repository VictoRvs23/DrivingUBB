import React from 'react';
import { forwardRef } from 'react';

const CertificadoPDF = forwardRef(({ alumno, fecha, nota }, ref) => {
    return (
        <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
            
            <div 
                ref={ref} 
                style={{
                    width: '1123px',
                    height: '794px',
                    backgroundColor: '#ffffff',
                    padding: '40px',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif',
                    color: '#1a2639'
                }}
            >
                <div style={{
                    border: '10px solid #1e293b',
                    height: '100%',
                    padding: '40px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <h2 style={{ color: '#3b82f6', letterSpacing: '2px' }}>ESCUELA DE CONDUCTORES DRIVINGUBB</h2>
                    
                    <div style={{ marginTop: '80px', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '3.5rem', margin: '0' }}>CERTIFICADO DE APROBACIÓN</h1>
                    </div>
                    
                    <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Se otorga el presente documento a:</p>
                    
                    <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', borderBottom: '2px solid #94a3b8', display: 'inline-block', paddingBottom: '10px' }}>
                        {alumno.nombre}
                    </h2>
                    
                    <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>RUT: {alumno.run}</p>
                    
                    <p style={{ fontSize: '1.2rem', marginTop: '40px', lineHeight: '1.6', padding: '0 50px' }}>
                        Por haber completado y aprobado satisfactoriamente los módulos teóricos y prácticos del curso de conducción Clase B, obteniendo una calificación final de <strong>{nota}</strong>.
                    </p>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-around', 
                        marginTop: '100px',
                        padding: '0 100px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ borderTop: '2px solid #1a2639', width: '200px', paddingTop: '10px' }}>Director Académico</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ borderTop: '2px solid #1a2639', width: '200px', paddingTop: '10px' }}>Fecha de Emisión<br/>{fecha}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificadoPDF;