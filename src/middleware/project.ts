import type {Request, Response, NextFunction} from 'express'
import Project, { ProjectType } from '../models/Project'

declare global { //Declaration Merging
    namespace Express{
        interface Request {
            project: ProjectType
        }
    }
}

//Se utiliza un middleware para ver si existe un proyecto o no para centralizar la logica y también para separar la fucionalidad.

export async function validateProjectExist(req: Request, res: Response, next: NextFunction){
    //revisa si existe o no un proyecto.
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            res.status(404).json({ error: 'Project not found' })
            return
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({error: 'There was an error'})
    }
}