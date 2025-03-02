import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    gridfsId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['file', 'folder'], 
        required: true 
    },
    folderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Folder', 
        default: null 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
});

const File = mongoose.model('File', fileSchema);
export default File;
