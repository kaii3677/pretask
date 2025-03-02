import express from 'express';
import multer from 'multer';
import { uploadFile, getAllFiles, getFile, deleteFile, openFile, editFileName, moveFileToFolder } from '../controller/File.js';

const router = express.Router();

const storage = multer.memoryStorage(); 


// Multer middleware for file uploads
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 
            'image/png', 
            'application/pdf', 
            'application/msword',             
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'text/plain',                    
            'application/vnd.ms-excel',     
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
            'application/zip',                
            'application/x-7z-compressed',    
            'application/json'                 
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 10 } 
});

// Define routes 
router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getAllFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);
router.get('/open/:fileName', openFile);
router.put('/:id/name', editFileName);
router.put('/:id/move', moveFileToFolder);

export default router;
