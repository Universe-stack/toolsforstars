import mongoose, { Document, Schema } from 'mongoose';

// Define interface for User document
export interface IUserProfile extends Document {
    username: string;
    email: string;
    name: string;
    role: string;
    picture: string;
    age: Date
}


const userProfileSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['superuser', 'publisher', 'visitor'], default: 'visitor' },
    picture: { type: String }, // URL or binary data for the user's picture
    age: {type: Date, required:false},
}, { timestamps: true });


export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema);
