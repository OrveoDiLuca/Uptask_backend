import type {Request, Response, NextFunction} from 'express'
import Task, { TaskType } from '../models/Task'


declare global { //Declaration Merging
    namespace Express{
        interface Request {
            task: TaskType
        }
    }
}

//Se utiliza un middleware para ver si existe un proyecto o no para centralizar la logica y también para separar la fucionalidad.

export async function taskExists(req: Request, res: Response, next: NextFunction){
    //revisa si existe o no un proyecto.
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            res.status(404).json({ error: 'Task not found' })
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'There was an error'})
    }
}