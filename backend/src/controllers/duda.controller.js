import { AppDataSource } from "../config/configDb.js";
import { Duda } from "../entities/duda.entity.js";

const dudaRepo = AppDataSource.getRepository(Duda);

export const createDuda = async (req, res) => {
    try {
        const nuevaDuda = dudaRepo.create({ ...req.body, usuario: { id: req.user.id } });
        await dudaRepo.save(nuevaDuda);
        res.status(201).json({ message: "Duda enviada", data: nuevaDuda });
    } catch (error) { res.status(500).json({ message: "Error al crear" }); }
};

export const getMisDudas = async (req, res) => {
    const dudas = await dudaRepo.find({ where: { usuario: { id: req.user.id } }, order: { created_at: "DESC" } });
    res.json(dudas);
};

export const getAllDudas = async (req, res) => {
    const dudas = await dudaRepo.find({ relations: ["usuario"], order: { created_at: "DESC" } });
    res.json(dudas);
};

export const responderDuda = async (req, res) => {
    const { id } = req.params;
    const { respuesta_admin } = req.body;
    await dudaRepo.update(id, { respuesta_admin, estado: "respondido" });
    res.json({ message: "Respuesta enviada" });
};

export const deleteDuda = async (req, res) => {
    await dudaRepo.delete(req.params.id);
    res.json({ message: "Duda eliminada" });
};