import mongoose, { Schema, Document, Types } from 'mongoose'
import { types } from 'node:util'
import Note from './Note'

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'on_hold',
    IN_PROGRESS: 'in_progress',
    UNDER_REVIEW: 'under_review',
    COMPLETE: 'complete'
} as const //No se pueden modificar esos valores 

export type taskStatus = typeof taskStatus[keyof typeof taskStatus]

export type TaskType = Document & {
    name: string
    description: string
    project: Types.ObjectId //La tarea se asigna a un proyecto. 
    status: taskStatus
    completedBy: {
        user: Types.ObjectId,
        status: taskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project',
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING //Cada vez que se genere la tarea tendra un valor por default como pending. 
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true })

//Middleware 
TaskSchema.pre('deleteOne', {document: true}, async function() {
    const taskId = this._id
    if(!taskId) return 
    await Note.deleteMany({task: taskId})
})

const Task = mongoose.model<TaskType>('Task', TaskSchema)
export default Task