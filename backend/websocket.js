import WebSocket from 'ws';
import { sessionStore } from './controller/User.js';  

const wss = new WebSocket.Server({ port: 5000 });

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
    console.log('received: %s', message);
  });

  ws.send('Welcome to the chat!');
});
