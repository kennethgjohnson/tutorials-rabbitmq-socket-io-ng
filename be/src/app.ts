// Basic Express to get going.
import { createServer } from 'node:http';
import express, { Express, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
export let appIsRunning = false;
export const app: Express = express();
export const server = createServer(app);
export const io = new Server(server);


const port = process.env.EXPRESS_PORT;

app.get('/', (request: Request, response: Response) => {
  response.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket: Socket) => {
  // Log connection
  console.log(`a user connected, socket id: ${socket.id}`);
  // Welcome user to chat
  socket.emit('server message', `Welcome to the chat!`);
  // Tell other users that a new user has connected
  socket.broadcast.emit(
    'user connected',
    `${socket.id} joined to chat`
  );

  socket.on('chat message', (msg) => {
    console.log(`message: ${socket.id} - ${msg}`);
    io.emit('chat message', `${socket.id} - ${msg}`); // Sending message to all connected users.
  });

  // Log disconnection
  socket.on('disconnect', () => {
    // Log disconnection
    console.log(`user disconnected, socket id: ${socket.id}`);
    // Tell other users that a user has disconnected
    socket.broadcast.emit(
      'user disconnected',
      `${socket.id} left chat`
    );
  });
});


server.listen(port, () => {
  console.log(`[server]: Server started at http://localhost:${port}`);
  // set appIsRunning to true after 5 seconds
  appIsRunning = true;
});

// Small helper function used in automated integration tests
// which require the whole express server to be online.
const WAIT_CHECK_INTERVAL = 1000;
const ONE_SECOND = 1000;
// eslint-disable-next-line no-magic-numbers
const MAX_WAIT_TIME = 3 * ONE_SECOND;
export async function waitTillReady(): Promise<void> {
  if (!appIsRunning) {
    console.log('Waiting for application to start...');
    let waitTime = 0;
    while ((!appIsRunning) && (waitTime < MAX_WAIT_TIME)) {
      // Sleep for a second
      waitTime += WAIT_CHECK_INTERVAL;
      await new Promise((resolve) => setTimeout(resolve, WAIT_CHECK_INTERVAL));
    }
    if (!appIsRunning) {
      throw new Error('Application did not start in time');
    }
  }
}
