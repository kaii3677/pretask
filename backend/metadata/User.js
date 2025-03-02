import mongoose, { mongo } from "mongoose";


const userSchema = new mongoose.Schema({
    email:{
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    folders: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Folder'
    },
    files: {
        type: mongoose.Schema.Types.ObjectId, ref: 'File'
    }
    
    }, {
        timestamps: true // createdAt, updatedAt
    });

const User = mongoose.model('User', userSchema);

export default User;