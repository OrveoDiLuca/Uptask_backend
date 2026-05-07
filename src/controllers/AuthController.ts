import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"

export class AuthController {
    static createAccount = async(req: Request, res: Response) => {
        try {
            const {password, email} = req.body
            //check if exist email. 
            const userExist = await User.findOne({email})
            
            if(userExist) {
                const error = new Error('The user is already exist')
                return res.status(409).json({error: error.message})
            }

            //Crear un usuario nuevo
            const user = new User(req.body)
            //Hasheando el password del usuario. 
            user.password = await hashPassword(password)
            await user.save()
            res.send('User created succesfully, check your email for verify your user.')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }
}