import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'

// Fetch files using ID
export async function fetchFiles(folderId = null) {
    try {
        const filesResponse = await axios.get(`${BASE_URL}/files`);
        return filesResponse.data
            .filter(file => file.folderId === folderId) 
            .map(file => ({
                name: file.name,
                type: 'file',
                id: file.gridfsId,
                folderId: file.folderId,
            }));
    } catch (error) {
        console.error('Error fetching files:', error?.response?.data || error.message);
        return [];
    }
}

// Fetch folders 
export async function fetchFolders(parentFolderId = null) {
    try {
        const response = await axios.get(`${BASE_URL}/folders`, {
            params: { parentFolderId }
        });

        return response.data.map(folder => ({
            name: folder.name,
            type: 'folder',
            id: folder._id,
            parentFolder: folder.parentFolder,
        }));
    } catch (error) {
        console.error('Error fetching folders:', error?.response?.data || error.message);
        return [];
    }
}



// Upload file 
export async function uploadFile(file, folderId = null) {
    console.log('Uploading file to folder ID:', folderId);
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId); 

    try {
        const response = await axios.post(`${BASE_URL}/files/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error?.response?.data || error.message);
    }
}


// Create folder
export const createFolder = async (name, parentFolderId) => {
    console.log('API call to create folder:', { name, parentFolderId });
    try {
        const response = await fetch('http://localhost:5000/api/folders', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, parentFolderId }),
        });

        if (!response.ok) {
            console.error('Server responded with an error:', response.status, response.statusText);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating folder:', error);
    }
};


// Fetch Folder using ID
export async function fetchFolderById(folderId) {
    try {
        const response = await axios.get(`${BASE_URL}/folders/${folderId}`);
        console.log('API Response for fetchFolderById:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching folder by ID:', error?.response?.data || error.message);
        return null;
    }
}


  
// Delete file or folder
export async function deleteItem(id, type) {
    try {
        const url = type === 'file' ? `${BASE_URL}/files/${id}` : `${BASE_URL}/folders/${id}`;
        const response = await axios.delete(url);
        return response.status === 200;
    } catch (error) {
        console.error('Error deleting item:', error?.response?.data || error.message);
    }
}

// Edit file or folder name
export async function editName(id, type, newName) {
    const payload = { newName: newName.trim() };
    const url = type === 'file' ? `${BASE_URL}/files/${id}/name` : `${BASE_URL}/folders/${id}/name`;

    try {
        const response = await axios.put(url, payload);
        return response.status === 200;
    } catch (error) {
        console.error('Error updating name:', error?.response?.data || error.message);
    }
}

// Move file or folder
export async function moveItem(id, type, destinationFolderId) {
    // Use 'folderId' for files and 'parentFolderId' for folders
    const payload = type === 'file' 
        ? { folderId: destinationFolderId } 
        : { parentFolderId: destinationFolderId };

    const url = type === 'file' 
        ? `${BASE_URL}/files/${id}/move` 
        : `${BASE_URL}/folders/${id}/move`;

    try {
        console.log('Sending move request:', { url, payload }); 
        const response = await axios.put(url, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error moving item:', error?.response?.data || error.message);
    }
}

