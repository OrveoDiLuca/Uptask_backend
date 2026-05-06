import { Router } from "express";
import {body, param} from "express-validator"
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";


const router = Router()

router.post('/',
    body('project_name').notEmpty().withMessage('The name of the project is required'),
    body('client_name').notEmpty().withMessage('The name of the client is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/',ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id', 
    param('id').isMongoId().withMessage('Invalid Id'),
    body('project_name').notEmpty().withMessage('The name of the project is required'),
    body('client_name').notEmpty().withMessage('The name of the client is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.putProject
)

router.delete('/:id', 
    param('id').isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    ProjectController.deleteProject
)

//Routes for task
router.param('projectId',validateProjectExist)

router.post('/:projectId/tasks',
    body('name').notEmpty().withMessage('The name of the task is required'),
    body('description').notEmpty().withMessage('The description is required'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks', 
    TaskController.getProjectTask
)

router.param('taskId',taskExists)
router.param('taskId',taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    TaskController.getProjectTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid Id'),
    body('name').notEmpty().withMessage('The name of the task is required'),
    body('description').notEmpty().withMessage('The description is required'),
    handleInputErrors, 
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    TaskController.deleteTask
)

router.patch('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid Id'),
    body('status')
        .notEmpty().withMessage('The status is required')
        .isIn(['pending', 'on_hold', 'in_progress', 'under_review', 'complete']).withMessage('Invalid status'),
    handleInputErrors,
    TaskController.updateTaskStatus
)

export default router