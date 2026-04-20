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
            const tasks = await Task.find({project:req.project._id}).populate('project') //Es como un join, como colocamos en el modelo Task la referencia del project entonces se puede realizar.
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static getProjectTaskById = async(req: Request, res: Response) => {
        try {
            if(req.task.project.toString() !== req.project._id.toString()){
                const error = new Error('The task doesnt exist in this project')
                return res.status(400).json({error: error.message})
            }
            res.json(req.task)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static updateTask = async (req:Request, res: Response) => {
        try {

            if(req.task.project.toString() !== req.project._id.toString()){
                const error = new Error('The task doesnt exist in this project')
                return res.status(400).json({error: error.message})
            }
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send('Task updated succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            if(req.task.project.toString() !== req.project._id.toString()){
                const error = new Error('The task doesnt exist in this project')
                return res.status(400).json({error: error.message})
            }
            req.task.status = req.body.status
            await req.task.save()
            res.send('Task status updated succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        } 
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
        
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task._id.toString())

            await Promise.allSettled([req.task.deleteOne(),req.project.save()])
            res.send('Task deleted succesfully')
 
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }
}