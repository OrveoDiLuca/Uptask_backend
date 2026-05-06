import mongoose, {Schema, Document, Types} from 'mongoose'

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'on_hold', 
    IN_PROGRESS: 'in_progress',
    UNDER_REVIEW: 'under_review', 
    COMPLETE: 'complete'
} as const //No se pueden modificar esos valores 

export type taskStatus = typeof taskStatus[keyof typeof taskStatus]

export type TaskType = Document & {
    name : string
    description: string
    project: Types.ObjectId //La tarea se asigna a un proyecto. 
    status: taskStatus
}

export const TaskSchema : Schema = new Schema ({
    name : {
        type: String, 
        required: true, 
        trim: true
    },
    description : {
        type: String, 
        required: true, 
        trim: true
    },
    project : {
        type: Types.ObjectId, 
        ref: 'Project', 
    }, 
    status: {
        type: String, 
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING //Cada vez que se genere la tarea tendra un valor por default como pending. 
    }
}, {timestamps: true})

const Task = mongoose.model<TaskType>('Task', TaskSchema)
export default Task