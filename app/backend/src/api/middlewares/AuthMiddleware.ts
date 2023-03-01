import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET || 'jwt_secret';

export default class AuthMiddleware {
  public static verifyToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    console.log(authorization);

    if (!authorization) return res.status(401).json({ message: 'Token not found' });

    try {
      jwt.verify(authorization, secret);
    } catch (err) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    return next();
  }
}
