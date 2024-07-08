import * as shell from 'shelljs';

shell.mkdir('-p', 'dist');
shell.mkdir('-p', 'dist/api-functions');
shell.cp('src/api-functions/backend-openapi-v1.yaml', 'dist/');
