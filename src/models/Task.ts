import mongoose, {Schema, Document} from 'mongoose'

export type TaskType = Document & {
    name : string
    description: string
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
})

const Task = mongoose.model<TaskType>('Task', TaskSchema)
export default Task