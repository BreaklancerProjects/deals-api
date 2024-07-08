console.log(`Executing code in ${__filename}`);
import serverless from 'serverless-http';
import app from '../server';

export const handler = serverless(app);
