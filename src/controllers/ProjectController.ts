import type {Request, Response} from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req : Request, res: Response) => {
        const project = new Project(req.body)
        project.manager = req.user._id

        try {
            await project.save() //Lo guarda en la base de datos
            res.send('Project created succesfully')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req : Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [ //Con esta condición se le dice que traiga nada más los proyectos en el cual el manager creó. 
                    {manager: {$in: [req.user._id]}},
                    {team: {$in: [req.user._id]}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
        
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                res.status(404).json({ error: 'Project not found' })
                return
            }

            if(project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id )){
                res.status(404).json({ error: 'Action no validate'})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static putProject = async (req: Request, res: Response) => {
        try {
            req.project.client_name = req.body.client_name
            req.project.project_name = req.body.project_name
            req.project.description = req.body.description
            
            await req.project.save()
            res.send('Project updated succesfully')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Project deleted succesfully')
        } catch (error) {
            console.log(error)
        }
    }
}