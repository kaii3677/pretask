import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { connectDB } from './config/db.js';
import { createUser, loginUser, sessionStore } from './controller/User.js';
import http from 'http';
import fileRoutes from './routes/File.js';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import folderRoutes from './routes/Folder.js'

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.post('/api/user', createUser);
app.post('/api/login', loginUser);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes)

app.get('/', (req, res) => {
    res.send('Server is ready!');
});

// Start Server
console.log("Initializing server...");
server.listen(5000, () => {
    console.log("Server started at http://localhost:5000 (WebSocket enabled)");
});


let gridfsBucket;

const initGridFS = (connection) => {
    gridfsBucket = new GridFSBucket(connection.db, { bucketName: 'uploads' });
    console.log('GridFSBucket initialized');
};

export const getGridFSBucket = () => {
    if (!gridfsBucket) {
        throw new Error('GridFSBucket is not initialized');
    }
    return gridfsBucket;
};

// MongoDB Connection
connectDB()
    .then(() => {
        console.log('Database connection initiated...');
        const connection = mongoose.connection;

        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        connection.once('open', () => {
            console.log('MongoDB connected');
            initGridFS(connection);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const sessionId = params.get('sessionId');

    if (!sessionId || !sessionStore[sessionId]) {
        console.log('Invalid sessionId, closing connection');
        ws.close();
        return;
    }

    const user = sessionStore[sessionId];
    console.log(`User authenticated: ${user.email}`);

    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send(`Echo: ${message}`);
    });

    ws.send('Welcome to the WebSocket server!');
});

// Broadcast function for WebSocket
const broadcast = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

export { broadcast, gridfsBucket };
