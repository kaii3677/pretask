import mongoose from 'mongoose';
import File from '../metadata/File.js';
import { broadcast } from '../server.js';
import Grid from 'gridfs-stream';

let gfs, gridFSBucket;

mongoose.connection.on('connected', () => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads'); 
});


// Upload File Function
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!gridFSBucket) {
            return res.status(500).json({ error: 'GridFSBucket is not initialized' });
        }

        let folderId = req.body.folderId?.trim() || null;
        if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ error: 'Invalid folder ID' });
        }

        console.log('Received folderId on upload:', folderId);

        const writeStream = gridFSBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        writeStream.end(req.file.buffer);

        writeStream.on('finish', async () => {
            const newFile = new File({
                name: req.file.originalname,
                gridfsId: writeStream.id,
                type: 'file',
                mimeType: req.file.mimetype,
                size: req.file.size,
                createdAt: new Date(),
                folderId: folderId || null, 
            });

            await newFile.save();

            res.status(201).json({
                message: 'File uploaded successfully',
                fileId: writeStream.id,
            });
        });

        writeStream.on('error', (error) => {
            res.status(500).json({
                error: 'File upload failed',
                details: error.message,
            });
        });

    } catch (error) {
        res.status(500).json({
            error: 'Server error during file upload',
            details: error.message,
        });
    }
};


// Get All Files
export const getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json(files.map(file => ({
            name: file.name,
            type: file.type,
            gridfsId: file.gridfsId,
            folderId: file.folderId ?? null, 
        })));
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving files' });
    }
};


//Get File
export const getFile = async (req, res) => {
    try {
        if (!gfs) {
            return res.status(500).json({ error: 'GridFS not initialized' });
        }

        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const readstream = gfs.createReadStream({ filename: file.name });
        readstream.pipe(res);

    } catch (error) {
        res.status(500).json({ error: 'Error retrieving file' });
    }
};


// Open File 
export const openFile = (req, res) => {
    const fileName = req.params.fileName;
    try {
        const readStream = gridFSBucket.openDownloadStreamByName(fileName);
        readStream.on('error', () => res.status(404).json({ error: 'File not found' }));
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Error opening file' });
    }
};


// Delete File 
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({ gridfsId: req.params.id });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await gridFSBucket.delete(new mongoose.Types.ObjectId(file.gridfsId));
        await file.deleteOne();

        res.json({ message: 'File deleted successfully!' });
        broadcast({ type: 'FILE_DELETED', fileId: req.params.id });

    } catch (error) {
        res.status(500).json({ error: 'Error deleting file' });
    }
};


//Edit File Name
export const editFileName = async (req, res) => {
    try {
        const { newName } = req.body; 

        if (!newName) {
            return res.status(400).json({ error: 'New file name is required' });
        }
        const file = await File.findOne({ gridfsId: req.params.id });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        file.name = newName;
        await file.save();
        res.json({ message: 'File name updated successfully', file });
        broadcast({ type: 'FILE_RENAMED', fileId: req.params.id, newName });

    } catch (error) {
        res.status(500).json({ error: 'Error updating file name', details: error.message });
    }
};


// Move File to Folder
export const moveFileToFolder = async (req, res) => {
    try {
        const { folderId } = req.body; 
        if (!folderId) {
            return res.status(400).json({ error: 'Folder ID is required' });
        }
        const file = await File.findOne({ gridfsId: req.params.id });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        file.folderId = folderId;
        await file.save();
        res.json({ message: 'File moved to folder successfully', file });
        broadcast({ type: 'FILE_MOVED', fileId: req.params.id, folderId });

    } catch (error) {
        res.status(500).json({ error: 'Error moving file to folder', details: error.message });
    }
};
