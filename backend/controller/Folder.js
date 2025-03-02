import Folder from '../metadata/Folder.js';
import { broadcast } from '../server.js';

//Create Folder
export const createFolder = async (req, res) => {
    try {
        const { name, parentFolderId } = req.body;
        const newFolder = new Folder({
            name,
            type: 'folder', 
            mimeType: null, 
            size: 0, 
            createdAt: new Date(),
            parentFolder: parentFolderId || null, 
        });

        await newFolder.save();
        res.status(201).json({
            message: 'Folder created successfully',
            folderId: newFolder._id,
        });

    } catch (error) {
        res.status(500).json({
            error: 'Server error during folder creation',
            details: error.message,
        });
    }
};


//Get Folders
export const getFolders = async (req, res) => {
    try {
        const parentFolderId = req.query.parentFolderId || null;
        console.log('Fetching folders with parentFolderId:', parentFolderId);

        const folders = await Folder.find({ parentFolder: parentFolderId });
        res.status(200).json(folders);

    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({
            error: 'Server error while fetching folders',
            details: error.message,
        });
    }
};


// Get Folder by ID
export const getFolderById = async (req, res) => {
    try {
        const folderId = req.params.folderId;
        const folder = await Folder.findById(folderId);

        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        res.status(200).json(folder);

    } catch (error) {
        res.status(500).json({
            error: 'Server error while fetching folder by ID',
            details: error.message,
        });
    }
};


// Delete Folder
export const deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        await folder.deleteOne();
        res.json({ message: 'Folder deleted successfully!' });
        broadcast({ type: 'FOLDER_DELETED', folderId: req.params.id });

    } catch (error) {
        console.error('Error deleting folder:', error);  
        res.status(500).json({ error: 'Error deleting folder', details: error.message });
    }
};

// Edit Folder Name
export const editFolderName = async (req, res) => {
    try {
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).json({ error: 'New folder name is required' });
        }
        const folder = await Folder.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        folder.name = newName;
        await folder.save();
        res.json({ message: 'Folder name updated successfully', folder });
        broadcast({ type: 'FOLDER_RENAMED', folderId: req.params.id, newName });

    } catch (error) {
        res.status(500).json({ error: 'Error updating folder name', details: error.message });
    }
};

// Move Folder into Another Folder
export const moveFolderToFolder = async (req, res) => {
    try {
        const { parentFolderId } = req.body; 
        if (!parentFolderId) {
            return res.status(400).json({ error: 'Parent folder ID is required' });
        }
        const folderToMove = await Folder.findById(req.params.id);

        if (!folderToMove) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        folderToMove.parentFolder = parentFolderId;
        await folderToMove.save();
        res.json({ message: 'Folder moved successfully', folder: folderToMove });
        broadcast({ type: 'FOLDER_MOVED', folderId: req.params.id, parentFolderId });

    } catch (error) {
        res.status(500).json({ error: 'Error moving folder', details: error.message });
    }
};
