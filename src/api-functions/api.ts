console.log(`Executing code in api.ts`);
import serverless from 'serverless-http';
import app from '../server';
import fs from 'fs';
import path from 'path';

console.log('files in', path.join(process.cwd()));
fs.promises
  .readdir(path.join(process.cwd()))

  // If promise resolved and
  // data are fetched
  .then((filenames) => {
    for (const filename of filenames) {
      console.log(filename);
    }
  })

  // If promise is rejected
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log('files in', path.join(process.cwd(), 'src'));
    fs.promises
      .readdir(path.join(process.cwd(), 'src'))

      // If promise resolved and
      // data are fetched
      .then((filenames) => {
        for (const filename of filenames) {
          console.log(filename);
        }
      })

      // If promise is rejected
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log('files in', path.join(process.cwd(), 'src', 'api-functions'));
        fs.promises
          .readdir(path.join(process.cwd(), 'src', 'api-functions'))

          // If promise resolved and
          // data are fetched
          .then((filenames) => {
            for (const filename of filenames) {
              console.log(filename);
            }
          })

          // If promise is rejected
          .catch((err) => {
            console.log(err);
          });
      });
  });

export const handler = serverless(app);
