import { AppDataSource } from "../config/configDb.js";
import { ClaseTeorica } from "../entities/claseteorica.entity.js";

export async function getclasesteoricas(req, res) {
    try{    //obtiene el repo
    const claseRepository=AppDataSource.getRepository(ClaseTeorica);
    //busca todas las clases
    const clases=await claseRepository.find({
        order:{fecha_hora:"ASC"}//fecha
    });
    //error 200
    res.status(200).json(clases);
    }catch (error){
        res.status(500).json({message:"Error al buscar todas las clases teoricas"});

    }
}

export async function getclaseteoricaporid(req, res) {
    try{//buscar una clase por id
        const {id}=req.params;
        //obtener el repo
        const claseRepository=AppDataSource.getRepository(ClaseTeorica);
        //buscar clase por id
        const clase=await claseRepository.findOneBy({id_clase: parseInt(id)});
        //clase no existente
        if(!clase){
            return res.status(404).json({message:"Clase teorica no encontrada"});
        }
        //clase existente
        res.status(200).json(clase);
    }catch (error){
        res.status(500).json({message:"Error al buscar la clase teorica por id"});
    }
}
export async function crearclase(req, res) {
    //crear clase(solo admin/profe)
    //tomar datos del body
    try{
        const{titulo_clase,fecha_hora,id_profesor,enlace_videollamada}=req.body;
        //validar campos
        if(!titulo_clase || !fecha_hora || !id_profesor || !enlace_videollamada){
            return res.status(400).json({message:"Faltan campos obligatorios"});
        }

        //obtener el repo
        const claseRepository=AppDataSource.getRepository(ClaseTeorica);
        //crear nueva clase
        const nuevaClase=claseRepository.create({
            titulo_clase,
            fecha_hora,
            id_profesor,
            enlace_videollamada,
            estado_clase:"programada"
        });
        //guardar la clase nueva en la base de datos
        await claseRepository.save(nuevaClase);
        //retornar error 201
        res.status(201).json(nuevaClase);
    }catch (error){
        res.status(500).json({message:"Error al crear la clase teorica"});
    }
}
export async function actualizarclase(req, res) {
    //actualizar clase ya existente(solo admin/profe)
}
export async function eliminarclase(req, res) {
    //eliminar clase(solo admin/profe)
}
export async function verificarclase(req, res) {
    //si se intenta unir a una clase que aun no empieza, manda mensaje de "la clase comienza en X minutos"
    //determina si se habilita la opcion de unirse
}
