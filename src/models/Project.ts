import mongoose, {Schema, Document} from 'mongoose'

//Este model es para typescript
export type ProjectType = Document & {
    project_name: string; 
    client_name: string; 
    description: string
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
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project