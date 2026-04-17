import type {Request, Response} from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req : Request, res: Response) => {
        try {
            await Project.create(req.body) //Lo guarda en la base de datos
            res.send('Project created succesfully')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req : Request, res: Response) => {
        res.send('Todos los proyectos')
    }
}