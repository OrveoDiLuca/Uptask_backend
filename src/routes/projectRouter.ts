import { Router } from "express";
import {body} from "express-validator"
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";


const router = Router()

router.post('/',
    body('project_name').notEmpty().withMessage('The name of the project is required'),
    body('client_name').notEmpty().withMessage('The name of the client is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/',ProjectController.getAllProjects)

export default router