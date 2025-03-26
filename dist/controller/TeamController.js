"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        // Encontrar el usuario por su email
        const user = await User_1.default.findOne({ email }).select('id name email');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }
        res.json(user);
    };
    static getProjectTeam = async (req, res) => {
        const project = await Project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: 'id name email'
        });
        res.json(project.team);
    };
    static addUserById = async (req, res) => {
        const { id } = req.body;
        const user = await User_1.default.findById(id).select('id');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }
        //Verifica si el usuario ya existe en el proyecto
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('Ese usuario ya existe en el proyecto');
            return res.status(409).json({ error: error.message });
        }
        req.project.team.push(user.id);
        await req.project.save();
        res.json('Usuario Agregado Correctamente');
    };
    static removeUserById = async (req, res) => {
        const { userId } = req.params;
        //Verifica si el usuario no existe en el proyecto
        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('Ese usuario no existe en el proyecto');
            return res.status(409).json({ error: error.message });
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
        await req.project.save();
        res.json('Usuario removido del proyecto');
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map