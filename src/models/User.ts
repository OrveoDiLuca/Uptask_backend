import moongose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string
    password: string
    email: string
    confirmed: boolean
}

const UserSchema: Schema = new Schema ({
    name: {
        type: String, 
        required: true, 
    },
    password: {
        type: String, 
        required: true, 
    },
    email: {
        type: String, 
        required: true, 
        lowercase: true,
        unique: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

const User = moongose.model<IUser>('User', UserSchema)
export default User