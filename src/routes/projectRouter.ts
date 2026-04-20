import { Router } from "express";
import {body, param} from "express-validator"
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";


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
router.post('/:projectId/tasks',
    validateProjectExist,
    body('name').notEmpty().withMessage('The name of the task is required'),
    body('description').notEmpty().withMessage('The description is required'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks', 
    validateProjectExist, 
    TaskController.getProjectTask
)

export default router