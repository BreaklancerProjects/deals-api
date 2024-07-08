console.log(`Executing code in app.ts`);
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import { connector } from 'swagger-routes-express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import { getCorsOrigins, getPort, isDevelopmentMode } from './config/environment';
// import controllers from './controllers/index';
import * as controllers from './controllers';
import express from 'express';
import { Express, Handler } from 'express';
import { errorHandler } from './middlewares/ErrorMiddleware';
import { AuthenticationMiddleware } from './middlewares/AuthMiddleware';
import { BadRequestError } from './errors/BadRequestError';
import lusca from 'lusca';
import cors from 'cors';

enum ApiVersions {
  v1 = 'v1',
}

interface HasName {
  name?: string;
}

export function setupMainExpressApp(): Express {
  const app = express();
  app.set('port', getPort());

  app.use(
    cors({
      origin: getCorsOrigins(),
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(lusca.xframe('SAMEORIGIN'));
  app.use(lusca.xssProtection(true));
  app.set('etag', false);

  // const regex = /^\/v[0-9]+(\/((api-doc(\/.*)?)|(favicon\.ico)|login|deals(\/.*)?)?)?$/;
  const regex = /^.*$/;

  app.use(
    AuthenticationMiddleware({
      ignorePaths: regex,
    }),
  );

  const appV1 = setUpV1();

  app.use(function (req, res, next) {
    const requestUrl = /^\/(v[0-9]+)\/.*$/.exec(req.url);
    const apiVersion = requestUrl?.[1];
    switch (apiVersion) {
      case ApiVersions.v1:
        appV1(req, res, next);
        break;
      default:
        throw new BadRequestError(`Path '${req.url}' not found.`);
    }
  });

  /**
   * Error Handler.
   * It should always be the last to catch all errors.
   */

  app.use(errorHandler);
  return app;
}

function setUpV1(): Express {
  console.log('setting up v1');
  // Create Express server
  const app = express();
  setExpressOpenApiConfiguration(app, path.join(__dirname, 'backend-openapi-v1.yaml'), controllers, '/v1/api-doc');

  return app;
}

function setExpressOpenApiConfiguration(
  app: Express,
  yamlSpecFilePath: string,
  controllers: Record<string, Handler>,
  apiDocPath: string,
): void {
  /**
   * Setup OpenAPI validator.
   */
  app.use(
    OpenApiValidator.middleware({
      apiSpec: yamlSpecFilePath,
      validateRequests: true,
      validateResponses: true,
      validateFormats: true,
      fileUploader: false,
      coerceTypes: false,
      validateSecurity: false,
      ignorePaths: /^\/v[0-9]+\/(api-doc(\/.*)?)?$/,
    }),
  );

  controllers;
  /**
   * Setup OpenAPI routing to controllers.
   */
  const openApiDocument = YAML.load(yamlSpecFilePath) as object;
  const connect = connector(controllers, openApiDocument, {
    onCreateRoute: (method: string, descriptor: unknown[]) => {
      const padNum = 7; // length of the longest http method
      console.log(
        `${method.padEnd(padNum).toUpperCase()}: ${String(descriptor[0])} : ${(descriptor[1] as HasName).name}`,
      );
    },
  });

  connect(app);

  // if (isDevelopmentMode())
  /**
   * Render OpenAPI UI specification to /api-doc route.
   */
  app.use(apiDocPath, swaggerUI.serveFiles(openApiDocument), swaggerUI.setup(openApiDocument));
}
