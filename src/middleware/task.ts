import type {Request, Response, NextFunction} from 'express'
import Task, { TaskType } from '../models/Task'


declare global { //Declaration Merging
    namespace Express{
        interface Request {
            task: TaskType
        }
    }
}


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

export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction){
    try {
        if(req.task.project.toString() !== req.project._id.toString()){
            const error = new Error('The task doesnt exist in this project')
            return res.status(400).json({error: error.message})
        }
        next()
    } catch (error) {
        res.status(500).json({error: 'There was an error'}) 
    }
}