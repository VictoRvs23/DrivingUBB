import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getClasesAsignacionesRequest, guardarAsignacionRequest } from '../services/clasespracticas.services';
import { getUsersRequest } from '../services/user.services';
import { getVehiculosRequest } from '../services/vehiculo.services';
import Swal from 'sweetalert2'; 
import { FiSave } from "react-icons/fi"; 
import { AiOutlineUsergroupAdd } from "react-icons/ai"; 
import '../styles/User.css';           
import '../styles/AsignacionPage.css';

function AsignacionPage() {
  const [clases, setClases] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarModulo = async () => {
      try {
        const [clasesRes, usuariosRes, vehiculosRes] = await Promise.all([
          getClasesAsignacionesRequest(),
          getUsersRequest(),
          getVehiculosRequest()
        ]);

        setClases(clasesRes.data);
        setInstructores(usuariosRes.data.filter(u => u.role === 'instructor'));
        setVehiculos(vehiculosRes.data.filter(v => v.estado === 'Disponible' || v.estado === 'En Ruta'));
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del módulo:", error);
        Swal.fire('Error', 'No se pudieron recuperar las asignaciones.', 'error');
        setLoading(false);
      }
    };
    cargarModulo();
  }, []);

  const handleSelectChange = (claseId, campo, valor) => {
    setClases(prevClases => 
      prevClases.map(clase => 
        clase.id === claseId ? { ...clase, [campo]: valor } : clase
      )
    );
  };

  const handleGuardarAsignacion = async (clase) => {
    const instructorId = clase.instructorId !== undefined ? clase.instructorId : clase.instructor?.id;
    const vehiculoId = clase.vehiculoId !== undefined ? clase.vehiculoId : clase.vehiculo?.id;

    if (!instructorId || !vehiculoId) {
      return Swal.fire('Campos requeridos', 'Debes asignar un instructor y un vehículo antes de guardar.', 'warning');
    }

    try {
      await guardarAsignacionRequest(clase.id, { instructorId, vehiculoId });
      Swal.fire('Guardado', 'Los recursos se asignaron de forma correcta.', 'success');
      setClases(prev => prev.map(c => c.id === clase.id ? { ...c, estado: 'Confirmada' } : c));
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la asignación.', 'error');
    }
  };

  const formatearFecha = (fechaDb) => {
    if (!fechaDb) return "Sin fecha";
    const fecha = new Date(fechaDb);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
           " - " + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + " hrs";
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="users-page">
        <div className="users-header">
          <h1>
            <AiOutlineUsergroupAdd className="title-icon" /> Asignación de Clases Prácticas
          </h1>
        </div>

        {loading ? (
          <p style={{ color: '#1a2639', fontWeight: 'bold' }}>Cargando agenda de la escuela...</p>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Estudiante</th>
                  <th>Clase / Tema</th>
                  <th>Instructor Responsable</th>
                  <th>Vehículo Asignado</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clases.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No hay registros de clases reservadas.</td>
                  </tr>
                ) : (
                  clases.map((clase) => {
                    const selectInstructor = clase.instructorId !== undefined ? clase.instructorId : (clase.instructor?.id || "");
                    const selectVehiculo = clase.vehiculoId !== undefined ? clase.vehiculoId : (clase.vehiculo?.id || "");

                    return (
                      <tr key={clase.id}>
                        <td><strong>{formatearFecha(clase.fecha_hora)}</strong></td>
                        <td>
                          <strong>{clase.user?.nombre || "No definido"}</strong>
                          <br/><small style={{ color: '#94a3b8' }}>{clase.user?.email}</small>
                        </td>
                        <td>{clase.tema} <br/><small style={{ color: '#94a3b8' }}>Clase N°{clase.numero_clase}</small></td>
                        <td>
                          <select 
                            className="select-asignacion"
                            value={selectInstructor}
                            onChange={(e) => handleSelectChange(clase.id, 'instructorId', e.target.value)}
                          >
                            <option value="">-- Seleccionar Instructor --</option>
                            {instructores.map(inst => (
                              <option key={inst.id} value={inst.id}>{inst.nombre}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select 
                            className="select-asignacion"
                            value={selectVehiculo}
                            onChange={(e) => handleSelectChange(clase.id, 'vehiculoId', e.target.value)}
                          >
                            <option value="">-- Seleccionar Vehículo --</option>
                            {vehiculos.map(veh => (
                              <option key={veh.id} value={veh.id}>Móvil N°{veh.numeroMovil} ({veh.patente})</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <span className={`status-tag ${clase.estado?.toLowerCase() === 'pendiente' ? 'inactivo' : 'activo'}`}>
                            {clase.estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-guardar-asignacion"
                            onClick={() => handleGuardarAsignacion(clase)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                          >
                            <FiSave size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignacionPage;