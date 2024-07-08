console.log(`Executing code in server.ts`);

import './config/dotenv';
import { connectToDB } from './config/db';

import { setupMainExpressApp } from './app';
import { getPort, isDevelopmentMode } from './config/environment';

const port = getPort();
const app = setupMainExpressApp();

// if (isDevelopmentMode())
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Api running on port ${port}. Check the docs at http://localhost:${port}/v1/api-doc`);
    });
  })
  .catch((connError) => {
    console.error(connError);
  });

export default app;
