import { Router } from 'express'
import {body, param} from 'express-validator'
import { ProjectController } from '../controller/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controller/TaskController'
import { validateProyectExist } from '../middleware/Project'
import { hasAuthorization, taskBelongToProject, taskExist } from '../middleware/task'
import { Authenthicate } from '../middleware/Auth'
import { TeamMemberController } from '../controller/TeamController'
import { NoteController } from '../controller/NoteController'

const router = Router()

router.use(Authenthicate)

router.post('/', 
            body('projectName')
            .notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
            body('clientName')
            .notEmpty().withMessage('El nombre del cliente es Obligatorio'),
            body('description')
            .notEmpty().withMessage('La description del proyecto es Obligatoria'),
            handleInputErrors,
            ProjectController.createProject)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
            param('id').isMongoId().withMessage('ID no valido'), 
            handleInputErrors,
            ProjectController.getProjectById)
            
router.param('projectId', validateProyectExist)

router.put('/:projectId', 
        param('projectId').isMongoId().withMessage('ID no valido'), 
        body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
        body('clientName')
        .notEmpty().withMessage('El nombre del cliente es Obligatorio'),
        body('description')
        .notEmpty().withMessage('La description del proyecto es Obligatoria'),
        handleInputErrors,
        hasAuthorization,
        ProjectController.updateProject
    )
        
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
        handleInputErrors,
        hasAuthorization,
        ProjectController.deleteProject)
        
/** Routes for tasks */
router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
    body('description')
    .notEmpty().withMessage('la descripcion es Obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)
router.param('taskId', taskExist)
router.param('taskId', taskBelongToProject)

router.get('/:projectId/tasks/:taskId',
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    body('name')
    .notEmpty().withMessage('El nombrede la tarea es Obligatorio'),
    body('description')
    .notEmpty().withMessage('la descripcion es Obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    hasAuthorization,
    handleInputErrors,
    TaskController.updateStatus
)

router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('El email no es valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail

)
router.get('/:projectId/team',
    handleInputErrors,
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
    .isMongoId().withMessage('Id no Valido'),
    handleInputErrors,
    TeamMemberController.addUserById
)


router.delete('/:projectId/team/:userId',
    param('userId')
    .isMongoId().withMessage('Id no Valido'),
    handleInputErrors,
    TeamMemberController.removeUserById
)

//Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    handleInputErrors,
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Id no Valido'),
    handleInputErrors,
    NoteController.removeTaskNote
)

export default router