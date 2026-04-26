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
    try{
        const {id}=req.params;//pide id
        const{titulo_clase,fecha_hora,id_profesor,enlace_videollamada,estado_clase}=req.body;//toma datos del body
        const claseRepository=AppDataSource.getRepository(ClaseTeorica);
        const clase =await claseRepository.findOneBy({id_clase: parseInt(id)});//busca clase por id
        //validar que existe
        if(!clase){
            return res.status(404).json({message:"Clase no encontrada"});
        }
        //actualizar campos
        if(titulo_clase) clase.titulo_clase=titulo_clase;
        if(fecha_hora) clase.fecha_hora=fecha_hora;
        if(id_profesor) clase.id_profesor=id_profesor;
        if(enlace_videollamada) clase.enlace_videollamada=enlace_videollamada;
        if(estado_clase) clase.estado_clase=estado_clase;

        await claseRepository.save(clase);//guardar cambios

        // 200
        res.status(200).json({message:"Clase actualizada exitosamente", clase});
    }catch (error){
        res.status(500).json({message:"Error al actualizar la clase teorica"});
    }
}
export async function eliminarclase(req, res) {
    //eliminar clase(solo admin/profe)
    try{
        const {id}=req.params;//pide id
        const claseRepository=AppDataSource.getRepository(ClaseTeorica);
        const clase =await claseRepository.findOneBy({id_clase: parseInt(id)});
        //validar que existe
        if(!clase){
            return res.status(404).json({message:"Clase no encontrada o inexistente"});
        }
        //eliminar
        await claseRepository.delete(parseInt(id));
        //retornar error 200
        res.status(200).json({message:"Clase eliminada"});
    }catch (error){
        res.status(500).json({message:"Error al eliminar la clase"});
    }
}
export async function verificarclase(req, res) {
    //si se intenta unir a una clase que aun no empieza, manda mensaje de "la clase comienza en X minutos"
    //determina si se habilita la opcion de unirse
    try{
        const {id}=req.params;//pide id
        const claseRepository=AppDataSource.getRepository(ClaseTeorica);//repositorio
        const clase =await claseRepository.findOneBy({id_clase: parseInt(id)});//clase

        //validacion
        if(!clase){
            return res.status(404).json({message:"Clase no encontrada"});
        }

        //hora actual
        const ahora=new Date();
        const fechaclase=new Date(clase.fecha_hora);

        //diferencia en minutos
        const diferencia=Math.floor((fechaclase-ahora)/1000/60);

        //disponibilidad de clase
        let unirse=false;
        let mensaje="";
        let estado="";

        //estados de la clase
        //aun sin empezar en 15 minutos
        if(diferencia>15){
            estado="programada";
            mensaje= `La clase comienza en ${diferencia} minutos`;
        }else if(diferencia>=-30){
            estado="en_curso";
            unirse=true;
            mensaje="La clase esta en curso, puedes unirte";
        }else{
            estado="finalizada";
            unirse=false;
            mensaje="La clase ha finalizado";
        }

        res.status(200).json({unirse, mensaje, estado,enlace_videollamada: unirse ? clase.enlace_videollamada : null});
    }catch (error){
        res.status(500).json({message:"Error al verificar la clase"});
    }
}
