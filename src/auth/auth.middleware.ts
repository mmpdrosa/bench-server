import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';

import { auth } from 'src/config/firebase';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];

    const token = authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);

      req['user'] = {
        id: decodedToken.uid,
        role: decodedToken.role,
      };

      next();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
