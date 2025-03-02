import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    parentFolder: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Folder', 
        default: null 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
});

export default mongoose.model('Folder', folderSchema);
