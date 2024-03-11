import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    username: String,
    email: String,
    password:String,
    role:String,
    createdAt:Date,
    updatedAt:Date
}

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super user', 'product lister', 'visitor'], default: 'Visitor' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
  
export default mongoose.model<IUser>('User', userSchema);