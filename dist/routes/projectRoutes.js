"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ProjectController_1 = require("../controller/ProjectController");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controller/TaskController");
const Project_1 = require("../middleware/Project");
const task_1 = require("../middleware/task");
const Auth_1 = require("../middleware/Auth");
const TeamController_1 = require("../controller/TeamController");
const NoteController_1 = require("../controller/NoteController");
const router = (0, express_1.Router)();
router.use(Auth_1.Authenthicate);
router.post('/', (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del proyecto es Obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del cliente es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La description del proyecto es Obligatoria'), validation_1.handleInputErrors, ProjectController_1.ProjectController.createProject);
router.get('/', ProjectController_1.ProjectController.getAllProjects);
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, ProjectController_1.ProjectController.getProjectById);
router.param('projectId', Project_1.validateProyectExist);
router.put('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del proyecto es Obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del cliente es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La description del proyecto es Obligatoria'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectController_1.ProjectController.updateProject);
router.delete('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectController_1.ProjectController.deleteProject);
/** Routes for tasks */
router.post('/:projectId/tasks', task_1.hasAuthorization, (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre de la tarea es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('la descripcion es Obligatoria'), validation_1.handleInputErrors, TaskController_1.TaskController.createTask);
router.get('/:projectId/tasks', TaskController_1.TaskController.getProjectTasks);
router.param('taskId', task_1.taskExist);
router.param('taskId', task_1.taskBelongToProject);
router.get('/:projectId/tasks/:taskId', validation_1.handleInputErrors, TaskController_1.TaskController.getTaskById);
router.put('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombrede la tarea es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('la descripcion es Obligatoria'), validation_1.handleInputErrors, TaskController_1.TaskController.updateTask);
router.delete('/:projectId/tasks/:taskId', task_1.hasAuthorization, validation_1.handleInputErrors, TaskController_1.TaskController.deleteTask);
router.post('/:projectId/tasks/:taskId/status', (0, express_validator_1.body)('status').notEmpty().withMessage('El estado es obligatorio'), task_1.hasAuthorization, validation_1.handleInputErrors, TaskController_1.TaskController.updateStatus);
router.post('/:projectId/team/find', (0, express_validator_1.body)('email').isEmail().toLowerCase().withMessage('El email no es valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
router.get('/:projectId/team', validation_1.handleInputErrors, TeamController_1.TeamMemberController.getProjectTeam);
router.post('/:projectId/team', (0, express_validator_1.body)('id')
    .isMongoId().withMessage('Id no Valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addUserById);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('Id no Valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeUserById);
//Routes for Notes
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content').notEmpty().withMessage('El contenido de la nota es obligatorio'), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', validation_1.handleInputErrors, NoteController_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('Id no Valido'), validation_1.handleInputErrors, NoteController_1.NoteController.removeTaskNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map