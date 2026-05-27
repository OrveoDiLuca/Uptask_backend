import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import Task, { TaskType } from './Task'
import { IUser } from './User'
import Note from './Note'

//Este model es para typescript
export type ProjectType = Document & {
    project_name: string
    client_name: string 
    description: string
    tasks: PopulatedDoc<TaskType & Document>[] //Son multiples tareas que puede tener un proyecto. 
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

//Este model es para mongoose, ya que estamos definiendo las tablas que va a tener ese modelo.
const ProjectSchema : Schema = new Schema({
    project_name: {
        type: String, 
        required: true,
        trim: true
    }, 
    client_name: {
        type: String, 
        required: true,
        trim: true
    }, 
    description: {
        type: String, 
        required: true,
        trim: true
    },
    tasks: [
        {
        type: Types.ObjectId,
        ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
        type: Types.ObjectId,
        ref: 'User'
        }
    ],
}, {timestamps: true})

//Middleware 
ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id
    if(!projectId) return 
    const tasks = await Task.find({project: projectId})
    for (const task of tasks) {
        await Note.deleteOne({task: task._id})
    }
    await Task.deleteMany({project: projectId})
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project