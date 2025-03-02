import express from 'express';
import { createFolder, getFolders, deleteFolder, editFolderName, moveFolderToFolder, getFolderById } from '../controller/Folder.js';

const router = express.Router();

router.post('/', createFolder);
router.get('/', getFolders);
router.get('/:folderId', getFolderById);
router.delete('/:id', deleteFolder);
router.put('/:id/name', editFolderName);
router.put('/:id/move', moveFolderToFolder); 


export default router;
