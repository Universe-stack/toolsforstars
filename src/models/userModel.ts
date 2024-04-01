import mongoose, {Schema, Document} from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    _id: string;
    name: string;
    username: string;
    email: string;
    password:string;
    role: 'superuser' | 'publisher' | 'visitor';
    ads:number;
    tools:number;
    createdAt:Date;
    updatedAt:Date;
    isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    name: {type: String, required: true},
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superuser', 'publisher', 'visitor'], default: 'visitor' },
    ads: {type:String},
    tools: {type:String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};
  
export default mongoose.model<IUser>('User', userSchema);