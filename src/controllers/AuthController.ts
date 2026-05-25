import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmails"
import { generateJWT } from "../utils/jwt"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            //check if exist email. 
            const userExist = await User.findOne({ email })

            if (userExist) {
                const error = new Error('The user is already exist')
                return res.status(409).json({ error: error.message })
            }

            //Crear un usuario nuevo
            const user = new User(req.body)
            //Hasheando el password del usuario. 
            user.password = await hashPassword(password)

            //Generate Token. 
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send('User created succesfully, check your email for verify your user.')
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            //Searching if the token exist in the database. 
            const tokenExist = await Token.findOne({ token })

            if (!tokenExist) {
                const error = new Error('Token not valid')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Account confirmed')
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static Login = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User not founded')
                return res.status(404).json({ error: error.message })
            }
            if (!user.confirmed) {
                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                await token.save()

                await AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('The user account is not confirmed, we send you another email confirmation')
                return res.status(401).json({ error: error.message })
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                const error = new Error('Password incorrect')
                return res.status(401).json({ error: error.message })
            }

            const token = generateJWT({id: user._id}) //Nada mas se le pasa el id del usuario, ya que no es recomendado guardar otro tipo de información.
            res.send(token)

        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static RequestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            //check if exist email. 
            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('The user does not exist')
                return res.status(404).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('The user has been confirmed already')
                return res.status(403).json({ error: error.message })
            }

            //Generate Token. 
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send('A new token has been sent to your email')
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static ForgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            //check if exist email. 
            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('The user does not exist')
                return res.status(404).json({ error: error.message })
            }

            //Generate Token. 
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            await token.save()

            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Check your email for reset password')
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static confirmToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            //Searching if the token exist in the database. 
            const tokenExist = await Token.findOne({ token })

            if (!tokenExist) {
                const error = new Error('Token not valid')
                return res.status(404).json({ error: error.message })
            }

            res.send('The token is valid, define your new password')
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const {password} = req.body
            //Searching if the token exist in the database. 
            const tokenExist = await Token.findOne({ token })

            if (!tokenExist) {
                const error = new Error('Token not valid')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.send('Your password has been updated succesfully')
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        const {name, email} = req.body

        req.user.name = name
        req.user.email = email

        const userExist = await User.findOne({email})//Buscando que el email este en la base de datos
        if(userExist && userExist._id.toString() !== req.user._id.toString()){
            const error = new Error('This email is already in use')
            return res.status(409).json({error: error.message})
        }

        try {
            await req.user.save()
            res.send('Profile updated succesfully')
        } catch (error) {
            res.status(500).send('There was an error')
        }
    }

    static updatePassword = async (req: Request, res: Response) => {
        const {current_password, password} = req.body
        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('The current password is incorrect')
            return res.status(401).json({error: error.message})
        }
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('The password has been updated succesfully') 
        } catch (error) {
            res.status(500).send('There was an error')
        }
    }
}