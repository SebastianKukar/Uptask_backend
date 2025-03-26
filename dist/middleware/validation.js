"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputValidation = exports.handleInputErrors = void 0;
const express_validator_1 = require("express-validator");
const handleInputErrors = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
    return;
};
exports.handleInputErrors = handleInputErrors;
const handleInputValidation = (req, res, next) => {
    const { clientName, projectName, description } = req.body;
    const project = [clientName, projectName, description];
    if (project.every(parametro => parametro !== '')) {
        next();
    }
    else {
        const error = new Error('Todos los campos son obligatorios');
        res.status(400).json({ error: error.message });
        return;
    }
};
exports.handleInputValidation = handleInputValidation;
//# sourceMappingURL=validation.js.map