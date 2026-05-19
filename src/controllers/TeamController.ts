import type {Request, Response} from 'express'
import User from '../models/User'
import Project from '../models/Project'

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const {email} = req.body

        //Find user. 
        try {
            const user = await User.findOne({email}).select('id email name')
            if(!user){
                const error = new Error('User not founded')
                return res.status(404).json({error: error.message})
            }
            res.json({user})
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static addUserById = async (req: Request, res: Response) => {
        const {id} = req.body

        //Find user. 
        try {
            const user = await User.findById(id).select('id')
            if(!user){
                const error = new Error('User not founded')
                return res.status(404).json({error: error.message})
            }

            req.project.team.push(user._id)
            if(req.project.team.some(team => team.toString() === user.id.toString())){
                const error = new Error('This user is already in the team!')
                return res.status(409).json({error: error.message})
            }

            await req.project.save()
            res.send('User added succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static deleteUserById = async (req: Request, res: Response) => {
        const {id} = req.body
        try {

            if(!req.project.team.some(team => team.toString() === id)){
                const error = new Error('This user not exist in the project')
                return res.status(409).json({error: error.message})
            }

            req.project.team = req.project.team.filter(team => team.toString() !== id)
            await req.project.save()
            res.send('User deleted succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static getTeamMembers = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project._id).populate({
            path: 'team',
            select: 'id name email'
        })
        res.json(project.team)
    }
}