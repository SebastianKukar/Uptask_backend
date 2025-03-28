import type {Request,Response } from 'express'
import User from '../models/User'
import Project from '../models/Project'

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body
        // Encontrar el usuario por su email
        const user = await User.findOne({email}).select('id name email')
        if(!user ) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error: error.message})
        }
        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path:'team',
            select: 'id name email'
        })
        res.json(project.team)
    }


    static addUserById = async (req: Request, res: Response) => {
        const {id} = req.body
        const user = await User.findById(id).select('id')
        if(!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error: error.message})
        }
        //Verifica si el usuario ya existe en el proyecto
        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('Ese usuario ya existe en el proyecto')
            return res.status(409).json({error: error.message})
        }
        req.project.team.push(user.id)
        await req.project.save()
        res.json('Usuario Agregado Correctamente')
    }

    static removeUserById = async (req: Request, res: Response) => {
        const {userId} = req.params
        //Verifica si el usuario no existe en el proyecto
        if(!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('Ese usuario no existe en el proyecto')
            return res.status(409).json({error: error.message})
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
        await req.project.save()
        res.json('Usuario removido del proyecto')
    }


}