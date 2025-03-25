import {Router} from 'express'
import {body, param} from 'express-validator'
import { AuthController } from '../controller/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { Authenthicate } from '../middleware/Auth'

const router = Router()

router.post('/create-account', 
    body('name')
    .notEmpty().withMessage('El nombre no puede estar vacio'),
    body('password')
    .isLength({min:8}).withMessage('El password tiene que ser de minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Los passwords no son iguales')
        }
        return true
    }),
    body('email')
    .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.createAccount
)
router.post('/confirm-account',
    body('token')
    .notEmpty().withMessage('El token no puede estar vacio'),
    handleInputErrors,
    AuthController.confirmAccount
)
router.post('/login', 
    body('email')
    .isEmail().withMessage('Email no valido'),
    body('password')
    .notEmpty().withMessage('El password no puede estar vacio'),
    handleInputErrors,
    AuthController.Login
)

router.post('/forgot-password', 
    body('email')
     .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
    .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
    .isNumeric()
    .withMessage('Token No valido'),
    body('password')
    .isLength({min:8}).withMessage('El password tiene que ser de minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Los passwords no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    Authenthicate,
    AuthController.user
)

/* Profile */

router.put('/profile',
    Authenthicate,
    body('name')
    .notEmpty()
    .withMessage('El nombre no puede ir vacio'),
    body('email')
    .isEmail()
    .withMessage('Email no Valido'),
    handleInputErrors,
    AuthController.updateProfile
)

router.put('/update-password',
    Authenthicate,
    body('current_password')
    .notEmpty().withMessage('El password actual no puede ir vacio'),
    body('password')
    .isLength({min:8}).withMessage('El password tiene que ser de minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Los passwords no son iguales')
        }
        return true   
    }),
    handleInputErrors,
    AuthController.updateCurentUserPassword 
)

router.post('/check-password',
    Authenthicate,
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router