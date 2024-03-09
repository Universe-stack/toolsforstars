import mongoose,{Schema, Document} from 'mongoose';

interface IRole extends Document{
    name: String,
    description: String
}

const roleSchema = new Schema({
    name: {type:String, required:true},
    description: {type:String, required: true}
})

export default mongoose.model<IRole>('Role', roleSchema)