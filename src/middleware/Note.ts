import type {Request,Response,NextFunction} from 'express'
import Task from '../models/Task';

export async function taskExist(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId)
        if(!task) {
         const error = new Error('Tarea no encontrada')
         res.status(404).json({error:error.message})
         return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export function taskBelongToProject(req:Request, res: Response, next: NextFunction) {
    if(req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Accion no valida')
        res.status(403).json({error: error.message})
        return
    }
    next()
}
