import 'express-serve-static-core';
import { Role } from './api-clients/backend-openapi-v1';

export interface UserAuthData {
  username: string;
  roles: Role[];
}

declare module 'express' {
  export interface Request {
    user?: UserAuthData;
  }
}
