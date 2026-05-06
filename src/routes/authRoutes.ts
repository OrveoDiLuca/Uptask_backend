import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',
    body('name').notEmpty().withMessage('The name is required'),
    body('password').isLength({min: 8}).withMessage('The password must be at least 8 characters long').notEmpty().withMessage('The password is required'),
    body('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('The passwords must match')
        }
        return true
    }), 
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('The email is required'),
    handleInputErrors,
    AuthController.createAccount
)

export default router