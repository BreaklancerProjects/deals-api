import * as shell from 'shelljs';

shell.cp('node_modules/swagger-ui-dist/swagger-ui.css', 'src/api-functions');
shell.cp('node_modules/swagger-ui-dist/swagger-ui-bundle.js', 'src/api-functions');
shell.cp('node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js', 'src/api-functions');
shell.cp('node_modules/swagger-ui-dist/favicon-16x16.png', 'src/api-functions');
shell.cp('node_modules/swagger-ui-dist/favicon-32x32.png', 'src/api-functions');
