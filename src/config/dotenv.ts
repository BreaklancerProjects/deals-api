import * as fs from 'fs';
import * as dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  console.log('Using .env file to supply config environment variables.');
  dotenv.config();
}
