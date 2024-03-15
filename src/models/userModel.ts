import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: String,
    username: String,
    email: String,
    password:String,
    role:String,
    createdAt:Date,
    updatedAt:Date
}

const userSchema = new Schema({
    name: {type: String, required: true},
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super user', 'publisher', 'visitor'], default: 'visitor' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
  
export default mongoose.model<IUser>('User', userSchema);