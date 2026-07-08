import React from 'react';
import { forwardRef } from 'react';
import LogoUBB from '../assets/LogDrivingUBB.png';
import Liston from '../assets/LISTON.png'; 

const CertificadoPDF = forwardRef(({ alumno, fecha, nota }, ref) => {
    return (
       <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
            <div 
                ref={ref} 
                style={{
                    width: '1123px',
                    height: '794px',
                    backgroundColor: '#1a2639', 
                    padding: '20px',
                    boxSizing: 'border-box',
                    fontFamily: 'serif',
                    color: '#f1f5f9'
                }}
            >
                <div style={{
                    border: '4px solid #3b82f6',
                    height: '100%',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <img src={LogoUBB} alt="Logo" style={{ width: '120px', marginBottom: '20px' }} />
                    
                    <h1 style={{ fontSize: '4rem', margin: '0', color: '#fff', textTransform: 'uppercase', letterSpacing: '4px' }}>CERTIFICADO</h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '40px', color: '#94a3b8' }}>Este certificado se otorga a</p>
                    
                    <div style={{ borderBottom: '2px solid #3b82f6', width: '600px', paddingBottom: '10px', fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                        {alumno.nombre}
                    </div>

                    <p style={{ marginTop: '50px', fontSize: '1.2rem', color: '#94a3b8' }}>
                        En reconocimiento por su aprobación en la escuela de manejo
                    </p>

                    <div style={{ display: 'flex', width: '80%', marginTop: '100px', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderTop: '1px solid #f1f5f9', width: '200px', paddingTop: '10px' }}>Secretaria</div>
                            <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Firma</div>
                        </div>
            
                        <div style={{ 
                        position: 'relative', 
                        width: '100px', 
                        height: '100px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <img 
                            src={Liston} 
                            alt="Listón" 
                            style={{ 
                                position: 'absolute', 
                                width: '110px',
                                top: '-5px', 
                                left: '-15px' 
                            }} 
                        />
                    </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderTop: '1px solid #f1f5f9', width: '200px', paddingTop: '10px' }}>Instructor</div>
                            <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Firma</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificadoPDF;