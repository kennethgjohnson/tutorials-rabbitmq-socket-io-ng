// Basic Express to get going.
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
export let appIsRunning = false;
export const app: Express = express();
const port = process.env.EXPRESS_PORT;

app.get('/', (request: Request, response: Response) => {
  response.send('BE Server is running!');
});

app.listen(port, () => {
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
