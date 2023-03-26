import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';

import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly firebase: FirebaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];

    const token = authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await this.firebase.auth.verifyIdToken(token);

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
