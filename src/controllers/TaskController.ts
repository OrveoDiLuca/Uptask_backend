import type {Request, Response} from 'express'
import Task from '../models/Task'

export class TaskController{

    static createTask = async (req : Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project._id // aca es como la tabla o el documento task tiene el id del project
            req.project.tasks.push(task._id) //Se le asigna las tareas a project, se usa push ya que task en project es un arreglo 
            Promise.allSettled([task.save(),req.project.save()]) //se encarga de que se ejecute estos dos codigos al mismo tiempo. 
            res.send('Task created succesfully')
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static getProjectTask = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project:req.project._id})
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }
}