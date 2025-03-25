import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const userExist = await User.findOne({ email })
            if (userExist) {
                const error = new Error('Usuario Ya registrado')
                return res.status(409).json({ error: error.message })
            }
            //crea un usuario
            const user = new User(req.body)
            user.password = await hashPassword(password)
            //generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            //hash password
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExist = await Token.findOne({ token })
            if (!tokenExist) {
                const error = new Error('Token no valido')
                return res.status(401).json({ error: error.message })
            }
            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(400).json({ error: 'Hubo un Error' })
        }
    }

    static Login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }
            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                //enviar email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                await token.save()
                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un email de confirmacion')
                return res.status(401).json({ error: error.message })
            }
            //revisar password

            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Password incorrecto')
                return res.status(401).json({ error: error.message })
            }
            const token = generateJWT({ id: user.id })
            res.json(token)
        } catch (error) {
            res.status(404).json({ error: 'Hubo un error' })
        }
    }
    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }
            if (user.confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                return res.status(403).json({ error: error.message })
            }
            //generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Te reenviamos el token, revisa tu email para confirmarlo')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }
            //generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExist = await Token.findOne({ token })
            if (!tokenExist) {
                const error = new Error('Token no valido')
                return res.status(401).json({ error: error.message })
            }
            res.send('Token Valido, Define tu nuevo password')
        } catch (error) {
            res.status(400).json({ error: 'Hubo un Error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const tokenExist = await Token.findOne({ token })
            if (!tokenExist) {
                const error = new Error('Token no valido')
                return res.status(401).json({ error: error.message })
            }
            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('el password se modifico correctamente')
        } catch (error) {
            res.status(400).json({ error: 'Hubo un Error' })
        }
    }



    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }


    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body
        const UserExist = await User.findOne({ email })
        if (UserExist && UserExist.id.toString() !== req.user.id.toString()) {
            const error = new Error('Email Ya Registrado')
            return res.status(409).json({ error: error.message })
        }
        req.user.name = name
        req.user.email = email
        try {
            await req.user.save()
            res.send('Perfil actualizado Correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    static updateCurentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('Password actual incorrecto')
            return res.status(401).json({ error: error.message })
        }
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('El password se modifico correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('Password incorrecto')
            return res.status(401).json({ error: error.message })
        }
        res.send('Password correcto')
    }
}



