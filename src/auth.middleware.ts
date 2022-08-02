import { ForbiddenException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (this.checkIfVariableExists('AUTH_API_KEY')) {
      if (req.headers['x-api-key'] !== process.env['AUTH_API_KEY']) {
        throw new ForbiddenException('Invalid API key');
      }
    } else {
      Logger.warn('If you want a protection layer, please set the AUTH_API_KEY environment variable .');
    }

    next();
  }

  private checkIfVariableExists(variable: string) {
    return process.env[variable] !== undefined && process.env[variable] !== '';
  }
}
