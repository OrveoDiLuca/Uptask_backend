import type {Request, Response} from 'express'
import Project from '../models/Project'
import Task from '../models/Task'

export class TaskController{

    static createTask = async (req : Request, res: Response) => {
        const { projectId } = req.params
        try {
            const project = await Project.findById(projectId)
            if (!project) {
                res.status(404).json({ error: 'Project not found' })
                return
            }
            const task = new Task(req.body)
            task.project = project._id // aca es como la tabla o el documento task tiene el id del project
            project.tasks.push(task._id) //Se le asigna las tareas a project, se usa push ya que task en project es un arreglo 
            await task.save()
            await project.save()
            res.send('Task created succesfully')
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'There was an error' })
        }
    }
}