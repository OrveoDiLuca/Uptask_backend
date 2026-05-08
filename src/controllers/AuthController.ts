import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmails"

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

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('The user account is not confirmed, we send you another email confirmation')
                return res.status(401).json({ error: error.message })
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect){
                const error = new Error('Password incorrect')
                return res.status(401).json({ error: error.message })
            }

            res.send('Login succesfully')

        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }
}