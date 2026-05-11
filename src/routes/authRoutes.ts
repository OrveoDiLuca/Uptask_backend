import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',
    body('name').notEmpty().withMessage('The name is required'),
    body('password').isLength({ min: 8 }).withMessage('The password must be at least 8 characters long').notEmpty().withMessage('The password is required'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The passwords must match')
        }
        return true
    }),
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('The email is required'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('The token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('The email is required'),
    body('password').notEmpty().withMessage('The password is required'),
    handleInputErrors,
    AuthController.Login
)

router.post('/request-code',
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('The email is required'),
    handleInputErrors,
    AuthController.RequestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('The email is required'),
    handleInputErrors,
    AuthController.ForgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('The token is required'),
    handleInputErrors,
    AuthController.confirmToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Invalid token'),
    body('password').isLength({ min: 8 }).withMessage('The password must be at least 8 characters long').notEmpty().withMessage('The password is required'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The passwords must match')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

export default router