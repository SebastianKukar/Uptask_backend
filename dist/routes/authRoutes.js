"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controller/AuthController");
const validation_1 = require("../middleware/validation");
const Auth_1 = require("../middleware/Auth");
const router = (0, express_1.Router)();
router.post('/create-account', (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre no puede estar vacio'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password tiene que ser de minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los passwords no son iguales');
    }
    return true;
}), (0, express_validator_1.body)('email')
    .isEmail().withMessage('Email no valido'), validation_1.handleInputErrors, AuthController_1.AuthController.createAccount);
router.post('/confirm-account', (0, express_validator_1.body)('token')
    .notEmpty().withMessage('El token no puede estar vacio'), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
router.post('/login', (0, express_validator_1.body)('email')
    .isEmail().withMessage('Email no valido'), (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password no puede estar vacio'), validation_1.handleInputErrors, AuthController_1.AuthController.Login);
router.post('/forgot-password', (0, express_validator_1.body)('email')
    .isEmail().withMessage('Email no valido'), validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token')
    .notEmpty().withMessage('El token no puede ir vacio'), validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
router.post('/update-password/:token', (0, express_validator_1.param)('token')
    .isNumeric()
    .withMessage('Token No valido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password tiene que ser de minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los passwords no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updatePasswordWithToken);
router.get('/user', Auth_1.Authenthicate, AuthController_1.AuthController.user);
/* Profile */
router.put('/profile', Auth_1.Authenthicate, (0, express_validator_1.body)('name')
    .notEmpty()
    .withMessage('El nombre no puede ir vacio'), (0, express_validator_1.body)('email')
    .isEmail()
    .withMessage('Email no Valido'), validation_1.handleInputErrors, AuthController_1.AuthController.updateProfile);
router.put('/update-password', Auth_1.Authenthicate, (0, express_validator_1.body)('current_password')
    .notEmpty().withMessage('El password actual no puede ir vacio'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password tiene que ser de minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los passwords no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurentUserPassword);
router.post('/check-password', Auth_1.Authenthicate, (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password no puede ir vacio'), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map