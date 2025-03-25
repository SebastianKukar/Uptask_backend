import type { Request, Response, NextFunction } from "express"
import  { validationResult, body } from "express-validator"

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) : Promise<void> => {
        let errors = validationResult(req)
        if(!errors.isEmpty()) {
           res.status(400).json({errors: errors.array()})
           return;
        }
        next();
        return;
}

export const handleInputValidation = (req: Request, res: Response, next: NextFunction) : Promise<void>  => {
        const {clientName, projectName, description} = req.body
        const project = [clientName, projectName, description]
        if(project.every(parametro => parametro !== '')) {
                next()
        } else {
                const error = new Error('Todos los campos son obligatorios')
                res.status(400).json({error: error.message})
                return;
        }
}