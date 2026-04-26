import { AppDataSource } from "../config/configDb.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";

const claseRepository = AppDataSource.getRepository(ClasePractica);

export const reservarClaseAlumno = async (req, res) => {
  try {
    const { numero_clase, tema, fecha_hora } = req.body;
    const alumnoId = req.user.id;

    const nuevaClase = claseRepository.create({
      numero_clase,
      tema,
      fecha_hora,
      alumno: { id: alumnoId },
      estado: "Pendiente"
    });

    await claseRepository.save(nuevaClase);

    return res.status(201).json({
      estado: "Éxito",
      mensaje: "Tu clase ha sido reservada. Queda a la espera de asignación de instructor y vehículo.",
      data: nuevaClase
    });
  } catch (error) {
    console.error("Error en reservarClaseAlumno:", error);
    return res.status(500).json({ estado: "Error", mensaje: "Error al procesar la reserva." });
  }
};

export const asignarRecursosAClase = async (req, res) => {
  try {
    const claseId = parseInt(req.params.id);
    const { instructor_id, vehiculo_id } = req.body;

    const claseDestino = await claseRepository.findOneBy({ id: claseId });
    
    if (!claseDestino) {
      return res.status(404).json({ estado: "Error", mensaje: "La clase no existe." });
    }

    const topeInstructor = await claseRepository.findOne({
      where: {
        instructor: { id: instructor_id },
        fecha_hora: claseDestino.fecha_hora,
        estado: "Agendada"
      }
    });

    if (topeInstructor) {
      return res.status(400).json({
        estado: "Error",
        mensaje: "El instructor seleccionado ya tiene una clase agendada en este horario."
      });
    }

    const topeVehiculo = await claseRepository.findOne({
      where: {
        vehiculo: { id: vehiculo_id },
        fecha_hora: claseDestino.fecha_hora,
        estado: "Agendada"
      }
    });

    if (topeVehiculo) {
      return res.status(400).json({
        estado: "Error",
        mensaje: "El vehículo ya está asignado a otra clase en este horario."
      });
    }

    claseDestino.instructor = { id: instructor_id };
    claseDestino.vehiculo = { id: vehiculo_id };
    claseDestino.estado = "Agendada";

    await claseRepository.save(claseDestino);

    return res.status(200).json({
      estado: "Éxito",
      mensaje: "Instructor y vehículo asignados correctamente.",
      data: claseDestino
    });

  } catch (error) {
    console.error("Error en asignarRecursosAClase:", error);
    return res.status(500).json({ estado: "Error", mensaje: "Error al asignar los recursos." });
  }
};

export const calificarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { calificacion } = req.body;

    const clase = await claseRepository.findOneBy({ id: parseInt(id) });

    if (!clase) {
      return res.status(404).json({ estado: "Error", mensaje: "Clase no encontrada." });
    }

    if (new Date(clase.fecha_hora) > new Date()) {
      return res.status(400).json({
        estado: "Error",
        mensaje: "No se puede calificar una clase que aún no ha finalizado."
      });
    }

    clase.calificacion = calificacion;
    clase.estado = "Completada";

    await claseRepository.save(clase);

    return res.status(200).json({
      estado: "Éxito",
      mensaje: "Calificación registrada correctamente.",
      nota: calificacion
    });
  } catch (error) {
    console.error("Error en calificarClase:", error);
    return res.status(500).json({ estado: "Error", mensaje: "Error al registrar la nota." });
  }
};

export const getClasesAlumno = async (req, res) => {
  try {
    const clases = await claseRepository.find({
      where: { alumno: { id: req.user.id } },
      relations: ["instructor", "vehiculo"],
      order: { fecha_hora: "ASC" }
    });
    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las clases del alumno." });
  }
};

export const getClasesInstructor = async (req, res) => {
  try {
    const clases = await claseRepository.find({
      where: { instructor: { id: req.user.id } },
      relations: ["alumno", "vehiculo"],
      order: { fecha_hora: "ASC" }
    });
    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la agenda del instructor." });
  }
};