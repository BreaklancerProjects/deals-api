import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NotAuthenticatedError } from '../errors/NotAuthenticatedError';
import { getJWTSecret } from '../config/environment';
// import { Role } from '../api-clients/backend-openapi-v1';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

//temp Role type
type Role = {
  name: 'ADMIN';
};
type AuthenticationMiddlewareOpts = {
  ignorePaths: RegExp;
};

type AuthorizationMiddlewareOpts = {
  roleRequired: Role;
  customGuard?: () => boolean;
};

export function AuthenticationMiddleware(options?: AuthenticationMiddlewareOpts) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!options?.ignorePaths || !options.ignorePaths.test(req.url)) {
      try {
        const error = authenticate(req);
        if (error) {
          console.error(error);
          return next(error);
        }
      } catch (error) {
        console.error(error);
        return next(error);
      }
    }

    return next();
  };
}

export function AuthorizationMiddleware(options: AuthorizationMiddlewareOpts) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const originalFn = target[propertyKey];
    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      if (!req.user?.roles.includes(options.roleRequired)) return next(new NotAuthorizedError('Insufficient role'));

      if (typeof options.customGuard === 'function' && !options.customGuard())
        return next(new NotAuthorizedError('Unauthorized'));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return originalFn.call(this, req, res, next);
    };
  };
}

const authenticate = (req: Request): Error | undefined => {
  console.log(`Checking auth for ${req.url}`);

  const authHeaderParts = (req.headers.authorization || (req.headers.Authorization as string))?.split(' ');

  const token = authHeaderParts?.[1];

  if (!token || authHeaderParts[0] !== 'Bearer') {
    console.log('no auth header data');
    return new NotAuthenticatedError('Not authenticated');
  }

  let jwtPayload: JwtPayload;
  try {
    jwtPayload = jwt.verify(token, getJWTSecret()) as JwtPayload;
  } catch (error) {
    return new NotAuthenticatedError('Not authenticated', error);
  }

  const users = [];

  const user = jwtPayload.sub && users.find((user) => jwtPayload.sub === user.username);

  if (!user) return new NotAuthenticatedError('Not authenticated');

  req.user = {
    username: user.username,
    roles: user.roles,
  };
};
