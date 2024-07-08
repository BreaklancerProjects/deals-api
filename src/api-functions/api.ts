console.log(`Executing code in api.ts`);
import serverless from 'serverless-http';
import app from '../server';

export const handler = serverless(app);
